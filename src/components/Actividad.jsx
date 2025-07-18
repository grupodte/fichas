import React, { useState } from 'react';
import EditTransactionModal from './EditTransactionModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const Actividad = ({ transactions, onSave, onDelete }) => {
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);

    const handleSave = (updatedTransaction) => {
        onSave(updatedTransaction);
        setEditingTransaction(null);
    };

    const handleDeleteClick = (transaction) => {
        setDeletingTransaction(transaction);
    };

    const handleConfirmDelete = () => {
        onDelete(deletingTransaction);
        setDeletingTransaction(null);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Actividad</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">FECHA</th>
                                <th scope="col" className="px-6 py-3">NOMBRE CLIENTE</th>
                                <th scope="col" className="px-6 py-3">N° CLIENTE</th>
                                <th scope="col" className="px-6 py-3">MONTO INGRESO</th>
                                <th scope="col" className="px-6 py-3">CUENTA INGRESO</th>
                                <th scope="col" className="px-6 py-3">TIPO DE ASSET / SALA INGRESO</th>
                                <th scope="col" className="px-6 py-3">MONTO EGRESO</th>
                                <th scope="col" className="px-6 py-3">CUENTA EGRESO</th>
                                <th scope="col" className="px-6 py-3">TIPO DE ASSET / SALA EGRESO</th>
                                <th scope="col" className="px-6 py-3">RESULTADO</th>
                                <th scope="col" className="px-6 py-3">CAT RESULTADO</th>
                                <th scope="col" className="px-6 py-3">CONCEPTO</th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Editar</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t, idx) => (
                                <tr key={idx} className="bg-white border-b">
                                    <td className="px-6 py-4">{t.FECHA}</td>
                                    <td className="px-6 py-4">{t['NOMBRE CLIENTE']}</td>
                                    <td className="px-6 py-4">{t['N° CLIENTE']}</td>
                                    <td className="px-6 py-4">{t['MONTO INGRESO']}</td>
                                    <td className="px-6 py-4">{t['CUENTA INGRESO']}</td>
                                    <td className="px-6 py-4">{t['TIPO DE ASSET / SALA INGRESO']}</td>
                                    <td className="px-6 py-4">{t['MONTO EGRESO']}</td>
                                    <td className="px-6 py-4">{t['CUENTA EGRESO']}</td>
                                    <td className="px-6 py-4">{t['TIPO DE ASSET / SALA EGRESO']}</td>
                                    <td className="px-6 py-4">{t.RESULTADO}</td>
                                    <td className="px-6 py-4">{t['CAT RESULTADO']}</td>
                                    <td className="px-6 py-4">{t.CONCEPTO}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setEditingTransaction(t)} className="font-medium text-blue-600 hover:underline">Editar</button>
                                        <button onClick={() => handleDeleteClick(t)} className="font-medium text-red-600 hover:underline ml-4">Borrar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    onSave={handleSave}
                />
            )}
            {deletingTransaction && (
                <ConfirmDeleteModal
                    onCancel={() => setDeletingTransaction(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
};

export default Actividad;
