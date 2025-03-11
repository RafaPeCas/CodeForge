import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { NotebookProvider } from "@/contexts/notebookContext";
import { NotebookSidebar } from "@/Components/sidebar/NotebookSidebar";
import { Notebook, Space } from "@/types";
import axios from "axios";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [spaces, setSpaces] = useState<Space[]>([
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
    
    const fetchNotebooks = async (): Promise<void> => {
        const savedSpace = localStorage.getItem("activeSpace");
        let spaceId: string;

        if (savedSpace) {
            spaceId = JSON.parse(savedSpace).id;
        } else if (spaces.length > 0) {
            spaceId = spaces[0].id;
        } else {
            console.error("No space ID available");
            return;
        }

        try {
            // Fetch notebooks and their pages from the backend
            const response = await axios.get<Notebook[]>(
                `../notebooks/${spaceId}`
            );
            setNotebooks(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchSpaces();
        console.log("Fetch")
        fetchNotebooks();
    }, []);

    return (
        <NotebookProvider providedNotebooks={notebooks}>
            <SidebarProvider>
                <NotebookSidebar
                    spaces={spaces}
                    fetchNotebooks={fetchNotebooks}
                    fetchSpaces={fetchSpaces}
                />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="flex h-6 items-center space-x-4 text-sm">
                            {/* //todo hacer que por defecto en vertical no sea height 100% */}
                            <Separator orientation="vertical" />
                            {header && <h1>{header}</h1>}
                        </div>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </NotebookProvider>
    );
}
