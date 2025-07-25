import { useState, useMemo, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';

export default function DropdownSelect({ label, options = [], value, onChange }) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        // Si el valor es un objeto, tomamos el label
        const selected = options.find(opt => opt.value === value);
        setQuery(selected?.label || '');
    }, [value, options]);

    const filteredOptions = useMemo(() => {
        return query === ''
            ? options
            : options.filter(opt =>
                (opt.label || '').toLowerCase().includes(query.toLowerCase())
            );
    }, [query, options]);

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">{label}</label>
            <Combobox value={value} onChange={onChange} nullable>
                <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-left shadow-sm focus-within:ring-2 focus-within:ring-white/30 transition">
                        <Combobox.Input
                            className="w-full bg-transparent border-none py-2 pl-3 pr-10 text-sm text-white placeholder-white/60 focus:outline-none"
                            displayValue={() => {
                                const selected = options.find(opt => opt.value === value);
                                return selected?.label || '';
                            }}
                            placeholder={`Buscar ${label.toLowerCase()}...`}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        </Combobox.Button>
                    </div>

                    {filteredOptions.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800/90 backdrop-blur-lg py-1 text-sm shadow-xl ring-1 ring-white/10 focus:outline-none">
                            {filteredOptions.map((opt, i) => (
                                <Combobox.Option
                                    key={i}
                                    value={opt.value}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 transition ${active ? 'bg-purple-600/30 text-white' : 'text-white/80'
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-semibold text-white' : 'font-normal'
                                                    }`}
                                            >
                                                {opt.label}
                                            </span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
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
                        <div className="absolute mt-1 w-full rounded-md bg-zinc-800/90 py-2 px-4 text-sm text-white/60 shadow">
                            Sin resultados
                        </div>
                    )}
                </div>
            </Combobox>
        </div>
    );
}
