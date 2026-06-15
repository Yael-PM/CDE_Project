import banerBg from '/aboutUsBanerBg.jpg'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // Importamos tu hook personalizado
import toast, { Toaster } from 'react-hot-toast'
import { ROUTES } from '../routes'

const Login = () => {
    // Extraemos login y loading de tu hook
    const { login, loading } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            // Ejecutamos el login desde el hook
            // Este ya se encarga de hacer el setLoading(true) y setUser(res.user)
            await login({ email, password })
            
            toast.success('¡Bienvenido! Login exitoso', {
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                    fontFamily: 'sans-serif'
                },
            });

            // Redirigimos usando tu objeto de rutas para mayor seguridad
            setTimeout(() => navigate(ROUTES.MANAGE_NOTES), 1000); 
            
        } catch (err) {
            const error = err  as Error;
            toast.error(error.message);
        }
    }

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />

            <section
                style={{ backgroundImage: `url(${banerBg})` }}
                className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center px-6 md:px-20"
            >
                <div className="absolute inset-0 bg-white/60 md:bg-linear-to-b md:from-white/80 md:to-white/40 z-0" />

                <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-10 flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-black mb-10 tracking-tight">
                        Iniciar Sesión
                    </h1>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                        <div className="w-full">
                            <input 
                                name="email"
                                type="email" 
                                required
                                disabled={loading}
                                placeholder="Correo" 
                                className="w-full p-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all bg-gray-50/50 disabled:opacity-50"
                            />
                        </div>

                        <div className="w-full">
                            <input 
                                name="password"
                                type="password" 
                                required
                                disabled={loading}
                                placeholder="Contraseña" 
                                className="w-full p-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all bg-gray-50/50 disabled:opacity-50"
                            />
                        </div>

                        <div className="mt-4 flex justify-center">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-10 py-2.5 bg-linear-to-r from-cyan-400 to-sky-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-200/50 hover:scale-105 transition-all duration-200 active:scale-95 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                {loading ? 'Cargando...' : 'Iniciar Sesión'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;