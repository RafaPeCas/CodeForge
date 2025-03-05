import { useState } from "react";
import { useNotebooks } from "./notebookContext";
import { TreeItem } from "./TreeItem";
import { Book, ChevronRight, FolderPlus } from "lucide-react";
import { Button } from "@/Components";
import { Input } from "@/Components/ui/input";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuSub } from "@/Components/ui/sidebar";

interface Page {
    id: string;
    title: string;
    parentId: string | null;
    ancestors: string[];
    notebookId: string;
}

interface Notebook {
    id: string;
    name: string;
    description: string;
    spaceId: string;
    pages: Page[];
}

export function NotebookTree({ notebook }: { notebook: Notebook }) {
    const { addPage } = useNotebooks();
    const [isAddingRootPage, setIsAddingRootPage] = useState(false);
    const [newRootPageTitle, setNewRootPageTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        <Collapsible className="group/collapsible [&[data-state=open]>button>svg:nth-child(3)]:rotate-90">
            <CollapsibleTrigger asChild>
                <SidebarMenuButton onClick={() => setIsAddingRootPage(true)}>
                    <Book className="h-5 w-5 mr-2" />
                    {notebook.name}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setIsAddingRootPage(true)}
                        disabled={isLoading}
                    >
                        <FolderPlus className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="transition-transform" />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            
            {/* <div className="flex items-center justify-between px-3 mb-2">
                <div className="flex items-center">
                    <h3 className="font-medium">{notebook.name}</h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsAddingRootPage(true)}
                    disabled={isLoading}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div> */}

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
