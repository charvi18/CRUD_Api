/**
 * routes/student.routes.ts
 * Maps HTTP verbs + paths to controller functions.
 * Follows REST conventions:
 *   Collection  →  /students
 *   Member      →  /students/:id
 * No verb-in-URL anti-patterns like /createStudent or /getStudentById.
 */

import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller';

const router = Router();

// Collection endpoints
router.route('/')
  .get(getAllStudents)   // GET  /api/v1/students
  .post(createStudent); // POST /api/v1/students

// Member endpoints
router.route('/:id')
  .get(getStudentById)    // GET    /api/v1/students/:id
  .put(updateStudent)     // PUT    /api/v1/students/:id
  .delete(deleteStudent); // DELETE /api/v1/students/:id

export default router;

