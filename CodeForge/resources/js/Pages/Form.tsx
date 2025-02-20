import { Head } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import { Form } from "@/Components";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function SpaceForm() {
    const [form, setForm] = useState({ name: "", description: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("/space", form);
            alert(`Space created: ${response.data.name}`);
        } catch (error) {
            alert("Error creating Space");
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Crear Espacio
                </h2>
            }
        >
            <Head title="Crear Espacio" />
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
