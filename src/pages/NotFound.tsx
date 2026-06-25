import { Link } from 'react-router-dom'
import { ROUTES } from '../routes'
import SEO from '../components/SEO'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center px-6 text-center">
            <SEO 
                title="404 - Página No Encontrada" 
                description="La página que estás buscando no existe o ha sido movida."
            />
            
            <div className="max-w-md flex flex-col items-center">
                {/* Código de error con degradado */}
                <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-sky-500 select-none animate-pulse">
                    404
                </h1>
                
                <h2 className="text-3xl font-bold text-slate-800 mt-4 tracking-tight">
                    ¡Ups! Página no encontrada
                </h2>
                
                <p className="text-base text-slate-600 mt-4 mb-8 leading-relaxed">
                    Lo sentimos, la ruta a la que intentas acceder no existe, ha sido eliminada o movida de lugar de manera permanente.
                </p>

                {/* Botón de retorno seguro */}
                <Link 
                    to={ROUTES.HOME} 
                    className="px-8 py-3 bg-linear-to-r from-cyan-400 to-sky-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-200/50 hover:scale-105 transition-all duration-200 active:scale-95"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}

export default NotFound