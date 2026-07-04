import { useState } from 'react'
import banerBg from '/aboutUsBanerBg.jpg'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' 
import toast, { Toaster } from 'react-hot-toast'
import { ROUTES } from '../routes'
import SEO from '../components/SEO'
import { Eye, EyeOff } from 'lucide-react'

const ResetPassword = () => {
    // 1. Extraemos los parámetros de búsqueda de la URL
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') // Así obtenemos el valor de "?token=..."
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    
    // Asumimos que requestPasswordReset devuelve loading y resetPassword
    const { resetPassword, loading: authLoading } = useAuth() 
    const navigate = useNavigate()
    const [localLoading, setLocalLoading] = useState(false)

    // Usamos el loading del hook o el local para deshabilitar botones
    const isLoading = authLoading || localLoading;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 8) { // Actualizado a 8 para coincidir con la validación de tu backend
            toast.error("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        try {
            setLocalLoading(true)
            // Llama a tu backend con el nuevo password y el token
            await resetPassword(token as string, password)
            
            toast.success('Contraseña actualizada con éxito', {
                style: { borderRadius: '12px', background: '#333', color: '#fff' }
            });

            setTimeout(() => navigate(ROUTES.LOGIN), 2000); 
            
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || 'Error al restablecer la contraseña');
        } finally {
            setLocalLoading(false)
        }
    }

    // 2. Si alguien entra a la página sin el ?token= en la URL, le mostramos el error
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
                        <div className="relative w-full">
                            <label htmlFor="new-password" className="sr-only">Nueva contraseña</label>
                            <input 
                                id="new-password"
                                name="password"
                                type={showPassword ? "text" : "password"} // Cambia el tipo
                                required
                                disabled={isLoading}
                                placeholder="Nueva contraseña" 
                                className="w-full p-3 pr-12 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50/50"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-cyan-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Input Confirmar Contraseña */}
                        <div className="relative w-full">
                            <label htmlFor="confirm-password" className="sr-only">Confirmar nueva contraseña</label>
                            <input 
                                id="confirm-password"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                disabled={isLoading}
                                placeholder="Confirmar nueva contraseña" 
                                className="w-full p-3 pr-12 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50/50"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-cyan-600"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-linear-to-r from-cyan-400 to-sky-400 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all">
                            {isLoading ? 'Guardando...' : 'Guardar contraseña'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;