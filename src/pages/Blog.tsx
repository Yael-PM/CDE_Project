import { useState } from 'react'
import banerBg from '/blogBanerBg.jpg'

import CustomButton from '../components/CustomButton'
import NoteCard from "../components/NoteCard"
import Pagination from "../components/Pagination"
import { FaSearch } from 'react-icons/fa'

interface BlogPost {
    id: number;
    date: string;
    title: string;
    excerpt: string;
    imageUrl?: string;
}

const NOTES_PER_PAGE = 12; // Notas por página en la sección de abajo

const ALL_POSTS: BlogPost[] = [
    { id: 1, date: "Febrero 2026", title: "Nota Reciente 1", excerpt: "Esta es la nota más nueva del blog..." },
    { id: 2, date: "Marzo 2026", title: "Nota Reciente 2", excerpt: "Esta es la segunda nota más nueva...", imageUrl: '/blogBanerBg.jpg' },
    { id: 3, date: "Febrero 2026", title: "Nota Común 3", excerpt: "Anim amet cillum..." },
    { id: 4, date: "Febrero 2026", title: "Nota Común 4", excerpt: "Anim amet cillum..." },
    { id: 5, date: "Febrero 2026", title: "Nota Común 5", excerpt: "Anim amet cillum..." },
    { id: 6, date: "Febrero 2026", title: "Nota Común 6", excerpt: "Anim amet cillum..." },
    { id: 7, date: "Febrero 2026", title: "Nota Común 7", excerpt: "Anim amet cillum..." },
    { id: 8, date: "Febrero 2026", title: "Nota Común 8", excerpt: "Anim amet cillum..." },
    { id: 9, date: "Febrero 2026", title: "Nota Común 9", excerpt: "Anim amet cillum..." },
    { id: 10, date: "Febrero 2026", title: "Nota Común 10", excerpt: "Anim amet cillum..." },
    { id: 11, date: "Febrero 2026", title: "Nota Común 11", excerpt: "Anim amet cillum..." },
    { id: 12, date: "Marzo 2026", title: "Nota Común 12", excerpt: "Anim amet cillum...", imageUrl: '/blogBanerBg.jpg' },
    { id: 13, date: "Febrero 2026", title: "Nota Común 13", excerpt: "Anim amet cillum..." },
    { id: 14, date: "Febrero 2026", title: "Nota Común 14", excerpt: "Anim amet cillum..." },
    { id: 15, date: "Marzo 2026", title: "Nota Común 15", excerpt: "Anim amet cillum...", imageUrl: '/blogBanerBg.jpg' },
    { id: 16, date: "Febrero 2026", title: "Nota Común 16", excerpt: "Anim amet cillum..." },
    { id: 17, date: "Febrero 2026", title: "Nota Común 17", excerpt: "Anim amet cillum..." },
    { id: 18, date: "Marzo 2026", title: "Nota Común 18", excerpt: "Anim amet cillum...", imageUrl: '/blogBanerBg.jpg' },
    { id: 19, date: "Febrero 2026", title: "Nota Común 19", excerpt: "Anim amet cillum..." },
    { id: 20, date: "Febrero 2026", title: "Nota Común 20", excerpt: "Anim amet cillum..." },
    { id: 21, date: "Marzo 2026", title: "Nota Común 21", excerpt: "Anim amet cillum...", imageUrl: '/blogBanerBg.jpg' },
    { id: 22, date: "Febrero 2026", title: "Nota Común 22", excerpt: "Anim amet cillum..." },
    { id: 23, date: "Febrero 2026", title: "Nota Común 23", excerpt: "Anim amet cillum..." },
    { id: 24, date: "Marzo 2026", title: "Nota Común 24", excerpt: "Anim amet cillum...", imageUrl: '/blogBanerBg.jpg' },
    { id: 25, date: "Febrero 2026", title: "Nota Común 25", excerpt: "Anim amet cillum..." },
];

const Blog = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");

    // 1. Filtrar primero por el buscador (para que afecte a todo el blog)
    const filteredPosts = ALL_POSTS.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    // 2. Extraer las 2 notas más recientes (las dos primeras del arreglo filtrado)
    const recentPosts = filteredPosts.slice(0, 2);

    // 3. Extraer el resto de las notas para la sección paginada (desde el índice 2 en adelante)
    const remainingPosts = filteredPosts.slice(2);

    // 4. Calcular paginación basada ÚNICAMENTE en las notas restantes
    const totalPages = Math.ceil(remainingPosts.length / NOTES_PER_PAGE);

    // Cortar el array de las restantes para la página actual
    const paginatedPosts = remainingPosts.slice(
        (currentPage - 1) * NOTES_PER_PAGE,
        currentPage * NOTES_PER_PAGE
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="bg-neutral-100 min-h-screen flex flex-col pb-10">

            {/* Banner */}
            <section style={{ backgroundImage: `url(${banerBg})` }} className="relative w-full h-[40vh] md:h-[60vh] bg-cover bg-center flex flex-col">
                <div className="absolute inset-0 bg-neutral-100/20 z-0" />
                <h1 className="text-4xl md:text-8xl font-extrabold text-slate-900 leading-[1.1] mb-4after:content-['.'] after:ml-0.5 after:text-red-500 mt-5 mb-10 mx-5 md:mx-10">
                    Blog
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed mx-5 md:mx-10">
                    Análisis, guías prácticas y novedades en regulación sanitaria para prevenir riesgos y operar con certeza.
                </p>
            </section>

            {/* Controles */}
            <section>
                <div className='grid grid-cols-1 md:grid-cols-2 mx-5 md:mx-10 my-5 gap-4'>
                    <div className='flex gap-2'>
                        <CustomButton>Todos</CustomButton>
                        <CustomButton>COFEPRIS</CustomButton>
                        <CustomButton>Registros sanitarios</CustomButton>
                    </div>

                    <div className="bg-gray-300 rounded-full flex items-center py-2 px-4">
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
            </section>

            {/* Sección de Contenido */}
            <section className='mx-5 md:mx-10 space-y-12'>

                {/* SECCIÓN A: LAS 2 NOTAS MÁS RECIENTES (Sin paginar, diseño grande de 2 columnas) */}
                {recentPosts.length > 0 && (
                    <div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                            {recentPosts.map((post) => (
                                <NoteCard 
                                    key={post.id}
                                    id={post.id} 
                                    date={post.date} 
                                    title={post.title} 
                                    excerpt={post.excerpt} 
                                    imageUrl={post.imageUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* SECCIÓN B: RESTO DE LAS NOTAS (Paginadas, diseño de rejilla de 4 columnas) */}
                {paginatedPosts.length > 0 ? (
                    <div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>
                            {paginatedPosts.map((post) => (
                                <NoteCard 
                                    key={post.id}
                                    id={post.id} 
                                    date={post.date} 
                                    title={post.title} 
                                    excerpt={post.excerpt} 
                                    imageUrl={post.imageUrl}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    // Si no quedan más notas para la paginación ni para las destacadas
                    recentPosts.length === 0 && (
                        <div className="py-20 text-center text-gray-500">
                            No se encontraron publicaciones.
                        </div>
                    )
                )}

                {/* Paginación (Solo se muestra si hay más de una página de notas restantes) */}
                {totalPages > 1 && (
                    <div className="mt-10">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}

            </section>

        </main>
    )
}

export default Blog;