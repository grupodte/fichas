import { useState } from 'react';
import { Combobox } from '@headlessui/react';

export default function FiltroSelect({ label, options, value, onChange }) {
    const [query, setQuery] = useState('');

    const filteredOptions =
        query === ''
            ? options
            : options.filter(opt =>
                opt.toLowerCase().includes(query.toLowerCase())
            );

    return (
        <div className="w-full">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <Combobox value={value} onChange={onChange}>
                <div className="relative mt-1">
                    <Combobox.Input
                        className="w-full border rounded p-2"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(opt) => opt}
                        placeholder={`Buscar ${label.toLowerCase()}...`}
                    />
                    <Combobox.Options className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-auto rounded shadow">
                        {filteredOptions.length === 0 ? (
                            <div className="p-2 text-gray-500">Sin resultados</div>
                        ) : (
                            filteredOptions.map((opt, i) => (
                                <Combobox.Option
                                    key={i}
                                    value={opt}
                                    className={({ active }) =>
                                        `p-2 cursor-pointer ${active ? 'bg-blue-100' : ''
                                        }`
                                    }
                                >
                                    {opt}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    );
}
