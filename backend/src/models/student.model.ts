/**
 * models/student.model.ts
 * Handles all database operations related to students.
 */

import { pool } from '../config/db';

import {
  Student,
  CreateStudentDTO,
  UpdateStudentDTO,
} from '../interfaces/student.interface';

// ─────────────────────────────────────────────────────────────
// GET ALL STUDENTS
// ─────────────────────────────────────────────────────────────

export const findAllStudents = async (): Promise<Student[]> => {
  const query = `
    SELECT * FROM students
    ORDER BY id ASC
  `;

  const result = await pool.query(query);

  return result.rows;
};

// ─────────────────────────────────────────────────────────────
// GET STUDENT BY ID
// ─────────────────────────────────────────────────────────────

export const findStudentById = async (
  id: number,
): Promise<Student | null> => {
  const query = `
    SELECT * FROM students
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};

// ─────────────────────────────────────────────────────────────
// GET STUDENT BY EMAIL
// ─────────────────────────────────────────────────────────────

export const findStudentByEmail = async (
  email: string,
): Promise<Student | null> => {
  const query = `
    SELECT * FROM students
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0] || null;
};

// ─────────────────────────────────────────────────────────────
// CREATE STUDENT
// ─────────────────────────────────────────────────────────────

export const createStudent = async (
  dto: CreateStudentDTO,
): Promise<Student> => {
  const query = `
    INSERT INTO students (name, email, course, age)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    dto.name,
    dto.email,
    dto.course,
    dto.age,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// ─────────────────────────────────────────────────────────────
// UPDATE STUDENT
// ─────────────────────────────────────────────────────────────

export const updateStudent = async (
  id: number,
  dto: UpdateStudentDTO,
): Promise<Student | null> => {
  const query = `
    UPDATE students
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      course = COALESCE($3, course),
      age = COALESCE($4, age)
    WHERE id = $5
    RETURNING *
  `;

  const values = [
    dto.name,
    dto.email,
    dto.course,
    dto.age,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};

// ─────────────────────────────────────────────────────────────
// DELETE STUDENT
// ─────────────────────────────────────────────────────────────

export const deleteStudent = async (
  id: number,
): Promise<boolean> => {
  const query = `
    DELETE FROM students
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return (result.rowCount ?? 0) > 0;
};