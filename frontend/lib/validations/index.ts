import { z } from "zod"

export function parseErrors<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): Partial<Record<keyof z.infer<T>, string>> {
  const result = schema.safeParse(data)
  if (result.success) return {}
  return result.error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as keyof z.infer<T>
    if (!acc[field]) acc[field] = issue.message
    return acc
  }, {} as Partial<Record<keyof z.infer<T>, string>>)
}

export * from "./authSchema"
export * from "./addressSchema"
export * from "./profileSchema"