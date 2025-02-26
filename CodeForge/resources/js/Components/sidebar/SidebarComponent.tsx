import {
    AudioWaveform,
    DoorOpen,
    Edit,
    FormInputIcon,
    GalleryVerticalEnd,
    Home,
    PanelLeftIcon,
} from "lucide-react";

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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/Components/ui/sidebar";

import { SpaceSwitch } from "@/Components/sidebar/SpaceSwitch";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";

// Menu items.
const items = [
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

export function SidebarComponent() {
    const [spaces, setSpaces] = useState([
        {
            name: "Cargando...",
            logo: "DefaultLogo",
            plan: "Cargando...",
        },
    ]);
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);

    const fetchSpaces = async () => {
        try {
            const response = await axios.get("/sidebar");
            setSpaces(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchNotebooks = async ({ spaceId }: { spaceId: String }) => {
        try {
            const response = await axios.get(`notebooks/${spaceId}`);
            console.log(response.data);
            
            setNotebooks(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchSpaces();
        fetchNotebooks({spaceId:"67bf3553d2a75407fb08ecca"});
    }, []);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SpaceSwitch spaces={spaces} onSpaceCreated={fetchSpaces} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        {item.method ? (
                                            <Link
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
                <SidebarGroupLabel>Notebooks</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {notebooks.map((notebook) => (
                                <SidebarMenuItem key={notebook._id}>
                                        <SidebarMenuButton asChild>
                                            <span>{notebook.name}</span>
                                        </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        {notebook.pages.map((page) => (
                                            <SidebarMenuSubItem key={page.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <a href={`#${page.title}`}>
                                                        <span>{page.title}</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                                {page.subpages?.map((subpage) => (
                                                    <SidebarMenuSubItem key={subpage.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <a href={`#${subpage.title}`}>
                                                                <span>{subpage.title}</span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
            </SidebarContent>
            {/* <SidebarFooter>
                <SpaceSwitch /> 
            </SidebarFooter> */}

            <SidebarRail />
        </Sidebar>
    );
}
