import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

export default function DropdownSelect({ label, options = [], value, onChange }) {
    return (
        <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{`Seleccionar ${label.toLowerCase()}`}</option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>
    );
}