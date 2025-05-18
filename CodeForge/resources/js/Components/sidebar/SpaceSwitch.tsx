import { useEffect, useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/Components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CreateSpaceDialog } from "./CreateSpaceDialog"; // Importa el nuevo componente
import axios from "axios";
import { z } from "zod";
import { Space } from "@/types";
import { useNotebooks } from "@/contexts/notebookContext";
import AvatarPreview from "../avatar/AvatarPreview";
import { useAvatar } from "@/contexts/avatarContext";

interface SpaceSwitchProps {
    spaces: Space[];
    onSpaceCreated: () => void;

}

const createSpaceSchema = z.object({
    spaceName: z.string().min(2).max(50),
    spaceDescription: z.string().min(0).max(255),
});

export function SpaceSwitch({ spaces, onSpaceCreated,  }: SpaceSwitchProps) {
    const { fetchNotebooks } = useNotebooks();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { isMobile } = useSidebar();
    const [activeSpace, setActiveSpace] = useState<Space | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedSpace = localStorage.getItem("activeSpace");
        if (savedSpace) {
            try {
                console.log("Saved Space:", savedSpace);
                setActiveSpace(JSON.parse(savedSpace));
            } catch (error) {
                console.error("Error parsing saved space:", error);
                localStorage.removeItem("activeSpace"); // Clear invalid data
            }
        } else if (spaces.length > 0 && spaces[0].id !== "") {
            console.log("Spaces updated:", spaces);
            setActiveSpace(spaces[0]);
            localStorage.setItem("activeSpace", JSON.stringify(spaces[0]));
            fetchNotebooks();
        }
    }, [spaces]);

    const createOnSubmit = async (data: z.infer<typeof createSpaceSchema>) => {
        setError(null);
        try {
            const response = await axios.post("/space", data);
            onSpaceCreated();
            const newSpace = {
                name: response.data.name,
                logo: "",
                plan: "author",
                id: response.data.id,
            };
            handleSpaceChange(newSpace);
            setIsDialogOpen(false);
        } catch (error) {
            setError("Error en la base de datos");
        }
    };

    const handleSpaceChange = (space: Space) => {
        setActiveSpace(space);
        localStorage.setItem("activeSpace", JSON.stringify(space));
        fetchNotebooks();
    };
    const { avatar } = useAvatar();
    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                {/* w-64 h-64 md:w-72 md:h-72 flex items-center justify-center */}
                                <div className="size-13 flex items-center justify-center"><AvatarPreview avatar={avatar} classname="scale-16" /></div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {activeSpace?.name || "Loading..."}
                                    </span>
                                    <span className="truncate text-xs">
                                        {activeSpace?.plan || ""}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side={isMobile ? "bottom" : "right"}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Spaces
                            </DropdownMenuLabel>
                            {spaces.map((space, index) => (
                                <DropdownMenuItem
                                    key={space.name}
                                    onClick={() => handleSpaceChange(space)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border"></div>
                                    {space.name}
                                    <DropdownMenuShortcut>
                                        ⌘{index + 1}
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="gap-2 p-2"
                                onClick={() => setIsDialogOpen(true)}
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">
                                    Add space
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            <CreateSpaceDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={createOnSubmit}
            />
        </>
    );
}

function setError(arg0: null) {
    throw new Error("Function not implemented.");
}
