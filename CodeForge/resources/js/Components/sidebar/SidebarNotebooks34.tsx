import { useState, useRef } from "react";
import { z } from "zod";
import { Plus, Edit, File, Folder, ChevronRight, MoreHorizontal, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuAction } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

// Zod schema for validating page titles
const pageSchema = z.object({
    title: z.string().min(1, "Title cannot be empty").max(50, "Title is too long"),
});

interface Page {
    id: string;
    title: string;
    subPages: Page[];
}

import axios from "axios"; // Import Axios for API calls

const PageComponent: React.FC<{ page: Page; isMobile: boolean; updatePage: (updatedPage: Page) => void }> = ({ page, isMobile, updatePage }) => {
    const { title, subPages } = page;
    const [pages, setPages] = useState<Page[]>(subPages);
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Function to add a new subpage

    const handleAddSubPage = async () => {
        try {
            const response = await axios.post("http://your-laravel-api.com/api/pages", {
                title: "New SubPage",
                notebookId: currentNotebookId, // Replace with the actual notebook ID
                parentPage: page.id, // If it's a subpage, send the parent ID
            });
    
            const newPage = response.data; // Get new page data from backend
    
            setPages([...pages, newPage]); // Update state with the new page
            setEditingPageId(newPage._id); // Make the new page immediately editable
            setNewTitle(newPage.title);
    
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100); // Auto-focus the input field
    
        } catch (error) {
            console.error("Error creating subpage:", error);
            alert("Failed to create subpage. Please try again.");
        }
    };

    // Function to edit a subpage title
    const handleEdit = (id: string, title: string) => {
        setEditingPageId(id);
        setNewTitle(title);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    // Function to save edited title
    const handleSaveTitle = (id: string) => {
        const result = pageSchema.safeParse({ title: newTitle });

        if (!result.success) {
            alert(result.error.issues[0].message); // Handle validation error
            return;
        }

        setPages(pages.map((p) => (p.id === id ? { ...p, title: newTitle } : p)));
        setEditingPageId(null);
        updatePage({ ...page, subPages: pages });
    };

    // Function to handle input blur (auto-save on blur)
    const handleBlur = (id: string) => {
        if (editingPageId === id) {
            handleSaveTitle(id);
        }
    };

    return (
        <SidebarMenuItem>
            <Collapsible className="group/collapsible [&[data-state=open]>button>svg:nth-child(2)]:rotate-90">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <Folder />
                        {editingPageId === page.id ? (
                            <input
                                ref={inputRef}
                                type="text"
                                className="bg-transparent border-b focus:outline-none w-full"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onBlur={() => handleBlur(page.id)}
                                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle(page.id)}
                            />
                        ) : (
                            title
                        )}
                        <ChevronRight className="transition-transform" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {pages.map((subPage) => (
                            <PageComponent key={subPage.id} page={subPage} isMobile={isMobile} updatePage={updatePage} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                    </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"}>
                    <DropdownMenuItem onClick={handleAddSubPage}>
                        <Plus className="text-muted-foreground mr-2 h-4 w-4" />
                        <span>Add Subpage</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(page.id, page.title)}>
                        <Edit className="text-muted-foreground mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
};

export default PageComponent;
