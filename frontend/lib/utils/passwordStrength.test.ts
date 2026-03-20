import { getPasswordStrength } from "@/lib/utils/passwordStrength"

describe('getPasswordStrength', () => {

  // ── NULL CASE ──────────────────────────────────────────────
  it('returns null for empty string', () => {
    expect(getPasswordStrength("")).toBeNull()
    // toBeNull → specifically checking null, not just falsy
  })

  // ── WEAK ───────────────────────────────────────────────────
  it('returns Weak for short simple password (score ≤ 1)', () => {
    const result = getPasswordStrength("abc")
    // toEqual → comparing objects, toBe would fail (different reference)
    expect(result).toEqual({
      label: "Weak",
      color: "bg-red-400",
      width: "w-1/4"
    })
  })

  it('returns Weak for 8+ chars but no other criteria', () => {
    const result = getPasswordStrength("abcdefgh") // only length passes
    expect(result?.label).toBe("Weak")
    // toBe → comparing a string primitive
  })

  // ── FAIR ───────────────────────────────────────────────────
  it('returns Fair for password meeting 2 criteria', () => {
    const result = getPasswordStrength("abcdefgH") // length + uppercase
    expect(result?.label).toBe("Fair")
    expect(result?.width).toBe("w-2/4")
  })

  // ── GOOD ───────────────────────────────────────────────────
  it('returns Good for password meeting 3 criteria', () => {
    const result = getPasswordStrength("abcdefgH1") // length + upper + number
    expect(result?.label).toBe("Good")
    expect(result?.color).toBe("bg-blue-400")
  })

  // ── STRONG ─────────────────────────────────────────────────
  it('returns Strong for password meeting all 4 criteria', () => {
    const result = getPasswordStrength("abcdefgH1!")
    expect(result).toEqual({
      label: "Strong",
      color: "bg-[#059669]",
      width: "w-full"
    })
  })

  // ── EDGE CASES ─────────────────────────────────────────────
  it('score is based on criteria met, not just length', () => {
    // Long but only lowercase — only length criterion passes → Weak
    const result = getPasswordStrength("abcdefghijklmnop")
    expect(result?.label).toBe("Weak")
    // toBeDefined → we just want to confirm it returned something
    expect(result).toBeDefined()
  })

  it('special characters alone do not make it Strong', () => {
    const result = getPasswordStrength("!!!") // only special char passes
    expect(result?.label).toBe("Weak")
    expect(result?.label).not.toBe("Strong")
    // .not → flip any matcher
  })
})


