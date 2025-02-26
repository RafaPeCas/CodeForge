// components/CreateSpaceDialog.tsx
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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

interface CreateSpaceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const createSpaceSchema = z.object({
    spaceName: z.string().min(2).max(50),
    spaceDescription: z.string().min(0).max(255),
});

export function CreateSpaceDialog({ isOpen, onClose }: CreateSpaceDialogProps) {
    const [error, setError] = useState<string | null>(null);

    const createSpaceForm = useForm<z.infer<typeof createSpaceSchema>>({
        resolver: zodResolver(createSpaceSchema),
        defaultValues: { spaceName: "", spaceDescription: "" },
    });

    const createOnSubmit = async (data: z.infer<typeof createSpaceSchema>) => {
        setError(null);
        try {
            await axios.post("/space", data);
            createSpaceForm.reset();
            onClose(); // Cierra el diálogo después de enviar
        } catch (error) {
            setError("Error en la base de datos");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new Space</DialogTitle>
                    <DialogDescription>
                        <Form {...createSpaceForm}>
                            <form
                                onSubmit={createSpaceForm.handleSubmit(createOnSubmit)}
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
                                                This will be the space description
                                            </FormDescription>
                                            <FormMessage className="text-black" />
                                        </FormItem>
                                    )}
                                />
                                {error && <p className="text-red-500">{error}</p>}
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}