import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cake, DollarSign, ShoppingCart} from 'lucide-react';
import { useEffect, useState } from 'react';
import {DashBoardDTO} from "@/types/dashboard.ts";
import {dashBoardService} from "@/services/dashBoardService.ts";

export default function BakeryDashboard() {
    const [dashboardData, setDashboardData] = useState<DashBoardDTO | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashBoardService.getAllRecipes();
                setDashboardData(data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 min-w-[85vw]">
            <h1 className="text-2xl font-bold">Dashboard Cửa Hàng Bánh</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Doanh thu hôm nay</p>
                                <h3 className="text-2xl font-bold">{formatCurrency(dashboardData.todayRevenue)}</h3>
                            </div>
                            <DollarSign className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Đơn hàng hôm nay</p>
                                <h3 className="text-2xl font-bold">{dashboardData.todayBill}</h3>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Sản phẩm bán chạy</p>
                                <h3 className="text-2xl font-bold">{dashboardData.productNameBestSeller}</h3>
                            </div>
                            <Cake className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue and Orders Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu & Đơn hàng theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dashboardData.monthRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#2563eb"
                                        name="Doanh thu (VNĐ)"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="totalOrders"
                                        stroke="#16a34a"
                                        name="Số đơn"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Categories */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bổ doanh thu theo loại bánh</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardData.categoryRevenue}
                                        dataKey="revenue"
                                        nameKey="categoryName"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    />
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders by Time */}
                <Card>
                    <CardHeader>
                        <CardTitle>Đơn hàng theo khung giờ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={Object.entries(dashboardData.hourlyOrders).map(([time, orders]) => ({
                                        time,
                                        orders
                                    }))}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="orders" fill="#3b82f6" name="Số đơn" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}