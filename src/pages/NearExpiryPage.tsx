import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from "react-hook-form";
import { productBatchService } from '@/services/productBatchService';
import {PromotionDaily} from "@/types/promotion.ts";
import {GetBatchByStatus} from "@/types/productBatch.ts";
import {promotionService} from "@/services/promotionService.ts";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {useToast} from "@/hooks/use-toast.ts";

export function NearExpiryPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [products, setProducts] = useState<GetBatchByStatus[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    console.log(showDialog)
    const form = useForm<PromotionDaily>({
        defaultValues: {
            discount: 0,
            productBatchIds: [],
            skipDefaultDiscount: true,
            getLastestDate: false,
            endDate: '2024-12-20',
        }
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productBatchService.getAllProductBatchByStatuses(["NEAR_EXPIRY"]);
                setProducts(response.data);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch products"
                });
            }
        };
        fetchProducts();
    }, []);

    const handleSubmit = async (data: PromotionDaily) => {
        if (selectedIds.length === 0) {
            toast({
                variant: "destructive",
                description: "Please select products"
            });
            return;
        }

        try {
            const payload = {
                ...data,
                productBatchIds: selectedIds,
                skipDefaultDiscount: !data.skipDefaultDiscount
            };
            await promotionService.createPromotionDaily(payload);
            toast({ description: "Promotion created successfully" });
            setShowDialog(false);
            setSelectedIds([]);
            form.reset();
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Failed to create promotion"
            });
        }
    };

    return (
        <div className="p-4 min-w-[85vw]">
            <div className="bg-white rounded-lg p-6 min-h-[calc(100vh-2rem)]">
                <div className="flex justify-between items-center mb-6">
                    <Button variant="outline" onClick={() => navigate('/admin/manageexpiry')}>
                        Back
                    </Button>

                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <Input
                            className="mb-4 max-w-sm"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedIds.length === products.length}
                                            onCheckedChange={(checked) =>
                                                setSelectedIds(checked ? products.map(p => p.id) : [])
                                            }
                                        />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead>Daily Discount</TableHead>
                                    <TableHead>Countdown</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products
                                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(product.id)}
                                                    onCheckedChange={(checked) =>
                                                        setSelectedIds(prev =>
                                                            checked
                                                                ? [...prev, product.id]
                                                                : prev.filter(id => id !== product.id)
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>
                        <span className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                          {product.status}
                        </span>
                                            </TableCell>
                                            <TableCell>{product.dateExpiry}</TableCell>
                                            <TableCell>{product.dailyDiscount}%</TableCell>
                                            <TableCell>{product.countDown} days</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Promotion Settings</h3>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="discount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Discount (%)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="skipDefaultDiscount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skip Default Discount</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-sm text-gray-500">
                                                Bỏ qua % giảm giá nhập và tự động lấy giảm giá tương ứng của sản phẩm được quy định từ trước
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="getLastestDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Get Latest Date</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-sm text-gray-500">
                                               Lấy ngày xa nhất của lô sản phẩm được chọn
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />

                                {!form.watch("getLastestDate") && (
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <Button type="submit" onClick={() => setShowDialog(true)} disabled={selectedIds.length === 0}>
                                    Create Promotion
                                </Button>

                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}