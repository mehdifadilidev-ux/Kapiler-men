export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface AdminProfile {
  id: string;
  email: string;
}
