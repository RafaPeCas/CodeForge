import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/Components/ui/sidebar";
import { Book, Trash } from "lucide-react";
import { AddNotebookDialog } from "./AddDialog";
import { NotebookTree } from "./NotebookTree";
import { Button } from "@/Components";
import { useNotebooks } from "./notebookContext";

export function NotebookSidebar() {
    const { notebooks, deleteNotebook } = useNotebooks();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex items-center">
                                <Book className="h-5 w-5 mr-2" />
                                <span className="font-medium">Notebooks</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <AddNotebookDialog />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {notebooks.map((notebook) => (
                        <SidebarMenuItem key={notebook.id}>
                            <NotebookTree notebook={notebook} />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive ml-3 mt-2"
                                onClick={() => deleteNotebook(notebook.id)}
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Notebook
                            </Button>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
