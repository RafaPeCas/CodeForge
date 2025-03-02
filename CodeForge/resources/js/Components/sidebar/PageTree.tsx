import { Page } from "@/types";
import { useEffect, useState } from "react";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
} from "../ui/sidebar";
import { ChevronRight, File, Folder } from "lucide-react";
import PageDropdown from "./PageDropdown";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";

interface PageTreeProps {
    page: Page;
    notebookId: string;
    onAddPage: (page: Page, notebookId: string) => void;
    onEditPage: (pageId: string, newTitle: string, notebookId: string) => void;
    isMobile: boolean;
}

export default function PageTree({
    isMobile,
    page,
    notebookId,
    onAddPage,
    onEditPage,
}: PageTreeProps) {
    const { title, subPages } = page;
    const [isEditing, setIsEditing] = useState(false);
    const [newData, setNewData] = useState<Page>(page);

    // Sync local state when page prop changes
    useEffect(() => {
        setNewData(page);
    }, [page]);

    const handleEdit = () => setIsEditing(true);

    const handleBlur = () => {
        setIsEditing(false);
        if (newData.title !== page.title) {
            onEditPage(page.id, newData.title, notebookId);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            onEditPage(page.id, newData.title, notebookId);
        } else if (e.key === "Escape") {
            setNewData(page);
            setIsEditing(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewData((prev) => ({ ...prev, title: e.target.value }));
    };

    // If there are no subpages, render a simple button
    if (!subPages?.length) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <File />
                    {isEditing ? (
                        <input
                            type="text"
                            value={newData.title}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            className="bg-transparent border-none text-inherit outline-none p-0"
                        />
                    ) : (
                        <span>{newData.title}</span>
                    )}
                </SidebarMenuButton>
                {/* Add the PageDropdownMenu */}
                <PageDropdown
                    isMobile={isMobile}
                    notebookId={notebookId}
                    newPage={page}
                    onAddPage={onAddPage}
                    onEdit={handleEdit}
                />
            </SidebarMenuItem>
        );
    }

    // If there are subpages, render a collapsible section
    return (
        <SidebarMenuItem className="me-0 pe-0">
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:nth-child(2)]:rotate-90 me-0 pe-0"
                defaultOpen={false}
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <Folder />
                        {isEditing ? (
                            <input
                                type="text"
                                value={newData.title}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                                className="bg-transparent border-none text-inherit outline-none p-0"
                            />
                        ) : (
                            <span>{newData.title}</span>
                        )}
                        <ChevronRight className="transition-transform" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub className="me-0 pe-0">
                        {subPages.map((subPage) => (
                            <PageTree
                                key={subPage.id}
                                page={subPage}
                                notebookId={notebookId}
                                isMobile={isMobile}
                                onAddPage={onAddPage}
                                onEditPage={onEditPage}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
            <PageDropdown
                isMobile={isMobile}
                notebookId={notebookId}
                newPage={page}
                onAddPage={onAddPage}
                onEdit={handleEdit}
            />
        </SidebarMenuItem>
    );
}
