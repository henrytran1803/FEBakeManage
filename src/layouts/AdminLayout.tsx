import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
    const [open, setOpen] = React.useState(true)

    return (
        <div className="flex ">
            <SidebarProvider open={open} onOpenChange={setOpen}>
                <AppSidebar />
                <SidebarTrigger />
                <main className="flex-1 bg-gray-50">
                    <Outlet/>
                </main>
            </SidebarProvider>
        </div>
    )
}