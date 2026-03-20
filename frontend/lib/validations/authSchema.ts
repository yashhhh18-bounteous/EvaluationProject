import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
})

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  confirm: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type LoginErrors = Partial<Record<keyof LoginInput, string>>
export type SignupErrors = Partial<Record<keyof SignupInput, string>>

export const parseErrors = <T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  data: unknown
): Partial<Record<string, string>> => {
  const result = schema.safeParse(data)
  if (result.success) return {}
  return result.error.issues.reduce((acc, issue) => {
    const key = issue.path[0] as string
    if (!acc[key]) acc[key] = issue.message // first error per field wins
    return acc
  }, {} as Record<string, string>)
}