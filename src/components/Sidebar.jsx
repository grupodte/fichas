import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiHome, FiSettings, FiUser } from "react-icons/fi";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const variants = {
        open: { width: "240px" },
        closed: { width: "70px" }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <motion.div
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                transition={{ duration: 0.3 }}
                className="h-screen bg-gray-900 text-white flex flex-col shadow-lg"
            >
                <div className="flex items-center justify-between p-4">
                    <h1 className={`text-lg font-bold ${!isOpen && "hidden"}`}>Mi App</h1>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                <nav className="mt-6 space-y-4">
                    <div className="flex items-center gap-4 px-4 py-2 hover:bg-gray-800 cursor-pointer">
                        <FiHome size={20} />
                        {isOpen && <span>Inicio</span>}
                    </div>
                    <div className="flex items-center gap-4 px-4 py-2 hover:bg-gray-800 cursor-pointer">
                        <FiUser size={20} />
                        {isOpen && <span>Perfil</span>}
                    </div>
                    <div className="flex items-center gap-4 px-4 py-2 hover:bg-gray-800 cursor-pointer">
                        <FiSettings size={20} />
                        {isOpen && <span>Configuración</span>}
                    </div>
                </nav>
            </motion.div>

            {/* Contenido principal */}
            <div className="flex-1 p-6 bg-gray-100">
                <h2 className="text-2xl font-semibold">Contenido principal</h2>
                <p className="mt-4 text-gray-700">
                    Aquí iría el contenido de la aplicación.
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
