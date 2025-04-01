import { usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";
import Guest from "./GuestLayout";
import { NotebookProvider } from "@/contexts/notebookContext";
import Authenticated from "./AuthenticatedLayout";

export default function AppLayout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props;
    const username = auth?.user?.username;

    if (children?.type?.name === "Welcome") {
        // Aquí puedes manejar el caso específico para el componente Welcome
        return <>{children}</>;
    }
    console.log("Page Name", children?.type?.name);
    console.log("Username", username);
    if (!username) {
        // If no user is authenticated, render the guest layout
        return <Guest>{children}</Guest>;
    }else{
        return (
            <NotebookProvider>
                <Authenticated>{children}</Authenticated>
            </NotebookProvider>
        );
    }

}
