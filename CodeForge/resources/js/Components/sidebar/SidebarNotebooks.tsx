import {
    ArrowUpRight,
    ChevronRight,
    Folder,
    LinkIcon,
    MoreHorizontal,
    StarOff,
    Trash2,
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import {
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    useSidebar,
} from "../ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NotebookWithHierarchy, Page } from "@/types";

import PageTree from "./PageTree";

interface SidebarNotebooksProps {
    notebooks: NotebookWithHierarchy[];
    onAddPage: (page: Page, notebookId: string) => void;
    onEditPage: (pageId: string, newTitle: string, notebookId: string) => void;
}

export default function SidebarNotebooks({
    notebooks,
    onEditPage,
    onAddPage,
}: SidebarNotebooksProps) {
    const { isMobile } = useSidebar();

    return (
        <>
            {notebooks.map((notebook, index) => (
                <SidebarMenuItem key={notebook.id}>
                    <Collapsible
                        className="group/collapsible [&[data-state=open]>button>svg:nth-child(2)]:rotate-90"
                        defaultOpen={index === 0}
                    >
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                                <Folder />
                                {notebook.name}
                                <ChevronRight className="transition-transform" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {notebook.pages.map((page) => (
                                    <PageTree
                                        key={page.id}
                                        page={page}
                                        isMobile={isMobile}
                                        notebookId={notebook.id}
                                        onAddPage={onAddPage}
                                        onEditPage={onEditPage}
                                    />
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                    <NotebookDropdownMenu isMobile={isMobile} />
                </SidebarMenuItem>
            ))}
        </>
    );
}

interface NotebookDropdownMenuProps {
    isMobile: boolean;
}

const NotebookDropdownMenu: React.FC<NotebookDropdownMenuProps> = ({
    isMobile,
}) => {
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
                <DropdownMenuItem>
                    <StarOff className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LinkIcon className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <ArrowUpRight className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
