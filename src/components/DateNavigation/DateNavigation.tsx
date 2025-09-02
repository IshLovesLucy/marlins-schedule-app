import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CalendarToday } from '@mui/icons-material';

interface DateNavigationProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export default function DateNavigation({ selectedDate, onDateChange }: DateNavigationProps) {
    const [open, setOpen] = useState(false);

    const formatDisplayDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Box>
            <Typography variant="h5" component="h1" className='text-align'>
                Schedule and Results
            </Typography>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 1
            }} className='text-align'>

                <Typography variant="h6" color="text.secondary">
                    {formatDisplayDate(selectedDate)}
                </Typography>

                <IconButton
                    onClick={() => setOpen(true)}
                    color="primary"
                    size="small"
                >
                    <CalendarToday />
                </IconButton>

                <DatePicker
                    open={open}
                    onClose={() => setOpen(false)}
                    value={selectedDate}
                    onChange={(newValue) => {
                        if (newValue) {
                            onDateChange(newValue);
                        }
                        setOpen(false);
                    }}
                    slotProps={{
                        textField: {
                            sx: { display: 'none' }
                        },
                        toolbar: {
                            hidden: true // This might hide the toolbar
                        }
                    }}
                />
            </Box>
        </Box>
    );
}