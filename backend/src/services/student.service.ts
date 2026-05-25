/**
 * services/student.service.ts
 * Business logic layer for student operations.
 */

import {
  findAllStudents,
  findStudentById,
  findStudentByEmail,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../models/student.model';

import {
  Student,
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentQueryParams,
} from '../interfaces/student.interface';

import { AppError } from '../utils/app-error';

// ─────────────────────────────────────────────────────────────
// GET ALL STUDENTS
// ─────────────────────────────────────────────────────────────

export const getAllStudentsService = async (
  params: StudentQueryParams,
): Promise<{
  students: Student[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {

  const {
    page = 1,
    limit = 10,
    search,
    course,
  } = params;

  // Fetch students from database
  let students = await findAllStudents();

  // Search filter
  if (search) {
    students = students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // Course filter
  if (course) {
    students = students.filter(
      (student) =>
        student.course.toLowerCase() === course.toLowerCase(),
    );
  }

  // Pagination
  const total = students.length;
  const totalPages = Math.ceil(total / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedStudents = students.slice(startIndex, endIndex);

  return {
    students: paginatedStudents,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

// ─────────────────────────────────────────────────────────────
// GET STUDENT BY ID
// ─────────────────────────────────────────────────────────────

export const getStudentByIdService = async (
  id: number,
): Promise<Student> => {

  const student = await findStudentById(id);

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  return student;
};

// ─────────────────────────────────────────────────────────────
// CREATE STUDENT
// ─────────────────────────────────────────────────────────────

export const createStudentService = async (
  dto: CreateStudentDTO,
): Promise<Student> => {

  // Check duplicate email
  const existingStudent = await findStudentByEmail(dto.email);

  if (existingStudent) {
    throw new AppError('Email already exists', 409);
  }

  // Create student
  const student = await createStudent(dto);

  return student;
};

// ─────────────────────────────────────────────────────────────
// UPDATE STUDENT
// ─────────────────────────────────────────────────────────────

export const updateStudentService = async (
  id: number,
  dto: UpdateStudentDTO,
): Promise<Student> => {

  // Check student exists
  const existingStudent = await findStudentById(id);

  if (!existingStudent) {
    throw new AppError('Student not found', 404);
  }

  // Check duplicate email if updating email
  if (dto.email) {
    const emailExists = await findStudentByEmail(dto.email);

    if (emailExists && emailExists.id !== id) {
      throw new AppError('Email already exists', 409);
    }
  }

  // Update student
  const updatedStudent = await updateStudent(id, dto);

  if (!updatedStudent) {
    throw new AppError('Failed to update student', 500);
  }

  return updatedStudent;
};

// ─────────────────────────────────────────────────────────────
// DELETE STUDENT
// ─────────────────────────────────────────────────────────────

export const deleteStudentService = async (
  id: number,
): Promise<void> => {

  // Check student exists
  const existingStudent = await findStudentById(id);

  if (!existingStudent) {
    throw new AppError('Student not found', 404);
  }

  // Delete student
  const deleted = await deleteStudent(id);

  if (!deleted) {
    throw new AppError('Failed to delete student', 500);
  }
};