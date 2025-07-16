import { useState, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

export default function FiltroSelect({ label, options = [], value, onChange }) {
    const [query, setQuery] = useState('');

    const filteredOptions = useMemo(() => {
        return query === ''
            ? options
            : options.filter(opt =>
                opt.toLowerCase().includes(query.toLowerCase())
            );
    }, [query, options]);

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Combobox value={value} onChange={onChange}>
                <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
                            displayValue={(opt) => opt}
                            placeholder={`Buscar ${label.toLowerCase()}...`}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Combobox.Button>
                    </div>

                    {filteredOptions.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {filteredOptions.map((opt, i) => (
                                <Combobox.Option
                                    key={i}
                                    value={opt}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                            >
                                                {opt}
                                            </span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
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
