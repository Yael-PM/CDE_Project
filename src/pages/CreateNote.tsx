import React, { useState } from 'react';
import { LuArrowLeft, LuCloudUpload, LuLink } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useCreateNote } from '../hooks/useNotes';

const CreateNote = () => {
    const navigate = useNavigate();
    const { createNewNote, loading, error, success } = useCreateNote();
    
    // Estados del Formulario
    const [title, setTitle] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [siteUrl, setSiteUrl] = useState<string>('');
    
    // Solución error 2: Definimos que 'image' puede ser un File o null
    const [image, setImage] = useState<File | null>(null);

    // Solución error 1: Tipamos el evento del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!image) {
            // Nota: Aquí manejamos la validación local si no hay imagen seleccionada
            return;
        }

        const result = await createNewNote({
            title: title,
            description: summary,
            imageFile: image,
            urlReference: siteUrl
        });

        if (result) {
            setTimeout(() => {
                navigate('/manage-notes');
            }, 1500);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-slate-700 hover:text-slate-900 mb-4 transition-colors"
                    disabled={loading}
                >
                    <LuArrowLeft size={28} />
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Crear Nueva Nota</h1>
                    <p className="text-sm text-slate-500">
                        Complete los campos para publicar contenido informativo en el portal de CDE Consultores
                    </p>
                </div>

                {/* Toasts / Banners de Estado Integrados */}
                {error && (
                    <div className="mb-5 flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-xl text-sm font-semibold border border-red-200 animate-fadeIn">
                        <div className="flex items-center gap-2">
                            <span>❌ Error: {error}</span>
                        </div>
                    </div>
                )}
                {success && (
                    <div className="mb-5 flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-200 animate-fadeIn">
                        <div className="flex items-center gap-2">
                            <span>🎉 ¡Nota creada correctamente! Redirigiendo...</span>
                        </div>
                    </div>
                )}

                <form 
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-10 flex flex-col gap-6"
                >
                    {/* Título de la Nota */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800">Título de la Nota</label>
                        <input 
                            type="text" 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Agregue el título de la nota"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-sky-500 bg-slate-50/50"
                        />
                    </div>

                    {/* Resumen Informativo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800">Resumen informativo</label>
                        <textarea 
                            rows={4}
                            required
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Aquí agrega un resumen de la nota"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none"
                        />
                    </div>

                    {/* Imagen de Portada */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800">Imagen de portada</label>
                        <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors group">
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp"
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                            <div className="text-sky-400 group-hover:scale-105 transition-transform">
                                <LuCloudUpload size={48} />
                            </div>
                            <div className="text-center">
                                {/* Solución error 3: Al estar tipado como File, .name ya existe de forma nativa */}
                                <p className="text-sm text-slate-500 font-medium">
                                    {image ? `Archivo seleccionado: ${image.name}` : 'Haga clic para subir o arrastre una imagen'}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">PNG, JPG o WEBP</p>
                            </div>
                        </label>
                        {!image && (
                            <p className="text-xs text-amber-600 font-medium mt-1">
                                * La imagen de portada es mandatoria para publicar la nota.
                            </p>
                        )}
                    </div>

                    {/* Enlace del sitio (URL) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800">Enlace del sitio (URL)</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-gray-400">
                                <LuLink size={18} />
                            </span>
                            <input 
                                type="url" 
                                required
                                value={siteUrl}
                                onChange={(e) => setSiteUrl(e.target.value)}
                                placeholder="agrega la url del sitio"
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-sky-500 bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end items-center gap-6 mt-4">
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                            className="text-sm font-bold text-slate-900 hover:text-slate-600 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        
                        <button 
                            type="submit"
                            disabled={loading || !image}
                            className="bg-sky-400 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? 'Subiendo nota...' : 'Crear Nota'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNote;