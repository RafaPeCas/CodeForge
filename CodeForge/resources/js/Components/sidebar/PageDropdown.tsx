import { Page } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenuAction } from "../ui/sidebar";
import { Edit, LinkIcon, MoreHorizontal, Move, Plus, Trash2 } from "lucide-react";

interface PageDropdownProps {
    isMobile: boolean;
    newPage: any; // Define the proper type for `newPage` here
    notebookId: string;
    onAddPage: (page: any, notebookId: string) => void;
    onEdit: () => void;
  }
  
export default function PageDropdown({ isMobile, newPage, notebookId, onAddPage, onEdit }: PageDropdownProps) {
  
    const handleAddSubpage = () => {
        // Crear un ID temporal para evitar fallos en la UI
        const tempId = crypto.randomUUID();

        // Página temporal (se verá inmediatamente)
        const tempSubpage: Page = {
            id: tempId, // Temporal
            title: "New Page",
            parentId: newPage.id,
            ancestors: [...newPage.ancestors, newPage.id],
            subPages: [],
        };

        onAddPage(tempSubpage, notebookId); 

    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
            >
                <DropdownMenuItem onClick={handleAddSubpage}>
                    <Plus className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Add</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                    <Edit className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Move className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Move</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LinkIcon className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}