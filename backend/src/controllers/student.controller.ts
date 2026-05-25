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
      page: req.query.page
        ? Number(req.query.page)
        : undefined,

      limit: req.query.limit
        ? Number(req.query.limit)
        : undefined,

      search: req.query.search as string | undefined,

      course: req.query.course as string | undefined,
    };

    // IMPORTANT: await added
    const { students, meta } =
      await getAllStudentsService(params);

    sendSuccess(
      res,
      'Students retrieved successfully',
      students,
      200,
      meta,
    );

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
    // Convert string to number
    const id = Number(req.params.id);

    // IMPORTANT: await added
    const student =
      await getStudentByIdService(id);

    sendSuccess(
      res,
      'Student retrieved successfully',
      student,
    );

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
    const body =
      req.body as Partial<CreateStudentDTO>;

    // Validate request body
    const errors =
      validateCreateStudent(body);

    if (errors.length > 0) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors,
      });

      return;
    }

    // IMPORTANT: await added
    const student =
      await createStudentService(
        body as CreateStudentDTO,
      );

    sendSuccess(
      res,
      'Student created successfully',
      student,
      201,
    );

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE STUDENT
// ─────────────────────────────────────────────────────────────

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {

  try {
    // Convert string to number
    const id = Number(req.params.id);

    const body =
      req.body as Partial<UpdateStudentDTO>;

    const errors =
      validateUpdateStudent(body);

    if (errors.length > 0) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors,
      });

      return;
    }

    // IMPORTANT: await added
    const student =
      await updateStudentService(id, body);

    sendSuccess(
      res,
      'Student updated successfully',
      student,
    );

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
    // Convert string to number
    const id = Number(req.params.id);

    // IMPORTANT: await added
    await deleteStudentService(id);

    sendSuccess(
      res,
      'Student deleted successfully',
    );

  } catch (error) {
    next(error);
  }
};