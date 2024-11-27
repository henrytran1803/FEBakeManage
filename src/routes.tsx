import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import { CategoryPage } from "@/pages/CategoryPage";
import {AdminLayout} from "@/layouts/AdminLayout.tsx";
import ProductPage from "@/pages/ProductPage.tsx";
import {PromotionPage} from "@/pages/PromotionPage.tsx";
import ProtectedRoute from "@/ProtectedRoute.tsx";
import {ExpiredPage} from "@/pages/ExpiredPage.tsx";
import {NearExpiryPage} from "@/pages/NearExpiryPage.tsx";
import {ManageExpiryPage} from "@/pages/ManageExpiryPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import {UserLayout} from "@/layouts/UserLayout.tsx";
import ProductDetailPage from "@/pages/ProductDetailPage.tsx";
import CartPage from "@/pages/CartPage.tsx";
import IngredientPage  from "./pages/IngredientPage";   
import ImportHistoryPage from './pages/ImportHistoryPage';
import ExportHistoryPage from './pages/ExportHistoryPage';
import ImportIngredientPage from './pages/ImportIngredientPage';
import ExportIngredientPage from './pages/ExportIngredientPage';
import SupplierPage from "./pages/SupplierPage";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<UserLayout />} >
                <Route index element={<HomePage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />

            </Route>
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
                <Route path="ingredient" element={<IngredientPage />} />
                <Route path="import-history" element={<ImportHistoryPage />} />
                <Route path="export-history" element={<ExportHistoryPage />} />
                <Route path="import-ingredient" element={<ImportIngredientPage />} />
                <Route path="export-ingredient" element={<ExportIngredientPage />} />
                <Route path="supplier" element={<SupplierPage />} />
                
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;