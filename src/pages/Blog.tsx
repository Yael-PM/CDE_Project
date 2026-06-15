import { useState, useEffect } from 'react'
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

export interface ApiResponse {
    data: BlogPost[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const NOTES_PER_PAGE = 12; // Notas por página en la sección de abajo

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                console.log("API URL:", apiUrl); // Verificar que la URL se esté leyendo correctamente
                const response = await fetch(`${apiUrl}/notes`);

                if (!response.ok) {
                    throw new Error('Error al conectar con la base de datos');
                }

                const data: BlogPost[] = await response.json();
                setPosts(data);
            } catch (err: any) {
                setError(err.message || 'Ocurrió un error inesperado');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    /* Filtrar notas según la búsqueda */
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    const recentPosts = filteredPosts.slice(0, 2);

    const remainingPosts = filteredPosts.slice(2);

    const totalPages = Math.ceil(remainingPosts.length / NOTES_PER_PAGE);

    // Cortar el array de las restantes para la página actual
    const paginatedPosts = remainingPosts.slice(
        (currentPage - 1) * NOTES_PER_PAGE,
        currentPage * NOTES_PER_PAGE
    );

    /* Manejador de búsqueda */
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };


    //Manejo de estados de carga y error en la interfaz
    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Cargando publicaciones de regulación sanitaria...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;
    }

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