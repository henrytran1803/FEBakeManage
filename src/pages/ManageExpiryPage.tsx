import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productBatchService } from '@/services/productBatchService';
import {GetBatchByStatus} from "@/types/productBatch.ts";

export function ManageExpiryPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<GetBatchByStatus[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    useEffect(() => {
        const fetchProducts = async () => {
            const statuses = statusFilter === 'ALL' ? ["ACTIVE", "NEAR_EXPIRY", "EXPIRED"] : [statusFilter];
            const response = await productBatchService.getAllProductBatchByStatuses(statuses);
            setProducts(response.data);
        };
        fetchProducts();
    }, [statusFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'NEAR_EXPIRY': return 'bg-yellow-100 text-yellow-800';
            case 'EXPIRY': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 min-w-[85vw]">
            <div className="bg-white rounded-lg p-6 min-h-[calc(100vh-2rem)]">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/product')}
                    >
                        Back
                    </Button>
                    <div className="flex gap-4">
                        <Button
                            variant="destructive"
                            onClick={() => navigate('/admin/expired')}
                        >
                            Quick Dispose
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => navigate('/admin/nearexpiry')}
                        >
                            Quick Promotion
                        </Button>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <Input
                        className="max-w-sm"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select onValueChange={setStatusFilter} value={statusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="NEAR_EXPIRY">Near Expiry</SelectItem>
                            <SelectItem value="EXPIRY">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Current Discount</TableHead>
                            <TableHead>Daily Discount</TableHead>
                            <TableHead>Countdown</TableHead>
                            <TableHead>Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                                </TableCell>
                                <TableCell>{product.dateExpiry}</TableCell>
                                <TableCell>{product.dailyDiscount}%</TableCell>
                                <TableCell>{product.countDown} days</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}