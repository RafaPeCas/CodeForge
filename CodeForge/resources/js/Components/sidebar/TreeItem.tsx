import {
    ChevronDown,
    ChevronRight,
    File,
    Folder,
    MoreHorizontal,
    Plus,
    Trash,
    Edit,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useNotebooks } from "../../contexts/notebookContext";
import { useState } from "react";
import { Page } from "@/types";
import {
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/Components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";

export function TreeItem({
    notebookId,
    page,
    level = 0,
}: {
    notebookId: string;
    page: Page;
    level?: number;
}) {
    const { notebooks, updatePage, deletePage, addPage } = useNotebooks();
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(page.title);
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const notebook = notebooks.find((n) => n.id === notebookId);
    if (!notebook) return null;

    const children = notebook.pages.filter((p) => p.parentId === page.id);
    const isFolder = children.length > 0;
    const hasChildren = children.length > 0;

    const handleRename = async () => {
        if (newTitle.trim() && newTitle !== page.title) {
            setIsLoading(true);
            await updatePage(notebookId, page.id, newTitle);
            setIsLoading(false);
        }
        setIsRenaming(false);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        await deletePage(notebookId, page.id);
        setIsLoading(false);
    };

    const handleAddPage = async () => {
        if (newPageTitle.trim()) {
            setIsLoading(true);
            await addPage({
                title: newPageTitle,
                parentId: page.id,
                notebookId: notebook.id,
            });
            setIsLoading(false);
            setNewPageTitle("");
            setIsAddingPage(false);
        }
    };

    return (
        <Collapsible className="group/collapsible">
            <CollapsibleTrigger
                asChild
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                // className="bg-red-500"
            >
                <SidebarMenuSubItem
                    className="group/item cursor-pointer flex flex-row items-center justify-between hover:backdrop-brightness-95 rounded-md"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <div className="flex items-center">
                        {/* Show ChevronRight if hovered or collapsible is open */}
                        {isHover && hasChildren ? (
                            <ChevronRight className="h-4 w-4 mr-2 transition-transform duration-200 ease-in-out group-data-[state=open]/item:rotate-90" />
                        ) : // Show Folder or File icon based on `isFolder`
                        isFolder ? (
                            <Folder className="h-4 w-4 mr-2 shrink-0 text-sidebar-foreground/70" />
                        ) : (
                            <File className="h-4 w-4 mr-2 shrink-0 text-sidebar-foreground/70" />
                        )}

                        {isRenaming ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleRename();
                                }}
                                className="flex-1"
                            >
                                <Input
                                    value={newTitle}
                                    onChange={(e) =>
                                        setNewTitle(e.target.value)
                                    }
                                    className="h-7 py-1 bg-sidebar-accent text-sidebar-foreground"
                                    autoFocus
                                    onBlur={handleRename}
                                    disabled={isLoading}
                                />
                            </form>
                        ) : (
                            page.title
                        )}
                    </div>
                    <div className="flex items-center mr-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    disabled={isLoading}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">
                                        More options
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onMouseEnter={() => setIsHover(false)} className="w-48 *:cursor-pointer">
                                <DropdownMenuItem
                                    onClick={() => setIsAddingPage(true)}
                                    disabled={isLoading}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Page
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsRenaming(true)}
                                    disabled={isLoading}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    className="text-destructive focus:text-destructive"
                                    disabled={isLoading}
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </SidebarMenuSubItem>
            </CollapsibleTrigger>

            {isAddingPage && (
                <div
                    className="py-1"
                    style={{ paddingLeft: `${(level + 1) * 12 + 24}px` }}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddPage();
                        }}
                        className="flex-1"
                    >
                        <Input
                            value={newPageTitle}
                            onChange={(e) => setNewPageTitle(e.target.value)}
                            placeholder="New page title"
                            className="h-7 py-1 bg-sidebar-accent text-sidebar-foreground"
                            autoFocus
                            disabled={isLoading}
                            onBlur={() => {
                                if (newPageTitle.trim()) {
                                    handleAddPage();
                                } else {
                                    setIsAddingPage(false);
                                }
                            }}
                        />
                    </form>
                </div>
            )}

            {hasChildren && (
                <CollapsibleContent>
                    <SidebarMenuSub className="mx-0 pr-0">
                        {children.map((child) => (
                            <TreeItem
                                key={child.id}
                                notebookId={notebookId}
                                page={child}
                                level={level + 1}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            )}
        </Collapsible>
    );
}
