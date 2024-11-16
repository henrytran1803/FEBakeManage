import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import { ProductPage } from "@/pages/ProductPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { HomePage } from "@/pages/HomePage";
import {AdminLayout} from "@/layouts/AdminLayout.tsx";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<HomePage />} />
                <Route path="home" element={<HomePage />} />
                <Route path="product" element={<ProductPage />} />
                <Route path="category" element={<CategoryPage />} />
                <Route path="discount" element={<CategoryPage />} />
                <Route path="recipe" element={<CategoryPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;