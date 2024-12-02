import { Outlet } from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar-user-employee";
import React from "react";

export function EmployeeLayout() {
    const [open, setOpen] = React.useState(true)

    return (
        <div className="flex ">
            <SidebarProvider open={open} onOpenChange={setOpen}>
                <AppSidebar />
                <Toaster />
                <SidebarTrigger />
                <main className="flex-1 bg-gray-50">
                    <Outlet/>
                </main>
            </SidebarProvider>
        </div>
    )
}