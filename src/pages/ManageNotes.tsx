import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomButton from "../components/CustomButton";
import Pagination from "../components/Pagination";
import { ROUTES } from '../routes'
import { useBlog } from '../hooks/useBlog';

import { FaPlus, FaPencil, FaRegTrashCan } from "react-icons/fa6";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

import { useEditNote, useDeleteNote, useNoteFilters } from "../hooks/useNotes"; // Importamos el hook
import type { Note } from '../types/notes.types';

const NOTES_PER_PAGE = 5;

const ManageNotes = () => {
    // 1. Extraemos toda la data y lógica del nuevo hook
    const { notes, setNotes, loading, error } = useBlog();

    const [currentPage, setCurrentPage] = useState<number>(1);

    // Lógica de filtado del hook
    const {
        search,
        setSearch,
        filterMode,
        filterValue,
        setFilterValue,
        filteredNotes,
        handleModeChange
    } = useNoteFilters(notes);

    // Referencia para el calendario invisible
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Hooks: editar y eliminar nota
    const { updateExistingNote, isUpdating } = useEditNote();
    const { deleteExistingNote, isDeleting } = useDeleteNote(); // deleteError se puede extraer si se necesita

    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editUrl, setEditUrl] = useState("");
    const [editImage, setEditImage] = useState<File | undefined>(undefined);

    const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

    const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE);

    const paginated = filteredNotes.slice(
        (currentPage - 1) * NOTES_PER_PAGE,
        currentPage * NOTES_PER_PAGE
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleOpenEditModal = (note: Note) => {
        setSelectedNote(note);
        setEditTitle(note.note_title);
        setEditDescription(note.note_description || "");
        setEditUrl(note.url_reference || "");
        setEditImage(undefined);
        setIsModalOpen(true);
    };

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
            setNotes((prevNotes) =>
                prevNotes.map((n) => (n.note_id === selectedNote.note_id ? { ...n, note_title: editTitle } : n))
            );
            setIsModalOpen(false);
            toast.success('Nota editada exitosamente.', {
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                    fontFamily: 'sans-serif'
                },
            });
        } else {
            toast.error('Hubo un error al actualizar la nota', {
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                    fontFamily: 'sans-serif'
                },
            });
        }
    };

    const confirmDelete = async () => {
        if (noteToDelete === null) return;

        const success = await deleteExistingNote(noteToDelete);

        if (success) {
            setNotes((prevNotes) => prevNotes.filter((note) => note.note_id !== noteToDelete));
            setNoteToDelete(null); // Cerramos el modal
            toast.success('Nota eliminada exitosamente.', {
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                    fontFamily: 'sans-serif'
                },
            });

        } else {
            toast.error('No se pudo eliminar la nota. Inténtalo de nuevo.', {
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                    fontFamily: 'sans-serif'
                },
            });
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Cargando panel...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;

    return (
        <main className="bg-neutral-200 min-h-screen flex flex-col pb-10">
            <Toaster position="top-center" reverseOrder={false} />
            <SEO title="Gestión de Notas - CDE" description="Administra y organiza el contenido informático de las rutas corporativas." />

            {/* Hero section */}
            <section className="mx-5 md:mx-10 py-10">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-4">Gestión de notas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed">Administra y organiza el contenido informático de las rutas corporativas</p>
                    <Link to={ROUTES.CREATE_NOTE} className="flex md:justify-end">
                        <CustomButton variant="primary" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-tertiary-300 focus:border-blue-500 outline-none transition-all">
                            <FaPlus />
                            <p>Crear nueva nota</p>
                        </CustomButton>
                    </Link>
                </div>
            </section>

            {/* Controles de Filtro y Búsqueda */}
            <section className="mx-5 md:mx-10 mb-5">
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-center'>

                    {/* Columna Izquierda: Botones de Modo y Calendario */}
                    <div className='flex flex-wrap md:flex-nowrap items-center gap-2'>
                        <div className="flex bg-gray-200 p-1 rounded-full gap-1 text-sm font-medium text-gray-600 shadow-inner">
                            <CustomButton variant="none" onClick={() => { handleModeChange('all'); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-full transition-all ${filterMode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}>Todos</CustomButton>
                            <CustomButton variant="none" onClick={() => { handleModeChange('day'); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-full transition-all ${filterMode === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}>Por Día</CustomButton>
                            <CustomButton variant="none" onClick={() => { handleModeChange('month'); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-full transition-all ${filterMode === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}>Por Mes</CustomButton>
                        </div>

                        {filterMode !== 'all' && (
                            <div
                                onClick={() => filterMode === 'day' && dateInputRef.current?.showPicker()}
                                className="relative bg-gray-300 rounded-full flex items-center py-2 px-4 animate-fade-in w-full md:w-auto gap-2 min-h-[40px] cursor-pointer"
                            >
                                {filterMode === 'day' ? (
                                    <>
                                        <FaCalendarAlt size={16} className="text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm select-none pr-4">
                                            {filterValue
                                                ? (() => {
                                                    const [year, month, day] = filterValue.split('-');
                                                    return `${day}/${month}/${year}`;
                                                })()
                                                : 'Seleccione el día'}
                                        </span>
                                        <input
                                            ref={dateInputRef}
                                            type="date"
                                            value={filterValue}
                                            onChange={(e) => {
                                                setFilterValue(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                                        />
                                    </>
                                ) : (
                                    <input
                                        type="text"
                                        value={filterValue}
                                        onChange={(e) => {
                                            setFilterValue(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        placeholder="Ej: Ene, Junio..."
                                        className="bg-transparent border-none outline-none text-gray-700 w-full text-sm placeholder-gray-500"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Columna Derecha: Buscador de Texto (Alineado a la derecha en pantallas grandes) */}
                    <div className="bg-gray-300 rounded-full flex items-center py-2 px-4 w-full lg:max-w-md lg:justify-self-end">
                        <label htmlFor="buscar" className="text-gray-500 mr-3 flex items-center"><FaSearch size={18} /></label>
                        <input
                            id="buscar"
                            type="text"
                            placeholder="Buscar nota..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
                        />
                    </div>

                </div>
            </section>

            {/* Tabla */}
            <section className="mx-5 md:mx-10 my-5">
                <div className="w-full flex flex-col bg-neutral-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-3 bg-gray-300 py-3 px-6">
                        <span className="font-bold text-center text-gray-800">Titulo de la nota</span>
                        <span className="font-bold text-center text-gray-800">Fecha de creación</span>
                        <span className="font-bold text-center text-gray-800">Acciones</span>
                    </div>

                    {paginated.length > 0 ? (
                        paginated.map((note) => (
                            <div key={note.note_id} className="grid grid-cols-3 py-4 px-6 items-center border-b border-gray-200 hover:bg-gray-200/50 transition-colors">
                                <span className="text-center font-medium text-gray-700">{note.note_title}</span>
                                <span className="text-center text-gray-500">{formatDate(note.creation_date)}</span>
                                <div className="flex justify-end">
                                    <div className="flex">
                                        <CustomButton variant="primary" className="flex items-center justify-center px-4 py-2 rounded-l border-r border-blue-600/30" onClick={() => handleOpenEditModal(note)}>
                                            <FaPencil /><p className="ml-2">Editar</p>
                                        </CustomButton>
                                        <CustomButton variant="warning" className="flex items-center justify-center px-4 py-2 rounded-r" onClick={() => setNoteToDelete(note.note_id)}>
                                            <FaRegTrashCan /><p className="ml-2">Eliminar</p>
                                        </CustomButton>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-gray-500">No se encontraron notas.</div>
                    )}
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Editar Nota</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl font-semibold outline-none">&times;</button>
                            </div>
                            <form onSubmit={handleSaveEdit} className="p-6 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la nota</label>
                                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL de Referencia</label>
                                    <input type="text" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Imagen (Opcional)</label>
                                    {/* Sección de Imagen dentro del Formulario */}
                                    <div className="flex flex-col gap-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Imagen de la nota
                                        </label>

                                        {/* Contenedor de Previsualización */}
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            {/* Prioridad 1: Si hay una nueva imagen seleccionada localmente */}
                                            {editImage ? (
                                                <div className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={URL.createObjectURL(editImage)}
                                                        alt="Nueva vista previa"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-[10px] text-white text-center font-bold py-0.5">
                                                        Nueva
                                                    </span>
                                                </div>
                                            ) : selectedNote?.image_reference ? (
                                                <div className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={selectedNote.image_reference}
                                                        alt="Imagen actual"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute bottom-0 inset-x-0 bg-gray-700 text-[10px] text-white text-center font-bold py-0.5">
                                                        Actual
                                                    </span>
                                                </div>
                                            ) : (
                                                /* Fallback: Si la nota no tenía imagen original ni se ha subido una nueva */
                                                <div className="w-20 h-20 bg-gray-200 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-xs text-gray-400 font-medium text-center p-1 flex-shrink-0">
                                                    Sin imagen
                                                </div>
                                            )}

                                            {/* El input de tipo File al lado de la imagen */}
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setEditImage(e.target.files?.[0])}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                {editImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditImage(undefined)}
                                                        className="text-xs text-red-500 hover:underline mt-1 block"
                                                    >
                                                        Deshacer cambio de imagen
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                                    <CustomButton variant="primary" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</CustomButton>
                                    <button type="submit" disabled={isUpdating} className="bg-tertiary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                                        {isUpdating ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
                {noteToDelete !== null && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-6 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <FaRegTrashCan className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar nota?</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Esta acción no se puede deshacer. La nota será borrada permanentemente de la base de datos.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => setNoteToDelete(null)}
                                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:bg-red-400 transition-colors"
                                    >
                                        {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            </section>
        </main>
    );
};

export default ManageNotes;
