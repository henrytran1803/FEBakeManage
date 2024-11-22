import { Outlet } from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.tsx";

export function UserLayout() {

    return (
        <div >
                <Toaster />
                <main className="flex-1 bg-gray-50">
                    <Outlet/>
                </main>
        </div>
    )
}