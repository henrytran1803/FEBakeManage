import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/useCartStore';

export function SelectTableDialog() {
    const [tableNumber, setTableNumber] = useState('');
    const initCart = useCartStore((state) => state.initCart);
    const currentCart = useCartStore((state) => state.currentCart);

    const handleSelectTable = () => {
        const tableNum = parseInt(tableNumber);
        if (!isNaN(tableNum) && tableNum > 0) {
            initCart(tableNum);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {currentCart ? `Bàn ${currentCart.table}` : 'Chọn bàn'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chọn bàn</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Input
                            type="number"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="Nhập số bàn"
                            min="1"
                        />
                        <Button onClick={handleSelectTable}>Xác nhận</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}