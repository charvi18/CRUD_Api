/**
 * Student API Routes
 *
 * Base URL: /api/v1/students
 *
 * GET    /          → Get all students
 * POST   /          → Create student
 * GET    /:id       → Get student by ID
 * PUT    /:id       → Update student (full update)
 * PATCH  /:id       → Partial update student
 * DELETE /:id       → Delete student
 */

import { Router } from 'express';

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  patchStudent,
  deleteStudent,
} from '../controllers/student.controller';

const router = Router();

/**
 * Collection routes
 */
router.route('/')
  .get(getAllStudents)     // GET  /api/v1/students
  .post(createStudent);    // POST /api/v1/students

/**
 * Single resource routes
 */
router.route('/:id')
  .get(getStudentById)     // GET    /api/v1/students/:id
  .put(updateStudent)      // PUT    /api/v1/students/:id
  .patch(patchStudent)     // PATCH  /api/v1/students/:id 
  .delete(deleteStudent);  // DELETE /api/v1/students/:id

export default router;