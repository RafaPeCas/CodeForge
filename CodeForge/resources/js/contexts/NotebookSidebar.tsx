import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/Components/ui/sidebar";
import { Book, DoorOpen, Edit, FormInputIcon, Home, PanelLeftIcon, Trash } from "lucide-react";
import { AddNotebookDialog } from "./AddDialog";
import { NotebookTree } from "./NotebookTree";
import { Button } from "@/Components";
import { useNotebooks } from "./notebookContext";
import { SpaceSwitch } from "@/Components/sidebar/SpaceSwitch";
import { Link } from "@inertiajs/react";

const nav = [
    {
        title: "Dashboard",
        route: "dashboard",
        icon: Home,
    },
    {
        title: "Form",
        route: "Form",
        icon: FormInputIcon,
    },
    {
        title: "Main",
        route: "sidebarPage",
        icon: PanelLeftIcon,
    },
    {
        title: "Profile",
        route: "profile.edit",
        icon: Edit,
    },
    {
        title: "Logout",
        route: "logout",
        icon: DoorOpen,
        method: "post",
        as: "button",
    },
];

const handleLogout = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("activeSpace");
};

interface Space {
    name: string;
    logo: string;
    plan: string;
    id: string;
}

interface NotebookProps {
    spaces: Space[];
    fetchSpaces: () => void;
    fetchNotebooks: () => void;
}
export function NotebookSidebar({
    spaces,
    fetchSpaces,
    fetchNotebooks,
}: NotebookProps) {
    const { notebooks, deleteNotebook } = useNotebooks();
    console.log("Notebooks from context:", notebooks);
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SpaceSwitch
                    spaces={spaces}
                    onSpaceCreated={fetchSpaces}
                    onSpaceChanged={fetchNotebooks}
                />
            </SidebarHeader>
            <SidebarContent>
            <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {nav.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        {item.method ? (
                                            <Link
                                                onClick={handleLogout}
                                                href={route(item.route)}
                                                method={
                                                    item.method as
                                                        | "post"
                                                        | "put"
                                                        | "delete"
                                                        | "patch"
                                                }
                                                as={item.as}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        ) : (
                                            <Link href={route(item.route)}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg">
                                <div className="flex items-center">
                                    <Book className="h-5 w-5 mr-2" />
                                    <span className="font-medium">
                                        Notebooks
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <AddNotebookDialog />
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
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
