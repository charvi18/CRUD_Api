/**
 * schemas/student.schema.ts  — Zod v4 compatible
 *
 * Zod v4 API changes vs v3:
 *   BEFORE (v3): z.string({ required_error: "...", invalid_type_error: "..." })
 *   NOW    (v4): z.string({ error: "..." })
 *
 *   BEFORE (v3): ZodError.errors[]
 *   NOW    (v4): ZodError.issues[]
 *
 *   BEFORE (v3): z.enum(["a","b"], { required_error: "...", invalid_type_error: "..." })
 *   NOW    (v4): z.enum(["a","b"], { error: "..." })
 */

import { z } from "zod";

// ─── Reusable Field Definitions ───────────────────────────────────────────────

const nameField = z
  .string({ error: "Name must be a string" })
  .trim()
  .min(2,   "Name must be at least 2 characters")
  .max(100, "Name must be at most 100 characters");

const emailField = z
  .string({ error: "Email must be a string" })
  .trim()
  .toLowerCase()
  .email("Invalid email format — example: user@domain.com");

const courseField = z
  .string({ error: "Course must be a string" })
  .trim()
  .min(2,   "Course must be at least 2 characters")
  .max(150, "Course must be at most 150 characters");

/**
 * Age field — demonstrates z.coerce + .int() validation.
 *
 * z.coerce.number()  → accepts "21" (string) OR 21 (number); rejects "abc"
 * .int()             → rejects 20.5  → "Age must be an integer"
 * .min(15)           → rejects 10    → "Age must be at least 15"
 * .max(80)           → rejects 99    → "Age must be at most 80"
 *
 * So sending { age: "abc" }  → "Age must be a number"
 *            { age: 20.5  }  → "Age must be an integer"
 *            { age: 10    }  → "Age must be at least 15"
 *            { age: 21    }  → ✓ valid
 */
const ageField = z.coerce
  .number({ error: "Age must be a number — e.g. 21" })
  .int("Age must be an integer — e.g. 21, not 20.5")
  .min(15, "Age must be at least 15")
  .max(80, "Age must be at most 80");

const phoneField = z
  .string({ error: "Phone must be a string" })
  .trim()
  .regex(
    /^[\+]?[\d\s\-\(\)]{7,20}$/,
    "Invalid phone number — example: +91-9876543210"
  );

// z.enum in Zod v4: first arg is array, second is options object with { error }
const genderField = z.enum(["male", "female", "other"] as const, {
  error: 'Gender must be one of: "male", "female", "other"',
});

const yearField = z.coerce
  .number({ error: "Year must be a number" })
  .int("Year must be an integer")
  .min(1, "Year must be 1, 2, 3, or 4")
  .max(4, "Year must be 1, 2, 3, or 4");

const gpaField = z.coerce
  .number({ error: "GPA must be a number" })
  .min(0.0, "GPA must be at least 0.0")
  .max(4.0, "GPA must be at most 4.0");

const dateField = (fieldLabel: string) =>
  z
    .string({ error: `${fieldLabel} must be a string` })
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      `${fieldLabel} must be in YYYY-MM-DD format — e.g. 2003-04-18`
    );

const addressField = z
  .string({ error: "Address must be a string" })
  .trim()
  .min(5, "Address must be at least 5 characters");

// ─── CREATE Student Schema (POST /students) ───────────────────────────────────

export const createStudentSchema = z.object({
  name:      nameField,
  lastName:       nameField,
  email:          emailField,
  phone:          phoneField,
  dateOfBirth:    dateField("Date of birth"),
  gender:         genderField,
  address:        addressField,
  course:         courseField,
  year:           yearField,
  gpa:            gpaField,
  enrollmentDate: dateField("Enrollment date").optional(),
  isActive:       z.boolean({ error: "isActive must be true or false" }).optional(),
  age:            ageField.optional(), // optional companion field
});

// ─── UPDATE Student Schema (PUT /students/:id) ────────────────────────────────

export const updateStudentSchema = createStudentSchema;

// ─── PATCH Student Schema (PATCH /students/:id) ───────────────────────────────

export const patchStudentSchema = createStudentSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "Request body must contain at least one field to update" }
  );

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type PatchStudentInput  = z.infer<typeof patchStudentSchema>;
