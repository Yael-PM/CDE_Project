import { useState } from 'react'
import banerBg from '/aboutUsBanerBg.jpg'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' 
import toast, { Toaster } from 'react-hot-toast'
import { ROUTES } from '../routes'
import SEO from '../components/SEO'

const ForgotPassword = () => {
    // 1. Ahora extraemos requestPasswordReset y 'loading' directamente de tu hook
    const { requestPasswordReset, loading } = useAuth() 
    const [emailSent, setEmailSent] = useState(false)
    const [email, setEmail] = useState('')
    // Regex que valida el formato final del email al enviar
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Sanitiza en tiempo real: remueve caracteres especiales inválidos
        const sanitized = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '')
        setEmail(sanitized)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!emailRegex.test(email)) {
            toast.error('Por favor ingresa un correo electrónico válido');
            return;
        }

        try {
            await requestPasswordReset(email)
            setEmailSent(true)
            toast.success('Correo de recuperación enviado', {
                style: { borderRadius: '12px', background: '#333', color: '#fff' }
            });
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || 'Error al enviar el correo');
        }
    }

    return (
        <div>
            <SEO 
                title="Recuperar Contraseña - CDE" 
                description="Ingresa tu correo electrónico para restablecer tu contraseña en CDE." 
            />
            <Toaster position="top-center" reverseOrder={false} />

            <section
                style={{ backgroundImage: `url(${banerBg})` }}
                className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center px-6 md:px-20"
            >
                <div className="absolute inset-0 bg-white/60 md:bg-linear-to-b md:from-white/80 md:to-white/40 z-0" />

                <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-10 flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-black mb-4 tracking-tight text-center">
                        Recuperar Contraseña
                    </h1>
                    
                    {!emailSent ? (
                        <>
                            <p className="text-gray-600 text-center text-sm mb-8">
                                Ingresa el correo asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
                            </p>
                            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                                <div className="w-full">
                                    {/* 2. Etiqueta label conectada al id del input para solucionar el warning */}
                                    <label htmlFor="user-email" className="sr-only">
                                        Correo electrónico
                                    </label>
                                    <input 
                                        id="user-email"
                                        name="email"
                                        type="email" 
                                        required
                                        disabled={loading}
                                        onChange={handleEmailChange}
                                        placeholder="Ingresa tu correo" 
                                        className="w-full p-3 rounded-xl border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all bg-gray-50/50 disabled:opacity-50"
                                    />
                                </div>

                                <div className="mt-2 flex flex-col items-center gap-4">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2.5 bg-linear-to-r from-cyan-400 to-sky-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-200/50 hover:scale-105 transition-all duration-200 active:scale-95 disabled:grayscale disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Enviando...' : 'Enviar enlace'}
                                    </button>
                                    <Link to={ROUTES.LOGIN} className="text-sm font-medium text-gray-500 hover:text-cyan-600 transition-colors">
                                        Volver al inicio de sesión
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-3xl">
                                ✓
                            </div>
                            <p className="text-gray-600 text-center">
                                Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada o spam.
                            </p>
                            <Link to={ROUTES.LOGIN} className="w-full text-center py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-200 transition-all">
                                Volver al Login
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;