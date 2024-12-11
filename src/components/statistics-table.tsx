// components/statistics-table.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Billfull } from '@/types/Bill';

interface StatisticsTableProps {
    data: Billfull[];
}

export function StatisticsTable({ data }: StatisticsTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NOT_PAID': return 'bg-yellow-500';
            case 'PAID': return 'bg-green-500';
            case 'COMPLETED': return 'bg-blue-500';
            case 'CANCEL': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getPaymentColor = (method: string) => {
        return method === 'CASH' ? 'bg-orange-500' : 'bg-purple-500';
    };

    const getDiningColor = (option: string) => {
        return option === 'DIN_IN' ? 'bg-teal-500' : 'bg-pink-500';
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bill ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Dining Option</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((bill) => (
                        <TableRow key={bill.billId}>
                            <TableCell>{bill.billId}</TableCell>
                            <TableCell>{bill.customerName}</TableCell>
                            <TableCell>{bill.customerPhone}</TableCell>
                            <TableCell>
                                <Badge className={getPaymentColor(bill.paymentMethod)}>
                                    {bill.paymentMethod}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getDiningColor(bill.diningOption)}>
                                    {bill.diningOption}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(bill.billStatus)}>
                                    {bill.billStatus}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(bill.createdAt).toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                                ${bill.totalAmount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}