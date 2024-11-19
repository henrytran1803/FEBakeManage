import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import { CategoryPage } from "@/pages/CategoryPage";
import { HomePage } from "@/pages/HomePage";
import {AdminLayout} from "@/layouts/AdminLayout.tsx";
import ProductPage from "@/pages/ProductPage.tsx";
import {PromotionPage} from "@/pages/PromotionPage.tsx";
import ProtectedRoute from "@/ProtectedRoute.tsx";
import {ExpiredPage} from "@/pages/ExpiredPage.tsx";
import {NearExpiryPage} from "@/pages/NearExpiryPage.tsx";
import {ManageExpiryPage} from "@/pages/ManageExpiryPage.tsx";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin"element={
                <ProtectedRoute role="MANAGE" element={<AdminLayout />} />
            }>
                <Route index element={<HomePage />} />
                <Route path="home" element={<HomePage />} />
                <Route path="product" element={<ProductPage />} />
                <Route path="category" element={<CategoryPage />} />
                <Route path="discount" element={<PromotionPage />} />
                <Route path="recipe" element={<CategoryPage />} />
                <Route path="manageexpiry" element={<ManageExpiryPage />} />
                <Route path="nearexpiry" element={<NearExpiryPage />} />
                <Route path="expired" element={<ExpiredPage />} />

            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;