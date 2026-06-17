import { useState } from "react";
import CustomButton from "../components/CustomButton";
import Pagination from "../components/Pagination";
import { ROUTES }  from '../routes'

import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router";
import SEO from "../components/SEO";

interface Note {
    id: number;
    title: string;
    date: string;
}

const NOTES_PER_PAGE = 5;

// Reemplaza con tu fetch/estado real
const allNotes: Note[] = [
    { id: 1, title: "Guia de procesos",          date: "2 de Feb 2026"     },
    { id: 2, title: "Actualización Normativa",   date: "1 de Feb 2026"     },
    { id: 3, title: "Introducción a la Consulta",date: "21 de Enero 2026"  },
    { id: 4, title: "Manual de Usuario",         date: "17 de Enero 2026"  },
    { id: 5, title: "Protocolo de Seguridad",    date: "10 de Enero 2026"  },
    { id: 6, title: "Guia de Onboarding",        date: "5 de Enero 2026"   },
    { id: 7, title: "Reporte Mensual",           date: "1 de Enero 2026"   },
];

const ManageNotes = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch]           = useState<string>("");

    const filtered = allNotes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / NOTES_PER_PAGE);

    const paginated = filtered.slice(
        (currentPage - 1) * NOTES_PER_PAGE,
        currentPage * NOTES_PER_PAGE
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="bg-neutral-200 min-h-screen flex flex-col pb-10">
            <SEO 
                title="Gestión de Notas - CDE" 
                description="Administra y organiza el contenido informático de las rutas corporativas." 
            />
            {/* Hero section */}
            <section className="mx-5 md:mx-10 py-10">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-4">
                    Gestión de notas
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                        Administra y organiza el contenido informático de las rutas corporativas
                    </p>
                    <Link to={ROUTES.CREATE_NOTE} className="flex md:justify-end">
                        <CustomButton
                            variant="primary"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-tertiary-300 focus:border-blue-500 outline-none transition-all"
                        >
                            <FaPlus />
                            <p>Crear nueva nota</p>
                        </CustomButton>
                    </Link>
                </div>
            </section>

            {/* Buscador */}
            <div className="mx-5 md:mx-10 mb-5 max-w-md">
                <div className="bg-gray-300 rounded-full flex items-center px-4 py-2">
                    <label htmlFor="buscar" className="text-gray-500 mr-3 flex items-center">
                        <FaSearch size={18} />
                    </label>
                    <input
                        id="buscar"
                        type="text"
                        placeholder="Buscar nota..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Tabla */}
            <section className="mx-5 md:mx-10 my-5">
                <div className="w-full flex flex-col bg-neutral-100 rounded-lg shadow-sm overflow-hidden">

                    {/* Cabecera */}
                    <div className="grid grid-cols-3 bg-gray-300 py-3 px-6">
                        <span className="font-bold text-center text-gray-800">Titulo de la nota</span>
                        <span className="font-bold text-center text-gray-800">Fecha de creación</span>
                        <span className="font-bold text-center text-gray-800">Acciones</span>
                    </div>

                    {/* Filas */}
                    {paginated.length > 0 ? (
                        paginated.map((note) => (
                            <div
                                key={note.id}
                                className="grid grid-cols-3 py-4 px-6 items-center border-b border-gray-200 hover:bg-gray-200/50 transition-colors"
                            >
                                <span className="text-center font-medium text-gray-700">{note.title}</span>
                                <span className="text-center text-gray-500">{note.date}</span>
                                <div className="flex justify-end">
                                    <div className="flex">
                                        <CustomButton
                                            variant="primary"
                                            className="flex items-center justify-center px-4 py-2 rounded-l border-r border-blue-600/30"
                                        >
                                            <FaPencil />
                                            <p className="ml-2">Editar</p>
                                        </CustomButton>
                                        <CustomButton
                                            variant="warning"
                                            className="flex items-center justify-center px-4 py-2 rounded-r"
                                        >
                                            <FaRegTrashCan />
                                            <p className="ml-2">Eliminar</p>
                                        </CustomButton>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-gray-500">
                            No se encontraron notas.
                        </div>
                    )}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </section>

        </main>
    );
};

export default ManageNotes;