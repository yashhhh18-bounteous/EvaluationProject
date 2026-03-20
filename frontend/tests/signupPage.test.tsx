import { render, screen } from "@testing-library/react"
import SignupPage from "@/app/signup/page" // adjust path to yours

// ── MOCKS ──────────────────────────────────────────────────────
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))

jest.mock("@/app/features/auth/auth.mutations", () => ({
  useRegister: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}))

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

// ── TESTS ──────────────────────────────────────────────────────
describe('SignupPage — rendering', () => {

  beforeEach(() => {
    render(<SignupPage />)
  })

  // ── BRANDING ────────────────────────────────────────────────
  it('renders the YashCart brand name', () => {
    // getAllByText because it appears twice (desktop + mobile)
    const logos = screen.getAllByText(/yashcart/i)
    expect(logos.length).toBeGreaterThanOrEqual(1)
    // toBeGreaterThan → number matcher, we don't care about exact count
  })

  // ── HEADINGS ────────────────────────────────────────────────
  it('renders the Create Account heading', () => {
    // getByRole → best practice, targets semantic heading element
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    // toBeInTheDocument → comes from @testing-library/jest-dom
  })

  it('renders the Get started label', () => {
    // getByText with regex → case insensitive, partial match
    expect(screen.getByText(/get started/i)).toBeInTheDocument()
  })

  // ── FORM FIELDS ─────────────────────────────────────────────
  it('renders the Full Name input', () => {
    // getByPlaceholderText → good for inputs
    expect(screen.getByPlaceholderText('Yash Jha')).toBeInTheDocument()
  })

  it('renders the Email input', () => {
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
  })

  it('renders two password inputs', () => {
    // getAllByPlaceholderText → multiple matching elements
    const passwordInputs = screen.getAllByPlaceholderText('••••••••')
    expect(passwordInputs).toHaveLength(2)
    // toHaveLength → array matcher
  })

  // ── LABELS ──────────────────────────────────────────────────
  it('renders all four field labels', () => {
    expect(screen.getByText(/full name/i)).toBeInTheDocument()
    expect(screen.getByText(/email address/i)).toBeInTheDocument()
    expect(screen.getByText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByText(/confirm password/i)).toBeInTheDocument()
    // ^ and $ in regex = exact match, prevents "Confirm Password" matching "Password"
  })

  // ── SUBMIT BUTTON ────────────────────────────────────────────
  it('renders the submit button with correct text', () => {
    // getByRole('button') → semantic, best practice
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('submit button is enabled by default', () => {
    const button = screen.getByRole('button', { name: /create account/i })
    // toBeEnabled → jest-dom matcher for form elements
    expect(button).toBeEnabled()
  })

  // ── LINKS ───────────────────────────────────────────────────
  it('renders sign in link', () => {
    // getByRole('link') → targets <a> tags
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders terms and privacy links', () => {
    expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument()
  })

  // ── ABSENCE ─────────────────────────────────────────────────
  it('does not show any error messages on initial render', () => {
    // queryByText → use when asserting absence, returns null instead of throwing
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/must be at least/i)).not.toBeInTheDocument()
  })

  it('does not show password strength indicator initially', () => {
    // nothing typed yet, strength bar should be absent
    expect(screen.queryByText(/weak|fair|good|strong/i)).not.toBeInTheDocument()
  })

})