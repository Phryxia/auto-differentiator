import {
  Add,
  Constant,
  Div,
  Mul,
  Sub,
  Variable,
  NamedConstant,
  Power,
} from '../nodes'
import { renderToText } from '../render'

const c = 4577
const a = new Constant(c)
const x = new Variable('x')
const e = new NamedConstant('e', Math.E)

describe('renderText:simple', () => {
  test('constant', () => {
    expect(renderToText(a)).toBe(`${c}`)
  })

  test('variable', () => {
    expect(renderToText(x)).toBe('x')
  })

  test('named constant', () => {
    expect(renderToText(e)).toBe('e')
  })
})

describe('renderText:additive', () => {
  test('x + x + x', () => {
    const expr = new Add(new Add(x, x), x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x+x+x')
  })

  test('x - (x - x)', () => {
    const expr = new Sub(x, new Sub(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x-(x-x)')
  })

  test('x + x - x - x + x', () => {
    const expr = new Add(new Add(x, new Sub(new Sub(x, x), x)), x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x+x-x-x+x')
  })
})

describe('renderText:multiplicative', () => {
  test('x * x * x', () => {
    const expr = new Mul(new Mul(x, x), x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x*x*x')
  })

  test('x / (x / x)', () => {
    const expr = new Div(x, new Div(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x/(x/x)')
  })

  test('x * x / x / x * x', () => {
    const expr = new Mul(x, new Mul(new Div(new Div(x, x), x), x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x*x/x/x*x')
  })
})

describe('renderText:additive & multiplicative', () => {
  test('(x + x) * x', () => {
    const expr = new Mul(new Add(x, x), x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('(x+x)*x')
  })

  test('x * (x + x)', () => {
    const expr = new Mul(x, new Add(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x*(x+x)')
  })

  test('x + x * x', () => {
    const expr = new Add(x, new Mul(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x+x*x')
  })

  test('x - x * x', () => {
    const expr = new Sub(x, new Mul(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x-x*x')
  })

  test('(x + x) / x', () => {
    const expr = new Div(new Add(x, x), x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('(x+x)/x')
  })

  test('x / (x + x)', () => {
    const expr = new Div(x, new Add(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x/(x+x)')
  })

  test('x + x / x', () => {
    const expr = new Add(x, new Div(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x+x/x')
  })

  test('x - x / x', () => {
    const expr = new Sub(x, new Div(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x-x/x')
  })
})

describe('renderText:exponential', () => {
  test('x ^ (x ^ x) ^ x', () => {
    const expr = new Power(x, new Power(new Power(x, x), x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x^(x^x)^x')
  })

  test('x ^ (x + x)', () => {
    const expr = new Power(x, new Add(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x^(x+x)')
  })

  test('(x + x) ^ x', () => {
    const expr = new Power(new Add(x, x), x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('(x+x)^x')
  })
})

// describe('')
