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
import { useNotebooks } from "./notebookContext";
import { useState } from "react";

interface Page {
    id: string;
    title: string;
    parentId: string | null;
    ancestors: string[];
    notebookId: string;
}

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
    const [isExpanded, setIsExpanded] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(page.title);
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const notebook = notebooks.find((n) => n.id === notebookId);
    if (!notebook) return null;

    const children = notebook.pages.filter((p) => p.parentId === page.id);
    const isFolder = children.length > 0;
    const hasChildren = children.length > 0;

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

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
            setIsExpanded(true);
        }
    };

    return (
        <div>
            <div className="flex items-center py-1 group">
                <div
                    className="flex items-center w-full"
                    style={{ paddingLeft: `${level * 16}px` }}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleToggle}
                        disabled={isLoading}
                    >
                        {hasChildren ? (
                            isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )
                        ) : (
                            <div className="w-4" />
                        )}
                    </Button>

                    {isFolder ? (
                        <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                        <File className="h-4 w-4 mr-2 text-muted-foreground" />
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
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="h-7 py-1"
                                autoFocus
                                onBlur={handleRename}
                                disabled={isLoading}
                            />
                        </form>
                    ) : (
                        <span
                            className={`flex-1 truncate ${
                                isLoading ? "opacity-50" : ""
                            }`}
                        >
                            {page.title}
                        </span>
                    )}

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
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => setIsRenaming(true)}
                                disabled={isLoading}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setIsAddingPage(true)}
                                disabled={isLoading}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Page
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
            </div>

            {isAddingPage && (
                <div
                    className="flex items-center py-1"
                    style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
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
                            className="h-7 py-1"
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

            {isExpanded && children.length > 0 && (
                <div>
                    {children.map((child) => (
                        <TreeItem
                            key={child.id}
                            notebookId={notebookId}
                            page={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
