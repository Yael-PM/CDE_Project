import type { Note } from '../types/notes.types';
interface NoteCardProps {
    note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {

    const imageUrl = note.image_reference || null;
    const date = new Date(note.creation_date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const backgroundStyle = note.image_reference ? { backgroundImage: `url(${note.image_reference})` } : {};

    const colorMap = {
        primary: { bg: 'bg-primary-500', text: 'text-primary-500' }, // Usamos 500 para que el relleno sea sólnote_ido
        secondary: { bg: 'bg-secondary-500', text: 'text-secondary-500' },
        tertiary: { bg: 'bg-tertiary-500', text: 'text-tertiary-500' },
    };

    // Función unificada para obtener ambos valores a la vez
    const getColors = (note_id: number) => {
        const keys: (keyof typeof colorMap)[] = ['primary', 'secondary', 'tertiary'];
        const selectedKey = keys[note_id % 3];
        return colorMap[selectedKey];
    };

    const colors = getColors(note.note_id);

    return (
        <div className="bg-neutral-200 rounded-md shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hnote_idden">

            {/* Espacio de Imagen o Color de Relleno */}
            <div
                style={backgroundStyle}
                className={`w-full h-48 flex items-center justify-center ${imageUrl ? 'bg-cover bg-center' : colors.bg}`}
            >
            </div>

            <div className="flex flex-col flex-1 p-4">
                <p className="text-sm text-gray-500">{date}</p>
                <h3 className="font-bold text-lg leading-tight mb-2">{note.note_title}</h3>
                <p className="line-clamp-2 text-gray-700 ">{note.note_description}</p>

                {/* Link al final */}
                <div className={`mt-auto pt-4 flex justify-end`}>
                    <a
                        href={note.url_reference.startsWith('http') ? note.url_reference : `https://${note.url_reference}`} target="_blank" rel="noopener noreferrer"
                        className={`font-semibold underline underline-offset-4 cursor-pointer ${colors.text}`}
                    >
                        Leer más →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;