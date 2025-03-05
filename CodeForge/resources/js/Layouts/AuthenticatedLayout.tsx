import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { NotebookProvider } from "@/contexts/notebookContext";
import { NotebookSidebar } from "@/contexts/NotebookSidebar";
import { PropsWithChildren, ReactNode } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const initialNotebooks = [
        {
            id: "notebook-1",
            name: "Work",
            description: "Work-related notes",
            spaceId: "space-1",
            pages: [
                {
                    id: "page-1",
                    title: "Project A",
                    parentId: null,
                    ancestors: [],
                    notebookId: "notebook-1",
                },
                {
                    id: "page-2",
                    title: "Meeting Notes",
                    parentId: null,
                    ancestors: [],
                    notebookId: "notebook-1",
                },
            ],
        },
        {
            id: "notebook-2",
            name: "Personal",
            description: "Personal notes and ideas",
            spaceId: "space-1",
            pages: [
                {
                    id: "page-3",
                    title: "Shopping List",
                    parentId: null,
                    ancestors: [],
                    notebookId: "notebook-2",
                },
                {
                    id: "page-4",
                    title: "Travel Plans",
                    parentId: null,
                    ancestors: [],
                    notebookId: "notebook-2",
                },
                {
                    id: "page-5",
                    title: "Travel Plans2",
                    parentId: "page-4",
                    ancestors: ["page-4"],
                    notebookId: "notebook-2",
                },
            ],
        },
    ];
    return (
        <NotebookProvider initialNotebooks={initialNotebooks}>
            <SidebarProvider>
                <NotebookSidebar />
                {/* <SidebarComponent /> */}
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
