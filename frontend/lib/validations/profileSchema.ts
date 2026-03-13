import { z } from "zod"

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Enter a valid 10-digit phone number",
    }),
})

export type ProfileInput = z.infer<typeof profileSchema>
export type ProfileErrors = Partial<Record<keyof ProfileInput, string>>