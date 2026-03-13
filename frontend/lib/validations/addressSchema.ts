import { z } from "zod"

export const addressSchema = z.object({
  label: z.string().optional(),
  line1: z.string().min(1, "Street address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().default(false),
})

export type AddressInput = z.infer<typeof addressSchema>
export type AddressErrors = Partial<Record<keyof AddressInput, string>>