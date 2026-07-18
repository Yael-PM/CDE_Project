export interface Note {
  note_id: number;
  note_title: string;
  note_description: string;
  image_reference: string;
  url_reference: string;
  creation_date: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotesResponse {
  data: Note[];
  pagination: Pagination;
}
