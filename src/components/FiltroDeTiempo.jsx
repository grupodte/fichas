import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDateRange } from '../context/DateRangeContext';
import { subDays, startOfMonth, endOfMonth, startOfYesterday, endOfYesterday } from 'date-fns';

const FiltroDeTiempo = () => {
    const { dateRange, setDateRange } = useDateRange();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const presets = [
        { label: 'Hoy', range: { from: new Date(), to: new Date() } },
        { label: 'Ayer', range: { from: startOfYesterday(), to: endOfYesterday() } },
        { label: 'Últimos 7 días', range: { from: subDays(new Date(), 6), to: new Date() } },
        { label: 'Este mes', range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) } },
        { label: 'Mes pasado', range: { from: startOfMonth(subDays(new Date(), 30)), to: endOfMonth(subDays(new Date(), 30)) } },
        { label: 'Últimos 90 días', range: { from: subDays(new Date(), 89), to: new Date() } },
    ];

    const handlePresetClick = (range) => {
        setDateRange(range);
        setShowDatePicker(false);
    };

    const handleDateChange = (range) => {
        if (range?.from && range?.to) {
            setDateRange(range);
            setShowDatePicker(false);
        }
    };

    const formatDate = (date) => format(date, 'd LLL, y', { locale: es });

    return (
        <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {presets.map((preset) => (
                    <button
                        key={preset.label}
                        onClick={() => handlePresetClick(preset.range)}
                        className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        {preset.label}
                    </button>
                ))}
                <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {dateRange.from && dateRange.to
                        ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
                        : 'Personalizado'}
                </button>
            </div>
            {showDatePicker && (
                <div className="absolute z-10 bg-white border rounded-md shadow-lg mt-2">
                    <DayPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={handleDateChange}
                        locale={es}
                        numberOfMonths={2}
                    />
                </div>
            )}
        </div>
    );
};

export default FiltroDeTiempo;
