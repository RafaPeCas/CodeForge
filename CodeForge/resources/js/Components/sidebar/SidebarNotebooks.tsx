import { ArrowUpRight, ChevronRight, File, Folder, Link, MoreHorizontal, StarOff, Trash2 } from "lucide-react";
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
} from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Page {
    id: { $oid: string };
    title: string;
    subPages: Page[];
}

interface Notebook {
    id: string;
    name: string;
    description: string;
    spaceId: string;
    pages: Page[];
    updated_at: string;
    created_at: string;
}

export default function SidebarNotebooks({
    notebooks,
}: {
    notebooks: Notebook[];
}) {
    return (
        <>
            {notebooks.map((notebook) => (
                <SidebarMenuItem key={notebook.id}>
                    <Collapsible
                        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                        defaultOpen={false} // You can customize this based on default state
                    >
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                                <ChevronRight className="transition-transform" />
                                <Folder />
                                {notebook.name}
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {notebook.pages.map((page) => (
                                    <PageComponent
                                        key={page.id.$oid}
                                        page={page}
                                    />
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarMenuItem>
            ))}
        </>
    );
}

const PageComponent: React.FC<{ page: Page }> = ({ page }) => {
    const { title, subPages } = page;

    // If there are no subpages, render a simple button
    if (!subPages.length) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <File />
                    {title}
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    // If there are subpages, render a collapsible section
    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={false} // You can customize this based on default state
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRight className="transition-transform" />
                        <Folder />
                        {title}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {subPages.map((subPage) => (
                            <PageComponent
                                key={subPage.id.$oid}
                                page={subPage}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
};

const NotebookDropdownMenu: React.FC = () => {
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
    <StarOff className="text-muted-foreground" />
    <span>Remove from Favorites</span>
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem>
    <Link className="text-muted-foreground" />
    <span>Copy Link</span>
  </DropdownMenuItem>
  <DropdownMenuItem>
    <ArrowUpRight className="text-muted-foreground" />
    <span>Open in New Tab</span>
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem>
    <Trash2 className="text-muted-foreground" />
    <span>Delete</span>
  </DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
    )
}

