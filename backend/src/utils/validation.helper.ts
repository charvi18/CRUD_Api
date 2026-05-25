/**
 * utils/validation.helper.ts
 * Validation helper functions for Student APIs.
 */

import {
  CreateStudentDTO,
  UpdateStudentDTO,
} from '../interfaces/student.interface';

import { ValidationError } from '../interfaces/api-response.interface';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─────────────────────────────────────────────────────────────
// CREATE STUDENT VALIDATION
// ─────────────────────────────────────────────────────────────

export const validateCreateStudent = (
  body: Partial<CreateStudentDTO>,
): ValidationError[] => {

  const errors: ValidationError[] = [];

  // Name validation
  if (!body.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  }

  // Email validation
  if (!body.email?.trim()) {

    errors.push({
      field: 'email',
      message: 'Email is required',
    });

  } else if (!EMAIL_REGEX.test(body.email)) {

    errors.push({
      field: 'email',
      message: 'Invalid email format',
    });
  }

  // Course validation
  if (!body.course?.trim()) {
    errors.push({
      field: 'course',
      message: 'Course is required',
    });
  }

  // Age validation
  if (body.age === undefined) {

    errors.push({
      field: 'age',
      message: 'Age is required',
    });

  } else if (typeof body.age !== 'number') {

    errors.push({
      field: 'age',
      message: 'Age must be a number',
    });

  } else if (body.age < 1 || body.age > 100) {

    errors.push({
      field: 'age',
      message: 'Age must be between 1 and 100',
    });
  }

  return errors;
};

// ─────────────────────────────────────────────────────────────
// UPDATE STUDENT VALIDATION
// ─────────────────────────────────────────────────────────────

export const validateUpdateStudent = (
  body: Partial<UpdateStudentDTO>,
): ValidationError[] => {

  const errors: ValidationError[] = [];

  // Empty body validation
  if (Object.keys(body).length === 0) {

    errors.push({
      field: 'body',
      message: 'At least one field is required for update',
    });

    return errors;
  }

  // Name validation
  if (
    body.name !== undefined &&
    !body.name.trim()
  ) {

    errors.push({
      field: 'name',
      message: 'Name cannot be empty',
    });
  }

  // Email validation
  if (
    body.email !== undefined &&
    !EMAIL_REGEX.test(body.email)
  ) {

    errors.push({
      field: 'email',
      message: 'Invalid email format',
    });
  }

  // Course validation
  if (
    body.course !== undefined &&
    !body.course.trim()
  ) {

    errors.push({
      field: 'course',
      message: 'Course cannot be empty',
    });
  }

  // Age validation
  if (body.age !== undefined) {

    if (typeof body.age !== 'number') {

      errors.push({
        field: 'age',
        message: 'Age must be a number',
      });

    } else if (body.age < 1 || body.age > 100) {

      errors.push({
        field: 'age',
        message: 'Age must be between 1 and 100',
      });
    }
  }

  return errors;
};