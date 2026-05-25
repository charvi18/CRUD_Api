/**
 * middlewares/validate.middleware.ts  — Zod v4 compatible
 *
 * Zod v4 change: ZodError.errors → ZodError.issues
 *
 * FLOW:
 *   Request → validate middleware → safeParse()
 *     FAIL → 422 with formatted errors array → controller never runs
 *     PASS → parsed data on req.validatedBody / req.validatedParams → next()
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// ─── Extend Express Request ───────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      validatedBody?:   Record<string, unknown>;
      validatedParams?: Record<string, unknown>;
      validatedQuery?:  Record<string, unknown>;
    }
  }
}

type RequestTarget = "body" | "params" | "query";

// ─── Error Formatter ──────────────────────────────────────────────────────────

/**
 * Converts ZodError.issues into our flat { field, message }[] shape.
 *
 * Zod v4 uses .issues (not .errors like v3).
 * Each issue has:
 *   path:    string[] — which field failed, e.g. ["age"]
 *   message: string   — human-readable reason, e.g. "Age must be an integer"
 *
 * Example output:
 *   [
 *     { field: "firstName", message: "Name must be at least 2 characters" },
 *     { field: "age",       message: "Age must be an integer — e.g. 21, not 20.5" },
 *     { field: "email",     message: "Invalid email format" }
 *   ]
 */
const formatZodErrors = (
  error: ZodError
): { field: string; message: string }[] => {
  return error.issues.map((issue) => ({           // ← .issues in Zod v4
    field:   issue.path.length > 0 ? issue.path.join(".") : "request",
    message: issue.message,
  }));
};

// ─── Middleware Factory ───────────────────────────────────────────────────────

/**
 * validate(target, schema)
 *
 * Usage in routes:
 *   router.post("/",    validate("body",   createStudentSchema), controller.create)
 *   router.get("/:id",  validate("params", idParamSchema),       controller.getById)
 *   router.patch("/:id",validate("params", idParamSchema),
 *                       validate("body",   patchStudentSchema),   controller.patch)
 */
export const validate =
  (target: RequestTarget, schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {

    const data =
      target === "body"   ? req.body   :
      target === "params" ? req.params :
                            req.query;

    const result = schema.safeParse(data);

    if (!result.success) {
      // ── Validation FAILED ─────────────────────────────────────────────────
      const errors = formatZodErrors(result.error);

      res.status(422).json({
        success:   false,
        message:   `Validation failed on request ${target}`,
        errors,           // [{ field: "age", message: "Age must be an integer" }, ...]
        timestamp: new Date().toISOString(),
      });
      return;             // stop here — controller never runs
    }

    // ── Validation PASSED ─────────────────────────────────────────────────
    // result.data is the Zod-parsed value:
    //   - strings are trimmed + lowercased where schema says so
    //   - "21" is coerced to 21 if field uses z.coerce.number()
    //   - no extra/unknown fields (Zod strips them by default)

    if (target === "body")   req.validatedBody   = result.data as Record<string, unknown>;
    if (target === "params") req.validatedParams = result.data as Record<string, unknown>;
    if (target === "query")  req.validatedQuery  = result.data as Record<string, unknown>;

    next();
  };
