import { SidebarComponent } from "@/Components/sidebar/SidebarComponent";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { PropsWithChildren, ReactNode } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <SidebarProvider>
            <SidebarComponent />
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
    );
}
