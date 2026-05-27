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

  let students = await findAllStudents();

  if (search) {
    students = students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (course) {
    students = students.filter(
      (student) =>
        student.course.toLowerCase() === course.toLowerCase(),
    );
  }

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
  const existingStudent = await findStudentByEmail(dto.email);

  if (existingStudent) {
    throw new AppError('Email already exists', 409);
  }

  return await createStudent(dto);
};

// ─────────────────────────────────────────────────────────────
// UPDATE STUDENT (PUT - full update)
// ─────────────────────────────────────────────────────────────

export const updateStudentService = async (
  id: number,
  dto: UpdateStudentDTO,
): Promise<Student> => {
  const existingStudent = await findStudentById(id);

  if (!existingStudent) {
    throw new AppError('Student not found', 404);
  }

  if (dto.email) {
    const emailExists = await findStudentByEmail(dto.email);

    if (emailExists && emailExists.id !== id) {
      throw new AppError('Email already exists', 409);
    }
  }

  const updatedStudent = await updateStudent(id, dto);

  if (!updatedStudent) {
    throw new AppError('Failed to update student', 500);
  }

  return updatedStudent;
};

// ─────────────────────────────────────────────────────────────
// PATCH STUDENT (partial update)
// ─────────────────────────────────────────────────────────────

export const patchStudentService = async (
  id: number,
  dto: Partial<UpdateStudentDTO>,
): Promise<Student> => {
  const existingStudent = await findStudentById(id);

  if (!existingStudent) {
    throw new AppError('Student not found', 404);
  }

  // If email is being updated → check duplication
  if (dto.email) {
    const emailExists = await findStudentByEmail(dto.email);

    if (emailExists && emailExists.id !== id) {
      throw new AppError('Email already exists', 409);
    }
  }

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
  const existingStudent = await findStudentById(id);

  if (!existingStudent) {
    throw new AppError('Student not found', 404);
  }

  const deleted = await deleteStudent(id);

  if (!deleted) {
    throw new AppError('Failed to delete student', 500);
  }
};