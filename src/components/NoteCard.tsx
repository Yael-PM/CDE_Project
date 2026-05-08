interface NoteCardProps {
    id: number;
    date: string;
    title: string;
    excerpt: string;
    imageUrl?: string | null;
}

const NoteCard = ({ id, date, title, excerpt, imageUrl }: NoteCardProps) => {

    const backgroundStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

    const colorMap = {
        primary: { bg: 'bg-primary-500', text: 'text-primary-500' }, // Usamos 500 para que el relleno sea sólido
        secondary: { bg: 'bg-secondary-500', text: 'text-secondary-500' },
        tertiary: { bg: 'bg-tertiary-500', text: 'text-tertiary-500' },
    };

    // Función unificada para obtener ambos valores a la vez
    const getColors = (id: number) => {
        const keys: (keyof typeof colorMap)[] = ['primary', 'secondary', 'tertiary'];
        const selectedKey = keys[id % 3];
        return colorMap[selectedKey];
    };

    const colors = getColors(id);

    return (
        <div className="bg-neutral-200 rounded-md shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
            
            {/* Espacio de Imagen o Color de Relleno */}
            <div
                style={backgroundStyle}
                className={`w-full h-48 flex items-center justify-center ${imageUrl ? 'bg-cover bg-center' : colors.bg}`}
            >
            </div>

            <div className="flex flex-col flex-1 p-4">
                <p className="text-sm text-gray-500">{date}</p>
                <h3 className="font-bold text-lg leading-tight mb-2">{title}</h3>
                <p className="line-clamp-2 text-gray-700 ">{excerpt}</p>

                {/* Link al final */}
                <div className={`mt-auto pt-4 flex justify-end`}>
                    <p className={`font-semibold underline underline-offset-4 cursor-pointer ${colors.text}`}>
                        Leer más →
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;