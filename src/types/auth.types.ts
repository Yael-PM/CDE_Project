// La entidad pura del usuario
export interface UserData {
  userId: number;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
}

// La forma exacta de lo que devuelve el backend
export interface LoginResponse {
  message: string;
  user: UserData;
}

export interface LoginPayload {
  email: string;
  password: string;
}
