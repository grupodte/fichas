// src/components/SmartSelect.jsx
import { useEffect, useState, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon, ArrowDownCircleIcon, ArrowDownIcon, ArrowDownTrayIcon, ArrowTurnDownRightIcon } from '@heroicons/react/20/solid';

export default function SmartSelect({ label, options = [], value, onChange }) {
    const [query, setQuery] = useState('');

    // ✅ Agregado: sincronizar input con el valor externo
    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    const filteredOptions = useMemo(() => {
        return query === ''
            ? options
            : options.filter((opt) =>
                opt.toLowerCase().includes(query.toLowerCase())
            );
    }, [query, options]);

    return (
        <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <Combobox value={value} onChange={onChange}>
                <div className="relative">
                    <div className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-sm shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                        <Combobox.Input
                            className="w-full border-none text-sm text-gray-900 focus:outline-none"
                            displayValue={(opt) => opt}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Buscar ${label.toLowerCase()}...`}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3" />
                    </div>

                    {filteredOptions.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none">
                            {filteredOptions.map((opt, idx) => (
                                <Combobox.Option
                                    key={idx}
                                    value={opt}
                                    className={({ active }) =>
                                        `cursor-pointer select-none py-2 px-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`
                                    }
                                >
                                    {({ selected }) => (
                                        <span className={`flex justify-between ${selected ? 'font-semibold' : ''}`}>
                                            {opt}
                                            {selected && (
                                                <CheckIcon className="h-5 w-5 text-blue-600" />
                                            )}
                                        </span>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}

                    {filteredOptions.length === 0 && query !== '' && (
                        <div className="absolute mt-1 w-full rounded-md bg-white py-2 px-4 text-sm text-gray-500 shadow">
                            Sin resultados
                        </div>
                    )}
                </div>
            </Combobox>
        </div>
    );
}
