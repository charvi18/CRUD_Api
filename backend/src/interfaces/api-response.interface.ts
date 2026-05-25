/**
 * interfaces/api-response.interface.ts
 * Standardised API response envelope used across all endpoints.
 * Ensures every response — success or error — has a predictable shape.
 */

// Generic success response — T is the payload type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

// Pagination metadata attached to list responses
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error response — extends base with optional validation details
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
  statusCode?: number;
}

// Individual validation error entry
export interface ValidationError {
  field: string;
  message: string;
}
