import { Head } from "@inertiajs/react";
import { Terminal } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Button } from "@/Components";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

//Formulario
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";

const createSpaceSchema = z.object({
    spaceName: z.string().min(2).max(50),
    spaceDescription: z.string().min(0).max(255),
});

const editSpaceSchema = z.object({
    spaceId: z.string().nonempty(""),
    spaceName: z.string().min(2).max(50),
    spaceDescription: z.string().min(0).max(255),
});

export default function SpaceForm() {
    const [error, setError] = useState<string | null>(null);
    const [spaces, setSpaces] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
    });

    // Formularios
    const createSpaceForm = useForm<z.infer<typeof createSpaceSchema>>({
        resolver: zodResolver(createSpaceSchema),
        defaultValues: { spaceName: "", spaceDescription: "" },
    });

    const editSpaceForm = useForm<z.infer<typeof editSpaceSchema>>({
        resolver: zodResolver(editSpaceSchema),
        defaultValues: { spaceId: "", spaceName: "", spaceDescription: "" },
    });

    const createOnSubmit = async (data: z.infer<typeof createSpaceSchema>) => {
        setError(null);
        try {
            await axios.post("/space", data);
            fetchSpaces(pagination.current_page); // Recargar la lista
            createSpaceForm.reset();
        } catch (error) {
            setError("Error en la base de datos");
        }
    };

    const editOnSubmit = async (data: z.infer<typeof editSpaceSchema>) => {
        setError(null);
        try {
            await axios.put(
                `/space/${data.spaceId}`, // ⬅ Pasar ID en la URL
                {
                    spaceName: data.spaceName,
                    spaceDescription: data.spaceDescription,
                },
                { headers: { "Content-Type": "application/json" } }
            );
            fetchSpaces(pagination.current_page);
        } catch (error) {
            setError("Error en la base de datos");
        }
    };

    // Obtener los espacios paginados
    const fetchSpaces = async (page = 1) => {
        try {
            const response = await axios.get(`/space?page=${page}`);
            setSpaces(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                next_page_url: response.data.next_page_url,
                prev_page_url: response.data.prev_page_url,
            });
        } catch (error) {
            console.error("Error fetching spaces:", error);
        }
    };

    // Cargar espacios al montar el componente
    useEffect(() => {
        fetchSpaces();
    }, []);

    return (
        <AuthenticatedLayout
            header="Crear Espacio"
        >
            {error && (
                <Alert
                    variant={"destructive"}
                    className={"bg-red-400 absolute"}
                >
                    <Terminal className="h-4 w-4" />
                    <AlertTitle className="flex justify-between">
                        ¡Error!{" "}
                        <Button
                            className="p-0 mx-2 h-auto hover:bg-red-400 hover:text-black hover:cursor-pointer"
                            variant={"ghost"}
                            onClick={() => setError(null)}
                        >
                            X
                        </Button>
                    </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Head title="Espacios" />
            <h3 className="text-lg font-semibold">Lista de Espacios</h3>
            <ul className="list-disc pl-5">
                {spaces.map(
                    (space: {
                        id: string;
                        name: string;
                        description: string;
                        author: string;
                    }) => (
                        <li key={space.id} className="mt-2">
                            <h1>{space.name}</h1>
                            <h2>{space.description}</h2>
                            <p>{space.id}</p>
                            <p>
                                Autor:{space.author ? space.author : "No tiene"}
                            </p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            editSpaceForm.setValue(
                                                "spaceId",
                                                String(space.id)
                                            );
                                            editSpaceForm.setValue(
                                                "spaceName",
                                                space.name
                                            );
                                            editSpaceForm.setValue(
                                                "spaceDescription",
                                                space.description
                                            );
                                        }}
                                    >
                                        Editar
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full">
                                    <Form {...editSpaceForm}>
                                        <form
                                            onSubmit={editSpaceForm.handleSubmit(
                                                editOnSubmit
                                            )}
                                            className="space-y-8"
                                        >
                                            <FormField
                                                control={editSpaceForm.control}
                                                name="spaceId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="hidden"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={editSpaceForm.control}
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
                                                            This will be the
                                                            space name
                                                        </FormDescription>
                                                        <FormMessage className="text-black" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={editSpaceForm.control}
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
                                                            This will be the
                                                            space description
                                                        </FormDescription>
                                                        <FormMessage className="text-black" />
                                                    </FormItem>
                                                )}
                                            />
                                            {error && (
                                                <p className="text-red-500">
                                                    {error}
                                                </p>
                                            )}{" "}
                                            <Button type="submit">
                                                Submit
                                            </Button>
                                        </form>
                                    </Form>
                                </PopoverContent>
                            </Popover>
                            <Button variant={"destructive"}>Eliminar</Button>
                        </li>
                    )
                )}
            </ul>
            <View
                pagination={pagination}
                onPageChange={fetchSpaces} // Pasa la función de cambio de página
            ></View>
            <h2 className="text-xl font-bold mb-4">Create Space</h2>
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
                    {error && <p className="text-red-500">{error}</p>}{" "}
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </AuthenticatedLayout>
    );
}
