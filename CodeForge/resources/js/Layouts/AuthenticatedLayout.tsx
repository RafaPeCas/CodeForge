
import { SidebarComponent } from "@/Components/sidebar/SidebarComponent";
import { SidebarInset, SidebarProvider} from "@/Components/ui/sidebar";
import { PropsWithChildren, ReactNode } from "react";

export default function Authenticated({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {

    return (
        <SidebarProvider>
          <SidebarComponent />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      );
}
