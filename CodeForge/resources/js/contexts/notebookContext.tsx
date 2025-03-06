import {
    createContext,
    ReactNode,
    startTransition,
    useContext,
    useEffect,
    useOptimistic,
    useState,
} from "react";
import axios from "axios";

interface Notebook {
    id: string;
    name: string;
    description: string;
    spaceId:string;
    pages: Page[];
}

interface Page {
    id: string;
    title: string;
    parentId: string | null;
    ancestors: string[];
    notebookId: string;
}

type Action =
    | { type: "ADD_NOTEBOOK"; payload: Notebook }
    | {
          type: "UPDATE_NOTEBOOK";
          payload: { id: string; name: string; description: string };
      }
    | { type: "DELETE_NOTEBOOK"; payload: string }
    | { type: "ADD_PAGE"; payload: { notebookId: string; newPage: Page } }
    | {
          type: "UPDATE_PAGE";
          payload: { notebookId: string; id: string; title: string };
      }
    | { type: "DELETE_PAGE"; payload: { notebookId: string; id: string } };

interface NotebookContextProps {
    notebooks: Notebook[];
    addNotebook: (notebook: Omit<Notebook, "id" | "pages">) => Promise<void>;
    updateNotebook: (notebook: Omit<Notebook, "pages">) => Promise<void>;
    deleteNotebook: (id: string) => Promise<void>;
    addPage: (
        page: Omit<Page, "id" | "ancestors">
    ) => Promise<void>;
    updatePage: (
        notebookId: string,
        id: string,
        title: string
    ) => Promise<void>;
    deletePage: (notebookId: string, id: string) => Promise<void>;
}

const api = {
    addNotebook: async (
        notebook: Omit<Notebook, "id" | "pages">
    ): Promise<Notebook> => {
        // todo check correct in-out
        const response = await axios.post("/notebooks", notebook);
        console.log("response add", response);
        return response.data;
    },

    updateNotebook: async (
        notebook: Omit<Notebook, "pages">
    ): Promise<void> => {
        // todo check correct in-out
        const response = await axios.patch(
            `/notebooks/${notebook.id}`,
            notebook
        );
        console.log("response update", response.data);
        return response.data;
    },

    deleteNotebook: async (id: string): Promise<void> => {
        // todo check correct in-out
        await axios.delete(`/notebooks/${id}`);
        console.log("response delete", id);
    },

    addPage: async (
        notebookId: string,
        page: Omit<Page, "id" | "ancestors">
    ): Promise<Page> => {
        // todo check correct in-out
        const response = await axios.post(
            `/pages/${notebookId}`,
            page
        );
        return response.data;
    },

    updatePage: async (
        notebookId: string,
        pageId: string,
        title: string
    ): Promise<Page> => {
        const response = await axios.patch(
            `/pages/${notebookId}/pages/${pageId}`,
            { title }
        );
        return response.data;
    },

    deletePage: async (notebookId: string, pageId: string): Promise<void> => {
        await axios.delete(`/pages/${notebookId}/pages/${pageId}`);
    },
};

const NotebooksContext = createContext<NotebookContextProps | undefined>(
    undefined
);

export function useNotebooks() {
    const context = useContext(NotebooksContext);
    if (!context) {
        throw new Error("useNotebook must be used within a NotebookProvider");
    }
    return context;
}

//provider
export function NotebookProvider({
    children,
    providedNotebooks,
}: {
    children: ReactNode;
    providedNotebooks: Notebook[];
}) {
    const [notebooks, setNotebooks] = useState<Notebook[]>(providedNotebooks);

    useEffect(() => {
        console.log("Updating notebooks from providedNotebooks:", providedNotebooks);
        setNotebooks(providedNotebooks);
    }, [providedNotebooks]); // Depend on providedNotebooks

    const calculateAncestors = (
        notebook: Notebook,
        parentId: string | null
    ): string[] => {
        if (!parentId) return [];

        const parent = notebook.pages.find((p) => p.id === parentId);
        if (!parent) return [parentId];

        return [...parent.ancestors, parentId];
    };

    // Optimistic state updates
    const optimisticReducer = (state: Notebook[], action: Action) => {
        switch (action.type) {
            case "ADD_NOTEBOOK": {
                const newNotebook = action.payload;
                return [...state, newNotebook];
            }
            case "UPDATE_NOTEBOOK": {
                const { id, name, description } = action.payload;
                return state.map((notebook) =>
                    notebook.id === id
                        ? { ...notebook, name, description }
                        : notebook
                );
            }
            case "DELETE_NOTEBOOK": {
                const id = action.payload;
                return state.filter((notebook) => notebook.id !== id);
            }
            case "ADD_PAGE": {
                const { notebookId, newPage } = action.payload;
                return state.map((notebook) =>
                    notebook.id === notebookId
                        ? { ...notebook, pages: [...notebook.pages, newPage] }
                        : notebook
                );
            }
            case "UPDATE_PAGE": {
                const { notebookId, id, title } = action.payload;
                return state.map((notebook) =>
                    notebook.id === notebookId
                        ? {
                              ...notebook,
                              pages: notebook.pages.map((page) =>
                                  page.id === id ? { ...page, title } : page
                              ),
                          }
                        : notebook
                );
            }
            case "DELETE_PAGE": {
                const { notebookId, id } = action.payload;
                return state.map((notebook) =>
                    notebook.id === notebookId
                        ? {
                              ...notebook,
                              pages: notebook.pages.filter(
                                  (page) => page.id !== id
                              ),
                          }
                        : notebook
                );
            }
            default:
                return state;
        }
    };

    const [optimisticNotebooks, addOptimisticUpdate] = useOptimistic(
        notebooks,
        optimisticReducer
    );

    // Add a new notebook with optimistic update
    const addNotebook = async (notebook: Omit<Notebook, "id" | "pages">) => {
        // Create temporary ID for optimistic update
        const tempId = `temp-${Date.now()}`;

        // Create optimistic notebook
        const optimisticNotebook: Notebook = {
            ...notebook,
            id: tempId,
            pages: [],
        };

        // Apply optimistic update
        startTransition(() => {
            addOptimisticUpdate({
                type: "ADD_NOTEBOOK",
                payload: optimisticNotebook,
            });
        });

        try {
            // Make API call
            const newNotebook = await api.addNotebook(notebook);
            console.log("response add", newNotebook);
            // add page in notebook
            newNotebook.pages = [];
            // Update actual state with server response
            const newNotebooks = [
                ...notebooks.filter((n) => n.id !== tempId),
                newNotebook,
            ];
            setNotebooks(newNotebooks);

            console.log(
                "Notebook added:",
                newNotebook,
                "with name:",
                newNotebook.name
            );
        } catch (error) {
            // Revert optimistic update on error
            const newNotebooks = notebooks.filter((n) => n.id !== tempId);
            setNotebooks(newNotebooks);

            console.error("Error adding notebook:", error);
        }
    };
    // update a notebook with optimistic update
    const updateNotebook = async (notebook: Omit<Notebook, "pages">) => {
        const prevNotebooks = [...notebooks];
        const { id, name, description } = notebook;

        startTransition(() => {
            addOptimisticUpdate({
                type: "UPDATE_NOTEBOOK",
                payload: { id: id, name: name, description: description },
            });
        });

        try {
            await api.updateNotebook(notebook);
            const newNotebooks = notebooks.map((n) =>
                n.id === id ? { ...n, name, description } : n
            );
            setNotebooks(newNotebooks);
            console.log("Notebook updated:", id, "with name:", name);
        } catch (error) {
            setNotebooks(prevNotebooks);
            console.error("Error updating notebook:", error);
        }
    };

    // Delete a notebook with optimistic update
    const deleteNotebook = async (id: string) => {
        // Store current state for potential rollback
        const previousNotebooks = [...notebooks];

        // Apply optimistic update
        startTransition(() => {
            addOptimisticUpdate({ type: "DELETE_NOTEBOOK", payload: id });
        });
        try {
            // Make API call
            await api.deleteNotebook(id);

            // Update actual state
            const newNotebooks = notebooks.filter((n) => n.id !== id);
            setNotebooks(newNotebooks);

            console.log("Notebook deleted:", id);
        } catch (error) {
            // Revert optimistic update on error
            setNotebooks(previousNotebooks);

            console.error("Error deleting notebook:", error);
        }
    };

    // Add a new page with optimistic update
    const addPage = async (
        page: Omit<Page, "id" | "ancestors">
    ) => {
        const notebook = notebooks.find((n) => n.id === page.notebookId);
        if (!notebook) return;

        // Create temporary ID for optimistic update
        const tempId = `temp-${Date.now()}`;

        // Create optimistic page
        const optimisticPage: Page = {
            ...page,
            id: tempId,
            ancestors: calculateAncestors(notebook, page.parentId),
        };

        // Apply optimistic update
        startTransition(() => {
            addOptimisticUpdate({
                type: "ADD_PAGE",
                payload: { notebookId: page.notebookId, newPage: optimisticPage },
            });
        });

        try {
            // Make API call
            const newPage = await api.addPage(page.notebookId, page);

            // Update actual state with server response
            const newNotebooks = notebooks.map((n) =>
                n.id === page.notebookId
                    ? {
                          ...n,
                          pages: [
                              ...n.pages.filter((p) => p.id !== tempId),
                              newPage,
                          ],
                      }
                    : n
            );
            setNotebooks(newNotebooks);

            console.log("Page added:", newPage, "with title:", newPage.title);
        } catch (error) {
            // Revert optimistic update on error
            const newNotebooks = notebooks.map((n) =>
                n.id === page.notebookId
                    ? {
                          ...n,
                          pages: n.pages.filter((p) => p.id !== tempId),
                      }
                    : n
            );
            setNotebooks(newNotebooks);

            console.error("Error adding page:", error);
        }
    };
    // Update a page with optimistic update
    const updatePage = async (
        notebookId: string,
        id: string,
        title: string
    ) => {
        // Apply optimistic update
        startTransition(() => {
            addOptimisticUpdate({
                type: "UPDATE_PAGE",
                payload: { notebookId, id, title },
            });
        });

        try {
            // Make API call
            await api.updatePage(notebookId, id, title);

            // Update actual state
            const newNotebooks = notebooks.map((notebook) =>
                notebook.id === notebookId
                    ? {
                          ...notebook,
                          pages: notebook.pages.map((page) =>
                              page.id === id ? { ...page, title } : page
                          ),
                      }
                    : notebook
            );

            setNotebooks(newNotebooks);

            console.log("Page updated:", id, "with title:", title);
        } catch (error) {
            // Revert optimistic update on error
            setNotebooks((prev) => [...prev]); // Restore from previous state

            console.error("Error updating page:", error);
        }
    };

    // Delete a page with optimistic update
    const deletePage = async (notebookId: string, id: string) => {
        // Store current state for potential rollback
        const previousNotebooks = [...notebooks];

        // Apply optimistic update
        startTransition(() => {
            addOptimisticUpdate({
                type: "DELETE_PAGE",
                payload: { notebookId, id },
            });
        });

        try {
            // Make API call
            await api.deletePage(notebookId, id);

            // Update actual state
            const newNotebooks = notebooks.map((notebook) =>
                notebook.id === notebookId
                    ? {
                          ...notebook,
                          pages: notebook.pages.filter(
                              (page) => page.id !== id
                          ),
                      }
                    : notebook
            );
            setNotebooks(newNotebooks);

            console.log("Page deleted:", id);
        } catch (error) {
            // Revert optimistic update on error
            setNotebooks(previousNotebooks);

            console.error("Error deleting page:", error);
        }
    };
    const value = {
        notebooks: optimisticNotebooks,
        addNotebook,
        updateNotebook,
        deleteNotebook,
        addPage,
        updatePage,
        deletePage,
    };

    return (
        <NotebooksContext.Provider value={value}>
            {children}
        </NotebooksContext.Provider>
    );
}
// Helper function to get all descendants of a page
function getDescendants(pageId: string, allPages: Page[]): Page[] {
  const directChildren = allPages.filter(p => p.parentId === pageId)
  const descendants = [...directChildren]
  
  directChildren.forEach(child => {
    descendants.push(...getDescendants(child.id, allPages))
  })
  
  return descendants
}