import { createContext, useContext, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

const DateRangeContext = createContext();

export const useDateRange = () => useContext(DateRangeContext);

export const DateRangeProvider = ({ children }) => {
    const [dateRange, setDateRange] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const value = { dateRange, setDateRange };

    return (
        <DateRangeContext.Provider value={value}>
            {children}
        </DateRangeContext.Provider>
    );
};
