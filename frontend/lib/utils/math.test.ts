import { add, subtract, multiply, divide } from '@/lib/utils/math'

describe('Equality', () => {
  it('toBe — strict equality, use for primitives (numbers, strings, booleans)', () => {
    expect(add(2, 3)).toBe(5)         // ✅ numbers
    expect(add(0, 0)).toBe(0)
  })

  it('toEqual — deep equality, use for objects/arrays', () => {
    expect({ a: 1 }).toEqual({ a: 1 }) // ✅ objects
    expect([1, 2, 3]).toEqual([1, 2, 3]) // ✅ arrays
    // toBe would FAIL here because objects are different references in memory
  })

  it('toStrictEqual — like toEqual but also checks undefined properties', () => {
    expect({ a: 1, b: undefined }).toStrictEqual({ a: 1 }) // ❌ FAILS
    expect({ a: 1 }).toStrictEqual({ a: 1 })               // ✅ passes
  })
})











describe('Truthiness', () => {
  it('toBeTruthy — anything JS considers true', () => {
    expect(1).toBeTruthy()
    expect('hello').toBeTruthy()
    expect([]).toBeTruthy()   // empty array is still truthy!
  })

  it('toBeFalsy — anything JS considers false', () => {
    expect(0).toBeFalsy()
    expect('').toBeFalsy()
    expect(null).toBeFalsy()
    expect(undefined).toBeFalsy()
  })

  it('toBeNull — specifically null, nothing else', () => {
    expect(null).toBeNull()
    expect(undefined).not.toBeNull() // undefined is NOT null
  })

  it('toBeUndefined / toBeDefined', () => {
    let x
    expect(x).toBeUndefined()
    expect(add(1, 1)).toBeDefined()
  })
})
















describe('Numbers', () => {
  it('toBeGreaterThan / toBeLessThan', () => {
    expect(multiply(3, 4)).toBeGreaterThan(10)
    expect(subtract(2, 5)).toBeLessThan(0)
    expect(multiply(2, 5)).toBeGreaterThanOrEqual(10)
  })

  it('toBeCloseTo — use for floating point, never toBe', () => {
    // toBe would FAIL: 0.1 + 0.2 = 0.30000000000000004 in JS
    expect(0.1 + 0.2).not.toBe(0.3)       // ❌ this is true, floating point is weird
    expect(0.1 + 0.2).toBeCloseTo(0.3)    // ✅ use this for decimals
  })
})








describe('Errors', () => {
  it('toThrow — must wrap in arrow function!', () => {
    expect(() => divide(10, 0)).toThrow()
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero') // check message
    expect(() => divide(10, 0)).toThrow(Error) // check error type
  })

  // ❌ COMMON MISTAKE — this won't work:
  // expect(divide(10, 0)).toThrow()  ← Jest can't catch it this way
})















describe('Strings', () => {
  it('toContain — substring match', () => {
    expect('hello world').toContain('world')
  })

  it('toMatch — regex match', () => {
    expect('hello world').toMatch(/^hello/)
    expect('test@email.com').toMatch(/\S+@\S+\.\S+/)
  })
})
















describe('Arrays', () => {
  it('toContain — checks a value exists in array', () => {
    expect([1, 2, 3]).toContain(2)
  })

  it('toHaveLength', () => {
    expect([1, 2, 3]).toHaveLength(3)
    expect('hello').toHaveLength(5) // works on strings too
  })

  it('toContainEqual — use for array of objects', () => {
    const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
    expect(users).toContainEqual({ id: 1, name: 'Alice' }) // ✅
    // toContain would FAIL here because objects are compared by reference
  })
})