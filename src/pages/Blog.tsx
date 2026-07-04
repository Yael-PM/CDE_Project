import { useState, useRef } from 'react'
import banerBg from '/blogBanerBg.jpg'

import NoteCard from "../components/NoteCard"
import Pagination from "../components/Pagination"
import CustomButton from '../components/CustomButton'
import SEO from '../components/SEO'
import { FaSearch, FaCalendarAlt } from 'react-icons/fa'

// Importamos el hook
import { useFetchNotes, useNoteFilters } from '../hooks/useNotes'

const NOTES_PER_PAGE = 12;

const Blog = () => {
    // Obtenemos los datos del hook y renombramos 'notes' a 'posts'
    const { notes: posts, loading, error } = useFetchNotes();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const {
        search,
        setSearch,
        filterMode,
        filterValue,
        setFilterValue,
        filteredNotes,
        handleModeChange
    } = useNoteFilters(posts);

    const dateInputRef = useRef<HTMLInputElement>(null);

    // Todo tu sistema de paginación ahora lee de 'filteredNotes' en vez de 'filteredPosts'
    const recentPosts = filteredNotes.slice(0, 2);
    const remainingPosts = filteredNotes.slice(2);
    const totalPages = Math.ceil(remainingPosts.length / NOTES_PER_PAGE);

    const paginatedPosts = remainingPosts.slice(
        (currentPage - 1) * NOTES_PER_PAGE,
        currentPage * NOTES_PER_PAGE
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Cargando publicaciones de regulación sanitaria...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;

    return (
        <main className="bg-neutral-100 min-h-screen flex flex-col pb-10">
            <SEO title="Blog - CDE" description="Análisis, guías prácticas y novedades en regulación sanitaria para prevenir riesgos y operar con certeza." />

            {/* Banner */}
            <section style={{ backgroundImage: `url(${banerBg})` }} className="relative w-full h-[40vh] md:h-[60vh] bg-cover bg-center flex items-center justify-start px-5 md:px-10">
                <div className="absolute inset-0 bg-neutral-900/10 z-0" />
                <div className="relative z-10 bg-white backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-2xl border border-white/50 max-w-xl md:max-w-2xl">
                    <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-none mb-4 md:mb-6">Blog</h1>
                    <p className="text-base md:text-lg font-medium text-slate-700 leading-relaxed">
                        Análisis, guías prácticas y novedades en regulación sanitaria para prevenir riesgos y operar con certeza.
                    </p>
                </div>
            </section>

            {/* Controles */}
            <section>
                <div className='grid grid-cols-1 md:grid-cols-2 mx-5 md:mx-10 my-5 gap-4'>
                    <div className='flex items-center px-2'>
                        {/* Selector de Modo de Tiempo */}
                        <div className="flex bg-gray-200 p-1 rounded-full gap-1 text-sm font-medium text-gray-600">
                            <CustomButton
                                variant="none"
                                onClick={() => handleModeChange('all')}
                                className={`px-4 py-1.5 rounded-full transition-all ${filterMode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
                            >
                                Todos
                            </CustomButton>

                            <CustomButton
                                variant="none"
                                onClick={() => handleModeChange('day')}
                                className={`px-4 py-1.5 rounded-full transition-all ${filterMode === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
                            >
                                Por Día
                            </CustomButton>

                            <CustomButton
                                variant="none"
                                onClick={() => handleModeChange('month')}
                                className={`px-4 py-1.5 rounded-full transition-all ${filterMode === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
                            >
                                Por Mes
                            </CustomButton>
                        </div>

                        {/* Input Dinámico de Fecha */}
                        {filterMode !== 'all' && (
                            <div
                                // Al hacer click en el contenedor, obligamos al navegador a abrir su selector de fecha nativo
                                onClick={() => filterMode === 'day' && dateInputRef.current?.showPicker()}
                                className="relative bg-gray-300 rounded-full flex items-center py-2 px-4 animate-fade-in w-full md:w-auto gap-2 min-h-[40px] cursor-pointer"
                            >

                                {filterMode === 'day' ? (
                                    <>
                                        {/* INTERFAZ VISUAL PERSONALIZADA */}
                                        <FaCalendarAlt size={16} className="text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm select-none pr-4">
                                            {filterValue
                                                ? (() => {
                                                    const [year, month, day] = filterValue.split('-');
                                                    return `${day}/${month}/${year}`;
                                                })()
                                                : 'Seleccione el día'}
                                        </span>

                                        {/* INPUT INVISIBLE CON REFERENCIA */}
                                        <input
                                            ref={dateInputRef} // <-- Enganchamos la referencia aquí
                                            type="date"
                                            value={filterValue}
                                            onChange={(e) => {
                                                setFilterValue(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" // Desactivamos eventos directos para que el click lo reciba el contenedor
                                        />
                                    </>
                                ) : (
                                    /* MODO POR MES: Mantiene el input de texto libre normal */
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
                    <div className="bg-gray-300 rounded-full flex items-center py-2 px-4">
                        <label htmlFor="buscar" className="text-gray-500 mr-3 flex items-center"><FaSearch size={18} /></label>
                        <input id="buscar" type="text" placeholder="Buscar nota..." value={search} onChange={handleSearch} className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-500" />
                    </div>
                </div>
            </section>

            {/* Contenido */}
            <section className='mx-5 md:mx-10 space-y-12'>
                {/* RECIENTES */}
                {recentPosts.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                        {recentPosts.map((post) => (
                            <NoteCard key={post.note_id} note={post} />
                        ))}
                    </div>
                )}

                {/* GRILLA PRINCIPAL */}
                {paginatedPosts.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>
                        {paginatedPosts.map((post) => (
                            <NoteCard key={post.note_id} note={post} />
                        ))}
                    </div>
                ) : (
                    recentPosts.length === 0 && (
                        <div className="py-20 text-center text-gray-500">No se encontraron publicaciones.</div>
                    )
                )}

                {/* PAGINACIÓN */}
                {totalPages > 1 && (
                    <div className="mt-10">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                )}
            </section>
        </main>
    )
}

export default Blog;