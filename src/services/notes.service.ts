const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const notesService = {
  // OBTENER NOTAS
  getNotes: async () => {
    const response = await fetch(`${VITE_API_URL}/notes`, {
      method: 'GET',
      credentials: 'include', 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener las notas');
    }

    return data; // Retorna el NotesResponse
  },

  // CREAR NOTA
  createNote: async (formData: FormData) => {
    const response = await fetch(`${VITE_API_URL}/notes/`, {
      method: 'POST',
      body: formData,
      credentials: 'include', 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear la nota');
    }

    return data;
  },

  // EDITAR NOTA
  editNote: async (id: number, formData: FormData) => {
    const response = await fetch(`${VITE_API_URL}/notes/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include', 
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al editar la nota');
    }

    return data;
  },

  // ELIMINAR NOTA
  deleteNote: async (id: number) => {
    const response = await fetch(`${VITE_API_URL}/notes/${id}`, {
      method: 'DELETE',
      credentials: 'include', 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar la nota');
    }

    return data;
  }
};