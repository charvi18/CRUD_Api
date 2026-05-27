/**
 * controllers/student.controller.ts
 * HTTP layer — parses request data, delegates to service, formats responses.
 */

import { Request, Response, NextFunction } from 'express';

import {
  getAllStudentsService,
  getStudentByIdService,
  createStudentService,
  updateStudentService,
  deleteStudentService,
} from '../services/student.service';

import { sendSuccess } from '../utils/response.helper';

import {
  validateCreateStudent,
  validateUpdateStudent,
} from '../utils/validation.helper';

import {
  StudentQueryParams,
  CreateStudentDTO,
  UpdateStudentDTO,
} from '../interfaces/student.interface';

// ─────────────────────────────────────────────────────────────
// GET ALL STUDENTS
// ─────────────────────────────────────────────────────────────

export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params: StudentQueryParams = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search as string | undefined,
      course: req.query.course as string | undefined,
    };

    const { students, meta } = await getAllStudentsService(params);

    sendSuccess(res, 'Students retrieved successfully', students, 200, meta);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET STUDENT BY ID
// ─────────────────────────────────────────────────────────────

export const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const student = await getStudentByIdService(id);

    sendSuccess(res, 'Student retrieved successfully', student);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// CREATE STUDENT
// ─────────────────────────────────────────────────────────────

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as Partial<CreateStudentDTO>;

    const errors = validateCreateStudent(body);
    console.log(req.body);
    if (errors.length > 0) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    const student = await createStudentService(body as CreateStudentDTO);

    sendSuccess(res, 'Student created successfully', student, 201);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE STUDENT (PUT - full update)
// ─────────────────────────────────────────────────────────────

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const body = req.body as Partial<UpdateStudentDTO>;

    const errors = validateUpdateStudent(body);

    if (errors.length > 0) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    const student = await updateStudentService(id, body);

    sendSuccess(res, 'Student updated successfully', student);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH STUDENT (partial update)
// ─────────────────────────────────────────────────────────────

export const patchStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const body = req.body as Partial<UpdateStudentDTO>;

    // optional safety check
    if (!body || Object.keys(body).length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one field is required for patch update',
      });
      return;
    }

    const student = await updateStudentService(id, body);

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    sendSuccess(res, 'Student partially updated successfully', student);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE STUDENT
// ─────────────────────────────────────────────────────────────

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    await deleteStudentService(id);

    sendSuccess(res, 'Student deleted successfully');
  } catch (error) {
    next(error);
  }
};