import {Routes,  Route } from "react-router-dom";
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
import BillList from "./pages/BillList";

import UserManagementPage from "./pages/UserManagementPage";

import IngredientPage  from "./pages/IngredientPage";   
import ImportHistoryPage from './pages/ImportHistoryPage';
import ExportHistoryPage from './pages/ExportHistoryPage';
import ImportIngredientPage from './pages/ImportIngredientPage';
import ExportIngredientPage from './pages/ExportIngredientPage';
import SupplierPage from "./pages/SupplierPage";
import RecipePage from "@/pages/RecipePage.tsx";
import BakeryDashboard from "@/pages/DashBoardPage.tsx";
import {EmployeeLayout} from "@/layouts/EmployeeLayout.tsx";


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/*user*/}
            <Route path="/:id" element={<UserLayout />}>
                <Route index element={<HomePage />} />
            </Route>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            {/*admin*/}
            <Route path="/admin" element={<ProtectedRoute role="MANAGE" element={<AdminLayout />} />}>
                <Route index element={<BakeryDashboard />} />
                <Route path="home" element={<BakeryDashboard />} />
                <Route path="product" element={<ProductPage />} />
                <Route path="category" element={<CategoryPage />} />
                <Route path="discount" element={<PromotionPage />} />
                <Route path="recipe" element={<RecipePage />} />
                <Route path="bills" element={<BillList />} />
                <Route path="manageexpiry" element={<ManageExpiryPage />} />
                <Route path="nearexpiry" element={<NearExpiryPage />} />
                <Route path="expired" element={<ExpiredPage />} />
                <Route path="manage-user" element={<UserManagementPage />} />
                <Route path="ingredient" element={<IngredientPage />} />
                <Route path="import-history" element={<ImportHistoryPage />} />
                <Route path="export-history" element={<ExportHistoryPage />} />
                <Route path="import-ingredient" element={<ImportIngredientPage />} />
                <Route path="export-ingredient" element={<ExportIngredientPage />} />
                <Route path="supplier" element={<SupplierPage />} />
            </Route>

            {/*employee*/}
            <Route path="/employee" element={<ProtectedRoute role="USER" element={<EmployeeLayout />} />}>
                {/*nghiên cứu chỗ page home*/}
                {/*<Route path="home" element={<HomePage />} />*/}
                <Route path="bill" element={<BillList />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
       
    );
};

export default AppRoutes;