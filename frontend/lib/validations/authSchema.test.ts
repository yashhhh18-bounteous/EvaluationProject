
import { loginSchema, signupSchema, parseErrors } from "@/lib/validations"

// ─────────────────────────────────────────────
// HELPERS — valid base data to start from
// ─────────────────────────────────────────────
const validSignup = {
  name: "Yash Jha",
  email: "yash@example.com",
  password: "Password1",
  confirm: "Password1",
}

const validLogin = {
  email: "yash@example.com",
  password: "Password1",
}

// ─────────────────────────────────────────────
// parseErrors — the helper itself
// ─────────────────────────────────────────────
describe('parseErrors', () => {
  it('returns empty object when all fields are valid', () => {
    const errors = parseErrors(signupSchema, validSignup)
    // toEqual → comparing objects
    expect(errors).toEqual({})
  })

  it('returns an object — not null, not undefined', () => {
    const errors = parseErrors(signupSchema, validSignup)
    // toBeDefined → we just want something back
    expect(errors).toBeDefined()
    // toEqual beats toBeTruthy here — we know the exact shape
  })

  it('only stores the FIRST error per field', () => {
    // name: "" triggers both min(1) and min(2) — we only want the first
    const errors = parseErrors(signupSchema, { ...validSignup, name: "" })
    expect(typeof errors.name).toBe("string")  // toBe on a primitive
    // if there were two errors, name would be an array — it's not
  })
})

// ─────────────────────────────────────────────
// signupSchema — field by field
// ─────────────────────────────────────────────
describe('signupSchema — name field', () => {
  it('passes with a valid name', () => {
    const errors = parseErrors(signupSchema, validSignup)
    expect(errors.name).toBeUndefined()
    // toBeUndefined → field should not exist in errors at all
  })

  it('fails when name is empty', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, name: "" })
    expect(errors.name).toBe("Full name is required")
  })

  it('fails when name is 1 character', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, name: "Y" })
    expect(errors.name).toBe("Name must be at least 2 characters")
  })

  it('passes with exactly 2 characters', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, name: "Yo" })
    expect(errors.name).toBeUndefined()
  })
})

describe('signupSchema — email field', () => {
  it('passes with a valid email', () => {
    const errors = parseErrors(signupSchema, validSignup)
    expect(errors.email).toBeUndefined()
  })

  it('fails when email is empty', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, email: "" })
    expect(errors.email).toBe("Email is required")
  })

  it('fails with invalid email format', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, email: "notanemail" })
    expect(errors.email).toBe("Enter a valid email address")
  })

  it('fails with missing domain', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, email: "yash@" })
    expect(errors.email).toBe("Enter a valid email address")
  })
})

describe('signupSchema — password field', () => {
  it('passes with a strong password', () => {
    const errors = parseErrors(signupSchema, validSignup)
    expect(errors.password).toBeUndefined()
  })

  it('fails when password is empty', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, password: "" })
    expect(errors.password).toBe("Password is required")
  })

  it('fails when password is under 8 characters', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, password: "Pass1" })
    expect(errors.password).toBe("Password must be at least 8 characters")
  })

  it('fails with no uppercase letter', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, password: "password1" })
    expect(errors.password).toBe("Include at least one uppercase letter")
  })

  it('fails with no number', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, password: "Password" })
    expect(errors.password).toBe("Include at least one number")
  })
})

describe('signupSchema — confirm field', () => {
  it('passes when passwords match', () => {
    const errors = parseErrors(signupSchema, validSignup)
    expect(errors.confirm).toBeUndefined()
  })

  it('fails when confirm is empty', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, confirm: "" })
    expect(errors.confirm).toBe("Please confirm your password")
  })

  it('fails when passwords do not match', () => {
    const errors = parseErrors(signupSchema, { ...validSignup, confirm: "WrongPassword1" })
    expect(errors.confirm).toBe("Passwords do not match")
    // this tests the .refine() cross-field validation
  })
})

// ─────────────────────────────────────────────
// loginSchema
// ─────────────────────────────────────────────
describe('loginSchema', () => {
  it('passes with valid credentials', () => {
    const errors = parseErrors(loginSchema, validLogin)
    expect(errors).toEqual({})
  })

  it('fails when email is empty', () => {
    const errors = parseErrors(loginSchema, { ...validLogin, email: "" })
    expect(errors.email).toBe("Email is required")
  })

  it('fails when password is too short', () => {
    const errors = parseErrors(loginSchema, { ...validLogin, password: "abc" })
    expect(errors.password).toBe("Password must be at least 8 characters")
  })

  it('fails when both fields are empty', () => {
    const errors = parseErrors(loginSchema, { email: "", password: "" })
    // toEqual → exact object shape
    expect(errors).toEqual({
      email: "Email is required",
      password: "Password is required",
    })
  })
})