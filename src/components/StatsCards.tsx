// components/stats-cards.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillStatistic } from '@/types/Bill';
import {billService} from "@/services/billService.ts";

interface StatsCardsProps {
    onStatisticsUpdate: (stats: BillStatistic) => void;
}

export function StatsCards({ onStatisticsUpdate }: StatsCardsProps) {
    const [todayStats, setTodayStats] = useState<BillStatistic | null>(null);
    const [monthStats, setMonthStats] = useState<BillStatistic | null>(null);
    const [yearStats, setYearStats] = useState<BillStatistic | null>(null);
    const [activeCard, setActiveCard] = useState<string>(''); // Track active card

    useEffect(() => {
        const fetchStats = async () => {
            const today = await billService.getTotalToday();
            const month = await billService.getTotalMonth();
            const year = await billService.getTotalYear();
            setTodayStats(today.data);
            setMonthStats(month.data);
            setYearStats(year.data);
        };
        fetchStats();
    }, []);

    const handleCardClick = (type: string, stats: BillStatistic | null) => {
        if (stats) {
            setActiveCard(type);
            onStatisticsUpdate(stats);
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${activeCard === 'today' ? 'border-primary ring-2 ring-primary' : ''}`}
                onClick={() => handleCardClick('today', todayStats)}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${todayStats?.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {todayStats?.bills.length} orders
                    </p>
                </CardContent>
            </Card>

            <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${activeCard === 'month' ? 'border-primary ring-2 ring-primary' : ''}`}
                onClick={() => handleCardClick('month', monthStats)}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${monthStats?.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {monthStats?.bills.length} orders
                    </p>
                </CardContent>
            </Card>

            <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${activeCard === 'year' ? 'border-primary ring-2 ring-primary' : ''}`}
                onClick={() => handleCardClick('year', yearStats)}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Yearly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${yearStats?.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {yearStats?.bills.length} orders
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}