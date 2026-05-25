/**
 * schemas/id.schema.ts  — Zod v4 compatible
 *
 * Validates the :id route parameter as a UUID v4.
 *
 * YOUR ORIGINAL: used /^\d+$/ for numeric IDs.
 * THIS PROJECT:  uses UUID v4 (e.g. "a1b2c3d4-e5f6-4789-abcd-ef0123456789").
 *
 * If you send a bad ID like:
 *   GET /api/v1/students/abc123
 *
 * You get back a clear 422 BEFORE hitting the database:
 *   {
 *     "success": false,
 *     "message": "Validation failed on request params",
 *     "errors": [
 *       { "field": "id", "message": "ID must be a valid UUID..." }
 *     ]
 *   }
 *
 * Instead of a confusing PostgreSQL "invalid input syntax for type uuid" 500 error.
 */

import { z } from "zod";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const idParamSchema = z.object({
  id: z
    .string({ error: "ID param is required" })
    .regex(
      UUID_REGEX,
      "ID must be a valid UUID — e.g. a1b2c3d4-e5f6-4789-abcd-ef0123456789"
    ),
});

export type IdParam = z.infer<typeof idParamSchema>;

// ─── For numeric ID projects ──────────────────────────────────────────────────
// If using SERIAL/INTEGER primary keys instead of UUIDs, use this instead:
//
// export const idParamSchema = z.object({
//   id: z
//     .string()
//     .regex(/^\d+$/, "ID must be a positive integer — e.g. 1, 42")
//     .transform((val) => Number(val)),
// });
