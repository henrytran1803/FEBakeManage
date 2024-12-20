'use client'

import {ChevronUp ,User2 ,FileText} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useEffect, useState} from "react";
import {User} from "@/types/Auth.ts";
import {logout} from "@/services/AuthService.ts";
import {useNavigate} from "react-router-dom";

const items = [
  
    {
        title: "Bill",
        url: "/employee/bill",
        icon: FileText,
      },
    
]

export function AppSidebar() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);
    return (
        <Sidebar className="h-screen border-r"> {/* Add h-screen */}
            <SidebarHeader className="border-b px-4 py-2"> {/* Add padding & border */}
                <div className="font-semibold">BakeManage</div>
            </SidebarHeader>

            <SidebarContent className="flex-1"> {/* Add flex-1 */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 py-2">Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}
                                           className="flex items-center px-4 py-2 hover:bg-gray-100">
                                            <item.icon className="h-4 w-4 mr-2" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <User2 className="h-4 w-4 mr-2" />
                                    <span>{user?.email}</span>
                                    <ChevronUp className="ml-auto h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="w-56"
                            >
                                <DropdownMenuItem className="text-red-600"
                                    onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}