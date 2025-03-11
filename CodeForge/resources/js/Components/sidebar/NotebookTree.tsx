import { useState } from "react";
import { useNotebooks } from "../../contexts/notebookContext";
import { TreeItem } from "./TreeItem";
import {
    Book,
    ChevronRight,
    Edit,
    MoreHorizontal,
    Plus,
    Trash,
} from "lucide-react";
import { Button } from "@/Components";
import { Input } from "@/Components/ui/input";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuSub, useSidebar } from "@/Components/ui/sidebar";
import { Notebook } from "@/types";

export function NotebookTree({ notebook }: { notebook: Notebook }) {
    const { addPage } = useNotebooks();
    const { open } = useSidebar();
    const [isAddingRootPage, setIsAddingRootPage] = useState(false);
    const [newRootPageTitle, setNewRootPageTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHover, setIsHover] = useState(false);
    // Get root level pages
    const rootPages = notebook.pages.filter((p) => p.parentId === null);

    const handleAddRootPage = async () => {
        if (newRootPageTitle.trim()) {
            setIsLoading(true);
            await addPage({
                notebookId: notebook.id,
                title: newRootPageTitle,
                parentId: null,
            });
            setIsLoading(false);
            setNewRootPageTitle("");
            setIsAddingRootPage(false);
        }
    };
    // todo dropdown menu crud notebooks
    return (
        <Collapsible className="group/collapsible" disabled={rootPages.length === 0}>
            <CollapsibleTrigger
                asChild
                onMouseEnter={() => open && setIsHover(true)}
                onMouseLeave={() => open && setIsHover(false)}
                // className="bg-red-700"
            >
                <SidebarMenu
                    className="cursor-pointer flex flex-row justify-between items-center my-1 p-2 hover:backdrop-brightness-95 rounded-md"
                >
                    <div className="flex items-center">
                        {isHover && rootPages.length > 0 ? (
                            <ChevronRight className="h-5 w-5 transition-transform duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                        ) : (
                            <Book className="h-5 w-5" />
                        )}
                        <span className="group-data-[collapsible=icon]:hidden ml-2 select-none">
                    {notebook.name}
                        </span>
                    </div>
                    <div className="flex items-center group-data-[collapsible=icon]:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                    disabled={isLoading}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onMouseEnter={() => setIsHover(false)} className="*:cursor-pointer">
                                <DropdownMenuItem
                                    onClick={() => setIsAddingRootPage(true)}
                                    disabled={isLoading}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Page
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    // onClick={() => setIsRenaming(true)}
                                    disabled={isLoading}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    // onClick={handleDelete}
                                    className="text-destructive focus:text-destructive"
                                    disabled={isLoading}
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </SidebarMenu>
            </CollapsibleTrigger>

            {isAddingRootPage && (
                <div className="px-3 py-1">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddRootPage();
                        }}
                    >
                        <Input
                            value={newRootPageTitle}
                            onChange={(e) =>
                                setNewRootPageTitle(e.target.value)
                            }
                            placeholder="New page title"
                            className="h-7 py-1"
                            autoFocus
                            disabled={isLoading}
                            onBlur={() => {
                                if (newRootPageTitle.trim()) {
                                    handleAddRootPage();
                                } else {
                                    setIsAddingRootPage(false);
                                }
                            }}
                        />
                    </form>
                </div>
            )}

            <CollapsibleContent>
                <SidebarMenuSub>
                    {rootPages.map((page) => (
                        <TreeItem
                            key={page.id}
                            notebookId={notebook.id}
                            page={page}
                        />
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    );
}
