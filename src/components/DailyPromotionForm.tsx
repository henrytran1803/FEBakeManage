import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface DailyPromotionFormProps {
    discount: string;
    setDiscount: (value: string) => void;
    skipDefaultDiscount: boolean;
    setSkipDefaultDiscount: (value: boolean) => void;
    getLastestDate: boolean;
    setGetLastestDate: (value: boolean) => void;
    endDate: string;
    setEndDate: (value: string) => void;
}

export function DailyPromotionForm({
                                       discount,
                                       setDiscount,
                                       skipDefaultDiscount,
                                       setSkipDefaultDiscount,
                                       getLastestDate,
                                       setGetLastestDate,
                                       endDate,
                                       setEndDate
                                   }: DailyPromotionFormProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="dailyDiscount">Phần trăm giảm giá</Label>
                <Input
                    id="dailyDiscount"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Nhập phần trăm giảm giá hoặc để trống để sử dụng mặc định"
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="skipDefault">Bỏ qua giảm giá mặc định</Label>
                <Switch
                    id="skipDefault"
                    checked={!skipDefaultDiscount}
                    onCheckedChange={setSkipDefaultDiscount}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="lastestDate">Sử dụng ngày hết hạn xa nhất</Label>
                <Switch
                    id="lastestDate"
                    checked={getLastestDate}
                    onCheckedChange={setGetLastestDate}
                />
            </div>
            {!getLastestDate && (
                <div>
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}