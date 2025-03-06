import {
    DoorOpen,
    Edit,
    FormInputIcon,
    Home,
    PanelLeftIcon,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/Components/ui/sidebar";

import { SpaceSwitch } from "@/Components/sidebar/SpaceSwitch";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import SidebarNotebooks from "./SidebarNotebooks";
import { Notebook, NotebookWithHierarchy, Page, RawPage } from "@/types";

// Menu items.
const items = [
    {
        title: "Dashboard",
        route: "dashboard",
        icon: Home,
    },
    {
        title: "Form",
        route: "Form",
        icon: FormInputIcon,
    },
    {
        title: "Main",
        route: "sidebarPage",
        icon: PanelLeftIcon,
    },
    {
        title: "Profile",
        route: "profile.edit",
        icon: Edit,
    },
    {
        title: "Logout",
        route: "logout",
        icon: DoorOpen,
        method: "post",
        as: "button",
    },
];

export function SidebarComponent() {
    const [spaces, setSpaces] = useState([
        {
            name: "Cargando...",
            logo: "DefaultLogo",
            plan: "Cargando...",
            id: "",
        },
    ]);
    const [notebooks, setNotebooks] = useState<NotebookWithHierarchy[]>([]);

    const fetchSpaces = async () => {
        try {
            const response = await axios.get("/sidebar");
            const transformedSpaces = response.data.map((space: any) => ({
                name: space.name,
                id: space.id.$oid,
                logo: "",
                plan: "Author",
            }));

            setSpaces(transformedSpaces);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Normalize ancestors
    const normalizeAncestors = (pages: RawPage[]): Page[] => {
        return pages.map((page) => ({
            ...page,
            ancestors: page.ancestors.map((ancestor) => ancestor.$oid), // Convert ancestors to string[]
            subPages: page.subPages
                ? normalizeAncestors(page.subPages)
                : undefined, // Recursively normalize subPages
        }));
    };

    // Fetch notebooks and build hierarchy
    const fetchNotebooks = async (): Promise<void> => {
        const savedSpace = localStorage.getItem("activeSpace");
        let spaceId: string;

        if (savedSpace) {
            spaceId = JSON.parse(savedSpace).id;
        } else if (spaces.length > 0) {
            spaceId = spaces[0].id;
        } else {
            console.error("No space ID available");
            return;
        }

        try {
            // Fetch notebooks and their pages from the backend
            const response = await axios.get<Notebook[]>(
                `notebooks/${spaceId}`
            );
            const notebooksWithPages = response.data;
            console.log("raw",notebooksWithPages);
            
            // Build the hierarchical structure for each notebook's pages
            const notebooksWithHierarchy: NotebookWithHierarchy[] =
                notebooksWithPages.map((notebook) => {
                    const normalizedPages = normalizeAncestors(notebook.pages); // Normalize ancestors
                    return {
                        ...notebook,
                        pages: buildHierarchy(normalizedPages), // Build hierarchy with normalized pages
                    };
                });

            console.log(notebooksWithHierarchy);
            setNotebooks(notebooksWithHierarchy);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Helper function to build the hierarchical structure of pages
    const buildHierarchy = (pages: Page[]): Page[] => {
        if (!pages || pages.length === 0) {
            return []; // Return an empty array if pages is undefined or empty
        }

        const pageMap = new Map<string, Page>();

        // Create a map of pages by their id
        pages.forEach((page) => {
            pageMap.set(page.id, { ...page, subPages: [] });
        });

        // Build the hierarchy
        const rootPages: Page[] = [];
        pages.forEach((page) => {
            if (page.parentId === null) {
                // This is a root page
                rootPages.push(pageMap.get(page.id)!);
            } else {
                // This is a subpage; add it to its parent's subpages array
                const parentPage = pageMap.get(page.parentId);
                if (parentPage) {
                    parentPage.subPages!.push(pageMap.get(page.id)!); // Use ! to assert subPages exists
                }
            }
        });

        return rootPages;
    };

    useEffect(() => {
        fetchSpaces();
        fetchNotebooks();
    }, []);

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        localStorage.removeItem("activeSpace");
    };

    const onAddPage = (page: Page, notebookId: string) => {
        //todo save on server function
        // Crear una copia actualizada de los notebooks
        const updatedNotebooks = notebooks.map((notebook) => {
            if (notebook.id !== notebookId) return notebook;

            // Función recursiva para agregar la página en la jerarquía correcta
            const addPageToHierarchy = (pages: Page[]): Page[] => {
                return pages.map((currentPage) => {
                    // Encontrar la página padre y agregar la subpágina
                    if (currentPage.id === page.parentId) {
                        return {
                            ...currentPage,
                            subPages: [...(currentPage.subPages || []), page],
                        };
                    }

                    // Buscar recursivamente en subpáginas
                    if (currentPage.subPages?.length) {
                        return {
                            ...currentPage,
                            subPages: addPageToHierarchy(currentPage.subPages),
                        };
                    }

                    return currentPage;
                });
            };

            return page.parentId
                ? {
                      ...notebook,
                      pages: addPageToHierarchy(notebook.pages),
                  }
                : {
                      ...notebook,
                      pages: [...notebook.pages, page], // Agregar como página raíz
                  };
        });

        setNotebooks(updatedNotebooks);
        console.log("added", updatedNotebooks);
    };
    const onEditPage = (pageId: string, newTitle: string, notebookId: string) => {
        // Update the notebooks state
        const updatedNotebooks = notebooks.map(notebook => {
            if (notebook.id !== notebookId) return notebook;
    
            const updatePageTitle = (pages: Page[]): Page[] => pages.map(page => {
                if (page.id === pageId) {
                    return { ...page, title: newTitle };
                }
                if (page.subPages?.length) {
                    return { ...page, subPages: updatePageTitle(page.subPages) };
                }
                return page;
            });
    
            return {
                ...notebook,
                pages: updatePageTitle(notebook.pages)
            };
        });
    
        setNotebooks(updatedNotebooks);
        // Here you would typically also make an API call to persist the change
    };
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SpaceSwitch
                    spaces={spaces}
                    onSpaceCreated={fetchSpaces}
                    onSpaceChanged={fetchNotebooks}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        {item.method ? (
                                            <Link
                                                onClick={handleLogout}
                                                href={route(item.route)}
                                                method={
                                                    item.method as
                                                        | "post"
                                                        | "put"
                                                        | "delete"
                                                        | "patch"
                                                }
                                                as={item.as}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        ) : (
                                            <Link href={route(item.route)}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Notebooks</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarNotebooks
                                notebooks={notebooks}
                                onAddPage={onAddPage}
                                onEditPage={onEditPage}
                            />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {/* <SidebarFooter>
                <SpaceSwitch /> 
            </SidebarFooter> */}

            <SidebarRail />
        </Sidebar>
    );
}