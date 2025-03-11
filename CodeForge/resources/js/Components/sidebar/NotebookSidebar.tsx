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
import { DoorOpen, Edit, FormInputIcon, Home, PanelLeftIcon } from "lucide-react";

import { NotebookTree } from "./NotebookTree";
import { useNotebooks } from "../../contexts/notebookContext";
import { SpaceSwitch } from "@/Components/sidebar/SpaceSwitch";
import { Link, usePage } from "@inertiajs/react";
import { Space } from "@/types";
import { AddNotebookDialog } from "./AddDialog";

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
    const { notebooks } = useNotebooks();
    const user = usePage().props.auth.user;
    
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
                    <SidebarGroupLabel>Application,{user.username}</SidebarGroupLabel>
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
                            <SidebarGroupLabel className="flex items-center justify-between">
                                <span>
                                Notebooks
                                </span>
                                <AddNotebookDialog />
                                </SidebarGroupLabel>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <SidebarMenu>
                        {notebooks.map((notebook) => (
                            <SidebarMenuItem key={notebook.id}>
                                <NotebookTree notebook={notebook} />
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
