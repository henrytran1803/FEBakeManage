// components/date-range-picker.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { BillStatistic } from '@/types/Bill';
import {billService} from "@/services/billService.ts";

interface DateRangePickerProps {
    onStatisticsUpdate: (stats: BillStatistic) => void;
}

export function DateRangePicker({ onStatisticsUpdate }: DateRangePickerProps) {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const handleSearch = async () => {
        if (startDate && endDate) {
            const fromDate = format(startDate, 'yyyy-MM-dd');
            const toDate = format(endDate, 'yyyy-MM-dd');
            const response = await billService.getFromDateToDate(fromDate, toDate);
            onStatisticsUpdate(response.data);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy') : 'Select start date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                    />
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy') : 'Select end date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                    />
                </PopoverContent>
            </Popover>

            <Button onClick={handleSearch}>Search</Button>
        </div>
    );
}