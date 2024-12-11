import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {DisposalDetailDialog} from "@/components/DisposalDetailDialog.tsx";
import {DisposedProductSummaryDTO} from "@/types/disposed.ts";

export const DisposalHistoryTable = ({ disposals }: { disposals: DisposedProductSummaryDTO[] | null }) => {
    // Add safety checks
    if (!disposals || !Array.isArray(disposals)) {
        return <div>No disposal data available</div>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date Disposed</TableHead>
                    <TableHead>Total Batches</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {disposals.map((disposal: DisposedProductSummaryDTO) => (
                    <TableRow key={disposal.id}>
                        <TableCell>{disposal.id}</TableCell>
                        <TableCell>{new Date(disposal.dateDisposed).toLocaleString()}</TableCell>
                        <TableCell>{disposal.totalBatches}</TableCell>
                        <TableCell>{disposal.totalQuantityDisposed}</TableCell>
                        <TableCell>{disposal.staffName}</TableCell>
                        <TableCell>
                            <DisposalDetailDialog disposalId={disposal.id} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};