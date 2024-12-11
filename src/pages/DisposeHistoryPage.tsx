import {useEffect, useState} from "react";
import {DisposedProductSummaryDTO} from "@/types/disposed.ts";
import {disposedService} from "@/services/disposedService.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DisposalHistoryTable} from "@/components/DisposalHistoryTable.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

const DisposeHistoryPage = () => {
    const [disposals, setDisposals] = useState<DisposedProductSummaryDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDisposals = async () => {
            try {
                const response = await disposedService.getAll();
                console.log(response.data);
                setDisposals(response.data || []);
            } catch (error) {
                console.error('Error fetching disposals:', error);
                setDisposals([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDisposals();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 min-w-[80vw]">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Disposal History</CardTitle>
                </CardHeader>
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/expired')}
                    >
                        Back
                    </Button>
                </div>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-4">Loading...</div>
                        ) : error ? (
                            <div className="text-center text-red-500 p-4">{error}</div>
                        ) : disposals.length === 0 ? (
                            <div className="text-center p-4">No disposal records found</div>
                        ) : (
                            <DisposalHistoryTable disposals={disposals}/>
                        )}
                    </CardContent>
            </Card>
        </div>
);
};

export default DisposeHistoryPage;