// pages/statistics/index.tsx
import { useState } from 'react';

import { BillStatistic } from '@/types/Bill';
import {DateRangePicker} from "@/components/date-range-picker.tsx";
import {StatsCards} from "@/components/StatsCards.tsx";
import {StatisticsTable} from "@/components/statistics-table.tsx";

export default function StatisticsPage() {
    const [statistics, setStatistics] = useState<BillStatistic | null>(null);

    return (
        <div className="p-4 min-w-[85vw]">
            <h1 className="text-3xl font-bold">Statistics Dashboard</h1>
            <StatsCards onStatisticsUpdate={setStatistics} />
            <DateRangePicker onStatisticsUpdate={setStatistics} />
            {statistics && (
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Details</h2>
                        <p className="text-sm text-muted-foreground">
                            Total Revenue: ${statistics.totalRevenue.toLocaleString()}
                        </p>
                    </div>
                    <StatisticsTable data={statistics.bills} />
                </>
            )}
        </div>
    );
}