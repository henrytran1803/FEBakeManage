import './App.css'
import '@/app/global.css'
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "@/routes.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import { ToastProvider } from '@radix-ui/react-toast';
const App: React.FC = () => {

    return (
        <ToastProvider>
            <BrowserRouter>
                <AppRoutes />
                <Toaster />
            </BrowserRouter>
        </ToastProvider>
    );
};
export default App;