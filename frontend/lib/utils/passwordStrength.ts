export type PasswordStrength = {
  label: "Weak" | "Fair" | "Good" | "Strong"
  color: string
  width: string
} | null

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return null
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { label: "Weak",   color: "bg-red-400",    width: "w-1/4" }
  if (score === 2) return { label: "Fair",   color: "bg-amber-400",  width: "w-2/4" }
  if (score === 3) return { label: "Good",   color: "bg-blue-400",   width: "w-3/4" }
  return              { label: "Strong", color: "bg-[#059669]",  width: "w-full" }
}