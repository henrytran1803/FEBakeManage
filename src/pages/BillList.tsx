import React, { useEffect, useState } from 'react';
import { Bill } from '@/types/Bill';
import { billService } from '@/services/billService';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { TablePagination } from '@/components/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const BillList: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await billService.searchBills({ status: 'PAID', page, size });
        setBills(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        setError('Failed to fetch bills');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, [page, size]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bill List</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Customer Phone</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Dining Option</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.billId}>
                  <TableCell>{bill.billId}</TableCell>
                  <TableCell>{bill.customerName}</TableCell>
                  <TableCell>{bill.customerPhone}</TableCell>
                  <TableCell>{bill.paymentMethod}</TableCell>
                  <TableCell>{bill.diningOption}</TableCell>
                  <TableCell>
                    <Badge
                      variant={bill.billStatus === 'PAID' ? 'default' : 'destructive'}
                    >
                      {bill.billStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${bill.totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            page={page}
            setPage={setPage}
            size={size}
            setSize={setSize}
            totalPages={totalPages}
            totalElements={totalElements}
            currentPageElements={bills.length}
          />
        </>
      )}
    </div>
  );
};

export default BillList;
