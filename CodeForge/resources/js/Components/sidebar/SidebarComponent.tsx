import {
    AudioWaveform,
    Command,
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

interface Space {
    name: string;
    logo: string; // Cambiado a string porque el logo vendrá como URL o nombre de archivo
    plan: string;
}

const data = {
    spaces: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
};

export function SidebarComponent() {
    const [spaces, setSpaces] = useState([
        {
            name: "Cargando...",
            logo: "DefaultLogo",
            plan: "Cargando...",
        },
    ]);

    const fetchSpaces = async () => {
        try {
            const response = await axios.get("/sidebar");
            setSpaces(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    useEffect(() => {
        fetchSpaces();
    }, []);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SpaceSwitch spaces={spaces} />
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
            </SidebarContent>
            {/* <SidebarFooter>
                <SpaceSwitch /> 
            </SidebarFooter> */}
            
            <SidebarRail />
        </Sidebar>
    );
}
