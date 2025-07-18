import React from 'react';

const ConfirmDeleteModal = ({ onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Confirmar Eliminación</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.</p>
                </div>
                <div className="items-center px-4 py-3">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Eliminar
                    </button>
                </div>
                <div className="mt-2">
                    <button
                        onClick={onCancel}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
