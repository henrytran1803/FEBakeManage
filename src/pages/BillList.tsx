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
  // Khởi tạo bills là mảng rỗng
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
        if (response?.data?.content) {
          setBills(response.data.content);
          setTotalPages(response.data.totalPages);
          setTotalElements(response.data.totalElements);
        } else {
          setError('Invalid response format');
        }
      } catch (error) {
        setError('Failed to fetch bills');
        setBills([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, [page, size]);

  if (isLoading) {
    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Bill List</h1>
          <div className="flex justify-center items-center">Loading...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Bill List</h1>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
    );
  }

  if (!bills || bills.length === 0) {
    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Bill List</h1>
          <div className="text-center py-8 text-gray-500">No bills found</div>
        </div>
    );
  }

  // Main render with data
  return (
      <div className="p-4 min-w-[85vw]">
          <h1 className="text-2xl font-bold mb-4">Bill List</h1>

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
                  <TableCell>{bill.customerName || 'N/A'}</TableCell>
                  <TableCell>{bill.customerPhone || 'N/A'}</TableCell>
                  <TableCell>{bill.paymentMethod}</TableCell>
                  <TableCell>{bill.diningOption}</TableCell>
                  <TableCell>
                    <Badge
                        variant={bill.billStatus === 'PAID' ? 'default' : 'destructive'}
                    >
                      {bill.billStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${bill.totalAmount?.toFixed(2) || '0.00'}</TableCell>
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
      </div>
  );
};

export default BillList;