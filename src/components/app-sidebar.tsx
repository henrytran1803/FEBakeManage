'use client'

import { Ticket, ChevronUp, Home, Boxes, Settings, User2 , Box,FileText} from 'lucide-react'
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
        title: "Home",
        url: "/admin/home",
        icon: Home,
    },
    {
        title: "Category",
        url: "/admin/category",
        icon: Box,
    },
    {
        title: "Product",
        url: "/admin/product",
        icon: Boxes,
    },
    {
        title: "Discount",
        url: "/admin/discount",
        icon: Ticket,
    },
    {
        title: "Recipe",
        url: "/admin/recipe",
        icon: Settings,
    },
    {
        title: "Bill",  // Mới thêm mục Bill vào menu
        url: "/admin/bills", // Địa chỉ URL của trang Bill
        icon: FileText, // Sử dụng icon hóa đơn
      },
]

export function AppSidebar() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Xóa các thông tin authentication
        navigate('/login'); // Chuyển hướng về trang login
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