import Parser from '../parser'
import { renderToText } from '../render'

const parser = new Parser()

describe('e0: Nested exponent should be transformed into multiplication', () => {
  test('(e ^ 2) ^ x', () => {
    const { expression } = parser.parse('(e ^ 2) ^ x')
    expect(renderToText(expression!.optimize()).replaceAll(' ', '')).toBe(
      'e^(2*x)'
    )
  })

  test('(e ^ x) ^ x', () => {
    const { expression } = parser.parse('(e ^ x) ^ x')
    expect(renderToText(expression!.optimize()).replaceAll(' ', '')).toBe(
      'e^x^2'
    )
  })
})

describe('e1: If base is not constant and exponent is not constant, always put base into exponent using log.', () => {
  test('x ^ x', () => {
    const { expression } = parser.parse('x ^ x')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('e^(ln(x)*x)')
  })

  test('x ^ 2', () => {
    const { expression } = parser.parse('x ^ 2')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).not.toBe('e^(2*ln(x))')
  })
})

describe('e2: If base is not constant and exponent is integer constant, spread using binomial theorem.', () => {
  test('(x + y)^2', () => {
    const { expression } = parser.parse('(x + y)^2')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('2*x*y+x^2+y^2')
  })

  test('(x + y)^3', () => {
    const { expression } = parser.parse('(x + y)^3')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('3*x*y^2+3*x^2*y+x^3+y^3')
  })

  test('(x - 1)^2', () => {
    const { expression } = parser.parse('(x + 1)^2')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('(-2)*x+1+x^2')
  })
})

describe('e3: If base is constant and exponent is additive and there is constant term, split constant.', () => {
  test('2 ^ (x - 1)', () => {
    const { expression } = parser.parse('2 ^ (x - 1)')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('0.5*2^x')
  })
})

describe('e4: If base is constant and exponent is pure log, pull down the content into base.', () => {
  test('2 ^ ln(x + 1)', () => {
    const { expression } = parser.parse('2 ^ ln(x + 1)')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('(1+x)^0.6931471805599453')
  })

  test('2 ^ (2 * ln(x + 1))', () => {
    const { expression } = parser.parse('2 ^ (2 * ln(x + 1))')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('(1+x)^0.6931471805599453')
  })

  test('e ^ ln(x)', () => {
    const { expression } = parser.parse('e ^ ln(x)')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('x')
  })

  test('(e ^ 2) ^ ln(x)', () => {
    const { expression } = parser.parse('(e ^ 2) ^ ln(x)')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('x^2')
  })
})

describe('m0: Remove / operator', () => {
  test('x / y', () => {
    const { expression } = parser.parse('x / y')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('x*y^(-1)')
  })
})

describe('m1: Always group exponent of multiplicative using exponential property', () => {
  test('x * x^a * x^b', () => {
    const { expression } = parser.parse('x * x^2 * x^3')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('x^6')
  })
})

describe('m2: Always spread expression using distributive property', () => {
  test('(x + y) * (a + b)', () => {
    const { expression } = parser.parse('(x + y) * (a + b)')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('a*x+a*y+b*x+b*y')
  })

  test('2 * (x + 1)', () => {
    const { expression } = parser.parse('2 * (x + 1)')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('2+2*x')
  })
})

describe('m3: Remove identity', () => {
  test('1 * x', () => {
    const { expression } = parser.parse('1 * x')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('x')
  })
})

describe('a0: Remove - operator', () => {
  test('1 - x - y', () => {
    const { expression } = parser.parse('1 - x - y')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('(-1)*x+(-1)*y+1')
  })
})

describe('a1: Always group coefficient of additive', () => {
  test('2*x*y + 3*x*y', () => {
    const { expression } = parser.parse('2*x*y + 3*x*y')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('5*x*y')
  })
})

describe('a2: Remove identity', () => {
  test('x + 0', () => {
    const { expression } = parser.parse('x + 0')
    const str = renderToText(expression!.optimize()).replaceAll(' ', '')
    expect(str).toBe('x')
  })
})
