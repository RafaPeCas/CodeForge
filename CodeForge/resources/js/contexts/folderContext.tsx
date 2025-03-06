import { Page } from "@/types";
import axios from "axios";
import {
    useState,
    useContext,
    useEffect,
    useOptimistic,
    createContext,
} from "react";

interface PageContextType {
    pages: Page[];
    isLoading: boolean;
    addPage: (previousPage: Page | null, notebookId: string, title: string, parentId: string | null) => Promise<void>;
    renamePage: (id: string, newName: string) => Promise<void>;
    deletePage: (id: string) => Promise<void>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: React.ReactNode }) {
    const [Pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Optimistic state updates
    const [optimisticPages, addOptimisticPages] = useOptimistic(
        Pages,
        (state, newPage: Page) => [...state, newPage]
    );

    async function getPages() {
        // sería raw Pages
        // sub pages es innecesario, con parentId y filters es suficiente
        return axios.get("/api/pages").then((res) => res.data);
    }

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const data: Page[] = await getPages();
                setPages(data);
            } catch (error) {
                console.error("Failed to fetch pages:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPages();
    }, []);
    // add new Page with optimistic
    const handleAddPage = async (
        previousPage: Page | null,
        notebookId: string,
        title: string,
        parentId: string | null
    ) => {
        // Create an optimistic Page if is a subPage or a root Page
        let optimisticPage: Page;

        if (previousPage && parentId) {
            optimisticPage = {
                id: `optimistic-${Date.now()}`,
                title,
                parentId,
                notebookId: previousPage.notebookId,
                ancestors: [...previousPage.ancestors, parentId],
                subPages: [],
            };
        } else {
            optimisticPage = {
                id: `optimistic-${Date.now()}`,
                title,
                parentId,
                notebookId: notebookId,
                ancestors: [],
                subPages: [],
            };
        }

        // Add to UI immediately
        addOptimisticPages(optimisticPage);

        try {
            // Perform the actual server action
            const { id, ...pageData } = optimisticPage;
            const newPage = await axios.post('/api/pages', pageData).then(res => res.data);

            // Update the state with the real data
            const newPages = Pages.map((page) =>
                page.id === optimisticPage.id ? newPage : page
            );
            setPages(newPages);

        } catch (error) {
            console.error("Failed to add Page:", error);
            // Remove the optimistic Page
            const newPages = Pages.filter((page) => page.id !== optimisticPage.id);
            setPages(newPages);
        }
    }
        const handleRenamePage = async (id: string, newTitle: string) => {
            try {
                // Optimistic update
                const newPages = Pages.map((page) =>
                    page.id === id ? { ...page, title: newTitle } : page
                );
                setPages(newPages);
                await axios.patch(`/api/pages/${id}`, { title: newTitle });
            } catch (error) {
                console.error("Failed to rename page:", error);
                // Fetch fresh data on error to reset state
                const freshPages = await getPages();
                setPages(freshPages);
            }
        };

        // Delete a page
        const handleDeletePage = async (id: string) => {
            // Store the current state for potential rollback
            const previousPages = [...Pages];

            try {
                // Helper function to get all descendant page IDs
                const getDescendantIds = (PagesId: string): string[] => {
                    const childPages = Pages.filter(
                        (f) => f.parentId === PagesId
                    );
                    const childIds = childPages.map((f) => f.id);
                    const descendantIds = childIds.flatMap((childId) =>
                        getDescendantIds(childId)
                    );
                    return [...childIds, ...descendantIds];
                };

                const idsToRemove = [id, ...getDescendantIds(id)];

                // Optimistic update
                const newPages = Pages.filter((page) => !idsToRemove.includes(page.id));
                setPages(newPages);

                // Perform the server action
                // remove from ancestors
                await axios.delete(`/api/pages/${id}`);
            } catch (error) {
                console.error("Failed to delete page:", error);
                // Restore previous state on error
                setPages(previousPages);
            }
        };

    const value = {
        pages: optimisticPages,
        isLoading,
        addPage: handleAddPage,
        renamePage: handleRenamePage,
        deletePage: handleDeletePage,
    };

    return (
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    );
}
