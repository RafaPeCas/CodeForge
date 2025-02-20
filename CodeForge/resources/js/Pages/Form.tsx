import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Form, View } from "@/Components";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Bold } from "lucide-react";

export default function SpaceForm() {
    const [form, setForm] = useState({ name: "", description: "" });
    const [spaces, setSpaces] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
    });

    // Manejar cambios en los inputs
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post("/space", form);
            fetchSpaces(pagination.current_page); // Recargar la lista
        } catch (error) {
            alert("Error creating Space");
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
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Crear Espacio
                </h2>
            }
        >
            <Head title="Espacios" />
            <h3 className="text-lg font-semibold">Lista de Espacios</h3>
            <ul className="list-disc pl-5">
                {spaces.map(
                    (space: {
                        id: number;
                        name: string;
                        description: string;
                        author: string;
                    }) => (
                        <li key={space.id} className="mt-2">
                            <h1>{space.name}</h1>
                            <h2>{space.description}</h2>
                            <p>{space.id}</p>
                            <p>Autor:{space.author ? space.author: "No tiene"}</p>
                        </li>
                    )
                )}
            </ul>
            <View
                pagination={pagination}
                onPageChange={fetchSpaces} // Pasa la función de cambio de página
            ></View>
            <h2 className="text-xl font-bold mb-4">Create Space</h2>
            <Form
                inputValue={form.name}
                textareaDescription={form.description}
                changeHandler={handleChange}
                onSubmit={handleSubmit}
            />
        </AuthenticatedLayout>
    );
}
