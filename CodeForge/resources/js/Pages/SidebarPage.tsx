import { Head } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Separator } from "@/Components/ui/separator";
import { BlockEditor } from "@/Components/block-editor/block-editor";
import { Button } from "@/Components/ui/button"
import { Card } from "@/Components/ui/card"
import { Copy, CodeIcon, Type, AlignLeft } from "lucide-react"

export default function SidebarPage({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthenticatedLayout header="Main">
            {/* //todo page title */}
            <Head title="Main" />
            {/* <SidebarComponent/> */}
            <BlockEditor>

            </BlockEditor>
        </AuthenticatedLayout>
    );
}
