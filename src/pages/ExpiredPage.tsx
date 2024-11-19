import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { productBatchService } from '@/services/productBatchService';
import {GetBatchByStatus, QuickDisposed} from "@/types/productBatch.ts";

export function ExpiredPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [products, setProducts] = useState<GetBatchByStatus[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productBatchService.getAllProductBatchByStatuses(["EXPIRED"]);
                setProducts(response.data);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch expired products",
                });
            }
        };
        fetchProducts();
    }, []);

    const handleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? products.map(p => p.id) : []);
    };

    const handleSelectOne = (checked: boolean, id: number) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(existingId => existingId !== id)
        );
    };

    const handleDelete = async () => {
        try {
            const payload: QuickDisposed = {
                note,
                productBatchIds: selectedIds
            };
            await productBatchService.quickDisposed(payload);
            setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
            setNote('');
            setShowDeleteDialog(false);
            toast({
                title: "Success",
                description: "Products have been disposed successfully",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to dispose products",
            });
        }
    };

    return (
        <div className="p-4 min-w-[85vw]">
            <div className="bg-white rounded-lg p-6 min-h-[calc(100vh-2rem)]">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/manageexpiry')}
                    >
                        Back
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={selectedIds.length === 0}
                    >
                        Delete Selected
                    </Button>
                </div>
                {/*<Toast/>*/}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedIds.length === products.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
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
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(product.id)}
                                        onCheckedChange={(checked) => handleSelectOne(checked as boolean, product.id)}
                                    />
                                </TableCell>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                  <span className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                    {product.status}
                  </span>
                                </TableCell>
                                <TableCell>{product.dateExpiry}</TableCell>
                                <TableCell>{product.currentDiscount}%</TableCell>
                                <TableCell>{product.dailyDiscount}%</TableCell>
                                <TableCell>{product.countDown} days</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-4">
                                This action will delete {selectedIds.length} selected products and cannot be undone.
                                <div className="space-y-2">
                                    <Label htmlFor="note">Note</Label>
                                    <Input
                                        id="note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Enter deletion note"
                                    />
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setNote('')}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}