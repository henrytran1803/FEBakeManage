import { Outlet } from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.tsx";

export function UserLayout() {
    // const [open, setOpen] = React.useState(true)

    return (
        <div className="flex ">
            <Toaster />
            <main className="flex-1 bg-gray-50">
                <Outlet/>
            </main>
    </div>
    )
}