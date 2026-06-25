import { useState } from 'react'
import banerBg from '/aboutUsBanerBg.jpg'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' 
import toast, { Toaster } from 'react-hot-toast'
import { ROUTES } from '../routes'
import SEO from '../components/SEO'

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>() // Obtiene el token de la URL
    const { resetPassword } = useAuth() // Asumimos que agregarás este método
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            setLoading(true)
            // Llama a tu backend con el nuevo password y el token de la URL
            await resetPassword(token as string, password)
            
            toast.success('Contraseña actualizada con éxito', {
                style: { borderRadius: '12px', background: '#333', color: '#fff' }
            });

            setTimeout(() => navigate(ROUTES.LOGIN), 2000); 
            
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || 'Error al restablecer la contraseña');
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="h-screen flex justify-center items-center bg-gray-100">
                <p className="text-xl text-red-500 font-semibold">Enlace inválido o expirado.</p>
            </div>
        )
    }

    return (
        <div>
            <SEO 
                title="Crear Nueva Contraseña - CDE" 
                description="Establece tu nueva contraseña para acceder a CDE." 
            />
            <Toaster position="top-center" reverseOrder={false} />

            <section
                style={{ backgroundImage: `url(${banerBg})` }}
                className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center px-6 md:px-20"
            >
                <div className="absolute inset-0 bg-white/60 md:bg-linear-to-b md:from-white/80 md:to-white/40 z-0" />

                <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-10 flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-black mb-4 tracking-tight text-center">
                        Nueva Contraseña
                    </h1>
                    <p className="text-gray-600 text-center text-sm mb-8">
                        Ingresa tu nueva contraseña a continuación.
                    </p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <div className="w-full">
                            <input 
                                name="password"
                                type="password" 
                                required
                                disabled={loading}
                                placeholder="Nueva contraseña" 
                                className="w-full p-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all bg-gray-50/50 disabled:opacity-50"
                            />
                        </div>

                        <div className="w-full">
                            <input 
                                name="confirmPassword"
                                type="password" 
                                required
                                disabled={loading}
                                placeholder="Confirmar nueva contraseña" 
                                className="w-full p-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all bg-gray-50/50 disabled:opacity-50"
                            />
                        </div>

                        <div className="mt-4 flex justify-center">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-linear-to-r from-cyan-400 to-sky-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-200/50 hover:scale-105 transition-all duration-200 active:scale-95 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                {loading ? 'Guardando...' : 'Guardar contraseña'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;