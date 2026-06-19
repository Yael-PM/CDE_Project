import { useEffect, useState, type ChangeEvent } from "react";
import CustomButton from "../components/CustomButton";
import Pagination from "../components/Pagination";
import { ROUTES } from '../routes'

import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

import { useEditNote, useDeleteNote } from "../hooks/useNotes";

import type { Note, NotesResponse } from '../types/notes.types';

const NOTES_PER_PAGE = 5;

// Reemplaza con tu fetch/estado real

const ManageNotes = () => {

    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");

    // Hooks: editar y eliminar nota
    const { updateExistingNote, isUpdating } = useEditNote();
    const { deleteExistingNote, isDeleting, deleteError } = useDeleteNote();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    
    // Estados para los campos del formulario del modal
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editUrl, setEditUrl] = useState("");
    const [editImage, setEditImage] = useState<File | undefined>(undefined);

    // Consume la API para obtener las notas al montar el componente
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/notes`);

                if (!response.ok) {
                    throw new Error('Error al conectar con el servidor de notas');
                }

                const result: NotesResponse = await response.json();
                setNotes(result.data); // Guardamos el arreglo real en nuestro estado
            } catch (err: any) {
                setError(err.message || 'Ocurrió un error inesperado al cargar la tabla');
            } finally {
                setLoading(false); // Detiene el spinner o mensaje de carga
            }
        };

        fetchNotes();
    }, []);

    const filtered = notes.filter((note) =>
        note.note_title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / NOTES_PER_PAGE);

    const paginated = filtered.slice(
        (currentPage - 1) * NOTES_PER_PAGE,
        currentPage * NOTES_PER_PAGE
    );

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Funcionalidad del botón editar
    const handleOpenEditModal = (note: Note) => {
        setSelectedNote(note);
        setEditTitle(note.note_title);
        // Ajusta estos campos según los nombres reales en tu objeto 'Note'
        setEditDescription(note.note_description || "");
        setEditUrl(note.url_reference || "");
        setEditImage(undefined); // El input file empieza vacío
        setIsModalOpen(true);
    };

    // Funcion para enviar la actualización al servidor
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNote) return;

        const updatedData = await updateExistingNote(
            selectedNote.note_id,
            editTitle,
            editDescription,
            editUrl,
            editImage
        );

        if (updatedData) {
            // Actualizamos la lista del estado local de inmediato sin recargar la página
            setNotes((prevNotes) =>
                prevNotes.map((n) => (n.note_id === selectedNote.note_id ? { ...n, note_title: editTitle } : n))
            );
            setIsModalOpen(false); // Cerramos el modal
            alert("Nota actualizada con éxito");
        } else {
            alert("Hubo un error al actualizar la nota");
        }
    };

    // Funcionalidad del boton eliminar
    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
            return;
        }

        const success = await deleteExistingNote(id);

        if (success) {
            // Si el hook nos confirma que el servidor la borró, la quitamos del estado visual
            setNotes((prevNotes) => prevNotes.filter((note) => note.note_id !== id));
            alert('Nota eliminada con éxito');
        } else {
            alert('No se pudo eliminar la nota. Inténtalo de nuevo.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Cargando panel...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;
    }

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
                                key={note.note_id}
                                className="grid grid-cols-3 py-4 px-6 items-center border-b border-gray-200 hover:bg-gray-200/50 transition-colors"
                            >
                                <span className="text-center font-medium text-gray-700">{note.note_title}</span>
                                <span className="text-center text-gray-500">{formatDate(note.creation_date)}</span>
                                <div className="flex justify-end">
                                    <div className="flex">
                                        <CustomButton
                                            variant="primary"
                                            className="flex items-center justify-center px-4 py-2 rounded-l border-r border-blue-600/30"
                                            onClick={() => handleOpenEditModal(note)}
                                        >
                                            <FaPencil />
                                            <p className="ml-2">Editar</p>
                                        </CustomButton>
                                        <CustomButton
                                            variant="warning"
                                            className="flex items-center justify-center px-4 py-2 rounded-r"
                                            onClick={() => handleDelete(note.note_id)}
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

                {/* VENTANA FLOTANTE (MODAL INTERFACES) */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Cabecera del Modal */}
                            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Editar Nota</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-white text-2xl font-semibold outline-none"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Formulario del Modal */}
                            <form onSubmit={handleSaveEdit} className="p-6 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la nota</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL de Referencia</label>
                                    <input
                                        type="text"
                                        value={editUrl}
                                        onChange={(e) => setEditUrl(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Imagen (Opcional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setEditImage(e.target.files?.[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>

                                {/* Botones de acción del Modal */}
                                <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                                    <CustomButton
                                        variant="primary"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </CustomButton>
                                    <button
                                        //variant="primary"
                                        type="submit"
                                        disabled={isUpdating}
                                        className="bg-tertiary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                                    >
                                        {isUpdating ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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