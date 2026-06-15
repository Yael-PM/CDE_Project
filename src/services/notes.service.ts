const API_URL = import.meta.env.API_URL || 'http://localhost:4000/api';

export const notesService = {
  // Tipamos 'formData' explícitamente como FormData
  createNote: async (formData: FormData) => {
    const response = await fetch(`${API_URL}/notes/`, {
      method: 'POST',
      body: formData,
      credentials: 'include', 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear la nota');
    }

    return data;
  }
};