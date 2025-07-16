// src/components/DropdownSelect.jsx
import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'

export default function DropdownSelect({ label, options = [], value, onChange }) {
    return (
        <div className="w-full">
            <Listbox value={value} onChange={onChange}>
                {({ open }) => (
                    <div className="relative">
                        <Listbox.Label className="block mb-1 text-sm font-medium text-gray-700">{label}</Listbox.Label>
                        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-10 text-left text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <span className="block truncate">{value || `Seleccionar ${label.toLowerCase()}`}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                            </span>
                        </Listbox.Button>

                        {open && (
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-lg shadow-lg ring-1 ring-black/10 focus:outline-none">
                                {options.map((opt, idx) => (
                                    <Listbox.Option
                                        key={idx}
                                        className={({ active }) =>
                                            `cursor-pointer select-none py-2 px-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`
                                        }
                                        value={opt}
                                    >
                                        {({ selected }) => (
                                            <span className={`flex justify-between ${selected ? 'font-semibold' : ''}`}>
                                                {opt}
                                                {selected && <CheckIcon className="h-5 w-5 text-blue-600" />}
                                            </span>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        )}
                    </div>
                )}
            </Listbox>
        </div>
    );
}
