import React, { useState, useEffect } from 'react';

const EditTransactionModal = ({ transaction, onClose, onSave }) => {
    const [formData, setFormData] = useState(transaction);

    useEffect(() => {
        setFormData(transaction);
    }, [transaction]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Editar Transacción</h3>
                <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                    <div>
                        <label htmlFor="FECHA" className="block text-sm font-medium text-gray-700">FECHA</label>
                        <input type="text" name="FECHA" id="FECHA" value={formData.FECHA || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="NOMBRE CLIENTE" className="block text-sm font-medium text-gray-700">NOMBRE CLIENTE</label>
                        <input type="text" name="NOMBRE CLIENTE" id="NOMBRE CLIENTE" value={formData['NOMBRE CLIENTE'] || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    {/* Add other fields as needed */}
                    <div className="items-center px-4 py-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
                <div className="mt-2">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTransactionModal;
