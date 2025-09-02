import { Box, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CalendarToday } from '@mui/icons-material';

interface DateNavigationProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export default function DateNavigation({ selectedDate, onDateChange }: DateNavigationProps) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = selectedDate.toDateString() === today.toDateString();
    const isYesterday = selectedDate.toDateString() === yesterday.toDateString();
    const isTomorrow = selectedDate.toDateString() === tomorrow.toDateString();

    const formatDisplayDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Box>
            <Typography variant="h3">
                Schedule and Results
            </Typography>

            <Box>
                <Typography variant="h6">
                    {formatDisplayDate(selectedDate)}
                </Typography>
                <CalendarToday />
            </Box>

            <Box>
                <Button
                    size="small"
                    variant={isYesterday ? 'contained' : 'outlined'}
                    onClick={() => onDateChange(yesterday)}
                >
                    Yesterday
                </Button>

                <Button
                    size="small"
                    variant={isToday ? 'contained' : 'outlined'}
                    onClick={() => onDateChange(today)}
                >
                    Today
                </Button>

                <Button
                    size="small"
                    variant={isTomorrow ? 'contained' : 'outlined'}
                    onClick={() => onDateChange(tomorrow)}
                >
                    Tomorrow
                </Button>

                <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(newDate) => newDate && onDateChange(newDate)}
                />
            </Box>
        </Box>
    );
}