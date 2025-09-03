import { Head } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { BlockEditor } from "@/Components/block-editor/block-editor";
import { MarkdownEditor } from "@/Components/block-editor/custom-editor";

export default function SidebarPage({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthenticatedLayout header="Main">
            {/* //todo page title */}
            <Head title="Main" />
            <BlockEditor></BlockEditor>
            <MarkdownEditor></MarkdownEditor>
        </AuthenticatedLayout>
    );
}
