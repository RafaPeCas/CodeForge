import { useState } from "react";
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

interface Space {
    name: string;
    logo: string; 
    plan: string;
}

interface SpaceSwitchProps {
    spaces: Space[];
    onSpaceCreated: () => void; 
}

const createSpaceSchema = z.object({
    spaceName: z.string().min(2).max(50),
    spaceDescription: z.string().min(0).max(255),
});

export function SpaceSwitch({ spaces, onSpaceCreated }: SpaceSwitchProps)  {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { isMobile } = useSidebar();
    const [activeSpace, setActiveSpace] = useState(spaces[0]);
    const [error, setError] = useState<string | null>(null);

    const createOnSubmit = async (data: z.infer<typeof createSpaceSchema>) => {
        setError(null);
        try {
            const response = await axios.post("/space", data);
            onSpaceCreated();
            const newSpace = {
                name: data.spaceName,
                logo: "", 
                plan: "Author",
            };
            setActiveSpace(newSpace); 
            setIsDialogOpen(false); 
        } catch (error) {
            setError("Error en la base de datos");
        }
    };

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
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"></div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {activeSpace.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {activeSpace.plan}
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
                                    onClick={() => setActiveSpace(space)}
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
