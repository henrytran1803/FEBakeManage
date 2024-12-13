import React, { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { getAuthState, connectWebSocket, isWebSocketConnected } from "@/services/AuthService";

export function AdminLayout() {
    const [open, setOpen] = React.useState(true);

    useEffect(() => {
        const initWebSocket = () => {
            const { token, isAuthenticated } = getAuthState();
            if (isAuthenticated && token && !isWebSocketConnected()) {
                connectWebSocket(token);
            }
        };

        // Initial connection
        initWebSocket();

        // Set up reconnection check interval
        const checkInterval = setInterval(() => {
            if (!isWebSocketConnected()) {
                initWebSocket();
            }
        }, 5000); // Check every 5 seconds

        // Cleanup on unmount
        return () => {
            clearInterval(checkInterval);
        };
    }, []);

    return (
        <div className="flex">
            <SidebarProvider open={open} onOpenChange={setOpen}>
                <AppSidebar />
                <SidebarTrigger />
                <main className="flex-1 bg-gray-50">
                    <Outlet/>
                </main>
            </SidebarProvider>
        </div>
    );
}