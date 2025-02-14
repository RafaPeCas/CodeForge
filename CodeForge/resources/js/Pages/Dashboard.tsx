import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";

export default function Dashboard() {
    const [form, setForm] = useState({ name: "", description: "" });

    const handleChange = (e: { target: { name: any; value: any } }) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            const response = await axios.post("/project", form);
            alert("Project created: " + response.data.name);
        } catch (error) {
            alert("Error creating project");
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="text-xl font-bold mb-4">Create Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Project Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <Button type="submit" className="w-full">
                    Create
                </Button>
            </form>
        </AuthenticatedLayout>
    );
}
