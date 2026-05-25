/**
 * interfaces/student.interface.ts
 * Defines the structure of Student data and related DTOs.
 * These interfaces are shared across controller, service, and model layers.
 */

// Main Student entity (stored in database / array)
export interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  age: number;
}

// DTO for creating a student
// id is excluded because backend generates it
export interface CreateStudentDTO {
  name: string;
  email: string;
  course: string;
  age: number;
}

// DTO for updating a student
// All fields optional because user may update only some fields
export interface UpdateStudentDTO {
  name?: string;
  email?: string;
  course?: string;
  age?: number;
}

// Query parameters for filtering, searching, and pagination
export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  course?: string;
}