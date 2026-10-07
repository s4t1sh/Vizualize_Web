import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid email address.' }));

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, { error: 'Enter your full name.' }).max(100, { error: 'Name is too long.' }),
    email,
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters.' })
      .max(72, { error: 'Password must be 72 characters or fewer.' }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match.',
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: 'Enter your password.' }),
});

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;

/** Turns validation problems into { fieldName: message } for showing under inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] ??= issue.message;
  }
  return out;
}
