import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NormalPromotionFormProps {
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    discount: string;
    setDiscount: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
}

export function NormalPromotionForm({
                                        name,
                                        setName,
                                        description,
                                        setDescription,
                                        discount,
                                        setDiscount,
                                        startDate,
                                        setStartDate,
                                        endDate,
                                        setEndDate
                                    }: NormalPromotionFormProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="name">Tên khuyến mãi</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên khuyến mãi"
                />
            </div>
            <div>
                <Label htmlFor="description">Mô tả</Label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập mô tả"
                />
            </div>
            <div>
                <Label htmlFor="discount">Phần trăm giảm giá</Label>
                <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Nhập phần trăm giảm giá"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}