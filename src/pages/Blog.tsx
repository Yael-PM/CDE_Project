import banerBg from '/blogBanerBg.jpg'

import CustomButton from '../components/CustomButton'
import NoteCard from "../components/NoteCard"
import Pagination from "../components/Pagination"
import { FaSearch } from 'react-icons/fa'

const Blog = () => {

    return (
        <main className="bg-neutral-100 min-h-screen flex flex-col pb-10">

            {/* Baner */}
            <section style={{ backgroundImage: `url(${banerBg})` }} className="relative w-full h-[40vh] md:h-[60vh] bg-cover bg-center flex flex-col">
                <div className="absolute inset-0 bg-neutral-100/20 z-0" />
                <h1 className="text-4xl md:text-8xl font-extrabold text-slate-900 leading-[1.1] mb-4after:content-['.'] after:ml-0.5 after:text-red-500 mt-5 mb-10 mx-5 md:mx-10">
                    Blog
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed mx-5 md:mx-10">
                    Análisis, guías prácticas y novedades en regulación sanitaria para prevenir rieesgos y operar con certeza.
                </p>
            </section>

            <section>

                <div className='grid grid-cols-1 md:grid-cols-2 mx-5 md:mx-10 my-5'>
                    <div className='flex'>
                        <CustomButton>Todos</CustomButton>
                        <CustomButton>COFEPRIS</CustomButton>
                        <CustomButton>Registros sanitarios</CustomButton>
                    </div>

                    <div className="bg-gray-300 rounded-full flex items-center py-2">
                        <label htmlFor="buscar" className="text-gray-500 mx-3 flex items-center">
                            <FaSearch size={18} />
                        </label>
                        <input
                            id="buscar"
                            type="text"
                            placeholder="Buscar nota..."
                            className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
                        />
                    </div>

                </div>
                
            </section>

            {/* Notas */}
            <section className='mx-5 md:mx-10'>

                <div className='grid grid-cols-1 md:grid-cols-2'>
                    <NoteCard id={1} date="Febrero 2026" title="Enim dolore sit laborum" excerpt="Anim amet cillum deserunt laborum culpa proident ipsum in esse voluptate. Ea minim laborum velit sint ipsum labore anim eiusmod. Mollit reprehenderit aliquip nostrud sit culpa in aliquip duis ipsum ut id irure laborum. Aliqua exercitation excepteur amet occaecat proident. Id ipsum ex culpa cillum esse." />
                    <NoteCard id={2} date="Marzo 2026" title="Enim dolore sit laborum" excerpt="Anim amet cillum deserunt laborum culpa proident ipsum in esse voluptate. Ea minim laborum velit sint ipsum labore anim eiusmod. Mollit reprehenderit aliquip nostrud sit culpa in aliquip duis ipsum ut id irure laborum. Aliqua exercitation excepteur amet occaecat proident. Id ipsum ex culpa cillum esse." imageUrl={'/blogBanerBg.jpg'}/>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-4'>

                </div>

            </section>


        </main>
    )
}

export default Blog