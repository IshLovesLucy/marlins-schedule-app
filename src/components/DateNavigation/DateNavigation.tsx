import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
            year: 'numeric',
            timeZone: 'America/New_York'
        });
    };

    const CalendarToday = () => {
        return (
            <svg
                viewBox="0 0 25 25"
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
            >
                <rect x="1.69" y="9.07" width="18.62" height="13.71" fill="var(--bg-secondary)" />
                <path
                    d="M16.9230769 3.9285714c.4679231 0 .8461539-.3831428.8461539-.8571428V1.3571429C17.7692308.884 17.391.5 16.9230769.5c-.4679231 0-.8461538.384-.8461538.8571429v1.7142857c0 .474.3782307.8571428.8461538.8571428zm-11.8461538 0c.467923 0 .8461538-.3831428.8461538-.8571428V1.3571429C5.923077.884 5.5448461.5 5.0769231.5c-.4679231 0-.8461539.384-.8461539.8571429v1.7142857c0 .474.3782308.8571428.8461539.8571428zm15.2307692-.8571428h-.8461538c0 1.4202857-1.1363847 2.5714285-2.5384616 2.5714285-1.4020769 0-2.5384615-1.1511428-2.5384615-2.5714285H7.6153846c0 1.4202857-1.1363846 2.5714285-2.5384615 2.5714285-1.402077 0-2.5384616-1.1511428-2.5384616-2.5714285h-.8461538C.7581538 3.0714286 0 3.8394286 0 4.7857143v18C0 23.732.7581538 24.5 1.6923077 24.5h18.6153846C21.2418462 24.5 22 23.732 22 22.7857143v-18c0-.9462857-.7581538-1.7142857-1.6923077-1.7142857zm0 19.7142857H1.6923077V9.0714286h18.6153846v13.7142857z"
                    fill="none"
                    stroke="var(--marlins-black)"
                    strokeWidth="2"
                    fillRule="nonzero"
                />
            </svg>
        );
    };

    return (
        <Box className='header__content'>
            <div className='header__content--full-width'>
                <Typography variant="h5" component="h1" className="text-align">
                    Schedule and Results
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1
                }} className='text-align'>
                    <Typography variant="h6">
                        <span style={{ color: 'var(--bg-secondary)' }}>⚾ </span>
                        {formatDisplayDate(selectedDate)}
                        <span style={{ color: 'var(--bg-secondary)' }}> ⚾</span>
                    </Typography>
                    <IconButton
                        onClick={() => setOpen(true)}
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
                                hidden: true,
                            },
                        }}
                    />
                </Box>
            </div>
        </Box>
    );

    // return (
    //     <Box className='header__content'>
    //         <div className='header__content--full-width'>
    //             <Typography variant="h5" component="h1" className="text-align">
    //                 Schedule and Results
    //             </Typography>

    //             <Box sx={{
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 gap: 2,
    //                 mb: 1
    //             }} className='text-align'>

    //                 <Typography variant="h6">
    //                     <span style={{ color: 'var(--bg-secondary)' }}>⚾ </span>
    //                     {formatDisplayDate(selectedDate)}
    //                     <span style={{ color: 'var(--bg-secondary)' }}> ⚾</span>
    //                 </Typography>

    //                 <IconButton
    //                     onClick={() => setOpen(true)}
    //                     size="small"
    //                 >
    //                     <CalendarToday />
    //                 </IconButton>

    //                 <DatePicker
    //                     open={open}
    //                     onClose={() => setOpen(false)}
    //                     value={selectedDate}
    //                     onChange={(newValue) => {
    //                         if (newValue) {
    //                             onDateChange(newValue);
    //                         }
    //                         setOpen(false);
    //                     }}
    //                     slotProps={{
    //                         textField: {
    //                             sx: { display: 'none' }
    //                         },
    //                         toolbar: {
    //                             hidden: true // This might hide the toolbar
    //                         }
    //                     }}
    //                 />
    //             </Box>
    //         </div>

    //     </Box>
    // );
}