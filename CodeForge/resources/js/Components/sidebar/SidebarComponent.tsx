import {
    AudioWaveform,
    ChevronRight,
    DoorOpen,
    Edit,
    Folder,
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
    SidebarRail,
} from "@/Components/ui/sidebar";

import { SpaceSwitch } from "@/Components/sidebar/SpaceSwitch";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import SidebarNotebooks from "./SidebarNotebooks";

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
    id?: string;
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
    ],
};

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

export function SidebarComponent() {
    const [spaces, setSpaces] = useState([
        {
            name: "Cargando...",
            logo: "DefaultLogo",
            plan: "Cargando...",
            id: "",
        },
    ]);
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);

    const fetchSpaces = async () => {
        try {
            const response = await axios.get("/sidebar");
            const transformedSpaces = response.data.map((space: any) => ({
                name: space.name,
                id: space.id.$oid,
                logo: "",
                plan: "Author",
            }));

            setSpaces(transformedSpaces);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchNotebooks = async () => {
        const savedSpace = localStorage.getItem("activeSpace");
        let spaceId;
        if (savedSpace) {
            spaceId = JSON.parse(savedSpace).id;
        } else if (spaces.length > 0) {
            spaceId = spaces[0].id;
        }
        try {
            const response = await axios.get(`notebooks/${spaceId}`);

            setNotebooks(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchSpaces();
        fetchNotebooks();
    }, []);

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        localStorage.removeItem("activeSpace");
    };

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
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
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
                    <SidebarGroupLabel>Notebooks</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarNotebooks notebooks={notebooks}/>
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