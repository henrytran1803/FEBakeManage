import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DisposedProductDetailResponseDTO } from '@/types/disposed';
import { disposedService } from '@/services/disposedService';
import { Eye } from 'lucide-react';

export const DisposalDetailDialog = ({ disposalId }: { disposalId: number }) => {
    const [details, setDetails] = useState<DisposedProductDetailResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDetails = async () => {
        try {
            setIsLoading(true);
            const response = await disposedService.getById(disposalId);
            setDetails(response.data);
        } catch (error) {
            console.error('Error fetching disposal details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={fetchDetails}>
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Disposal Details</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center p-4">Loading...</div>
                ) : details ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Date Disposed:</p>
                                <p>{new Date(details.dateDisposed).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Staff Name:</p>
                                <p>{details.staffName}</p>
                            </div>
                            {details.note && (
                                <div className="col-span-2">
                                    <p className="font-semibold">Note:</p>
                                    <p>{details.note}</p>
                                </div>
                            )}
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Batch ID</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Quantity Disposed</TableHead>
                                    <TableHead>Manufacturing Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {details.disposedBatches.map((batch) => (
                                    <TableRow key={batch.batchId}>
                                        <TableCell>{batch.batchId}</TableCell>
                                        <TableCell>{batch.productName}</TableCell>
                                        <TableCell>{batch.disposedQuantity}</TableCell>
                                        <TableCell>
                                            {new Date(batch.manufacturingDate).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center p-4">No details available</div>
                )}
            </DialogContent>
        </Dialog>
    );
};