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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";

import { Button } from "@/Components";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";

export function SpaceSwitch({
    spaces,
}: {
    spaces: {
        name: string;
        logo: string;
        plan: string;
    }[];
}) {

    const [error, setError] = useState<string | null>(null);
    const createSpaceSchema = z.object({
        spaceName: z.string().min(2).max(50),
        spaceDescription: z.string().min(0).max(255),
    });

    const createSpaceForm = useForm<z.infer<typeof createSpaceSchema>>({
        resolver: zodResolver(createSpaceSchema),
        defaultValues: { spaceName: "", spaceDescription: "" },
    });

    const createOnSubmit = async (data: z.infer<typeof createSpaceSchema>) => {
        setError(null);
        try {
            await axios.post("/space", data);
            createSpaceForm.reset();
        } catch (error) {
            setError("Error en la base de datos");
        }
    };

    const { isMobile } = useSidebar();
    const [activeSpace, setActiveSpace] = useState(spaces[0]);
    return (
        <Dialog>
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
                            <DialogTrigger asChild>
                                <DropdownMenuItem className="gap-2 p-2">
                                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                        <Plus className="size-4" />
                                    </div>

                                    <div className="font-medium text-muted-foreground">
                                        Add space
                                    </div>
                                </DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new Space</DialogTitle>
                    <DialogDescription>
                        <Form {...createSpaceForm}>
                            <form
                                onSubmit={createSpaceForm.handleSubmit(
                                    createOnSubmit
                                )}
                                className="space-y-8"
                            >
                                <FormField
                                    control={createSpaceForm.control}
                                    name="spaceName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                Space Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Type the space name here"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This will be the space name
                                            </FormDescription>
                                            <FormMessage className="text-black" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createSpaceForm.control}
                                    name="spaceDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                Space Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Type the space description here"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This will be the space
                                                description
                                            </FormDescription>
                                            <FormMessage className="text-black" />
                                        </FormItem>
                                    )}
                                />
                                {error && (
                                    <p className="text-red-500">{error}</p>
                                )}{" "}
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
