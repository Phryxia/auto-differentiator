import {
  Add,
  Constant,
  Cos,
  Cosh,
  Cot,
  Coth,
  Csc,
  Csch,
  Div,
  Log,
  Mul,
  NamedConstant,
  Power,
  Sec,
  Sech,
  Sin,
  Sinh,
  Sub,
  Tan,
  Tanh,
  Variable,
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

  test('x * (x - x)', () => {
    const expr = new Mul(x, new Sub(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x*(x-x)')
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

  test('x / (x - x)', () => {
    const expr = new Div(x, new Sub(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x/(x-x)')
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
  test('x ^ x', () => {
    const expr = new Power(x, x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x^x')
  })

  test('x ^ (x ^ x) ^ x', () => {
    const expr = new Power(x, new Power(new Power(x, x), x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x^(x^x)^x')
  })

  test('x ^ (x + x)', () => {
    const expr = new Power(x, new Add(x, x))
    expect(renderToText(expr).replaceAll(' ', '')).toBe('x^(x+x)')
  })

  test('(x - x) ^ x', () => {
    const expr = new Power(new Sub(x, x), x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('(x-x)^x')
  })
})

describe('renderText:log', () => {
  test('log_{x}(x)', () => {
    const expr = new Log(x, x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('log_{x}(x)')
  })

  test('ln(x)', () => {
    const expr = new Log(x, NamedConstant.E)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('ln(x)')
  })
})

describe('renderText:trigonometry', () => {
  test('sin(x)', () => {
    const expr = new Sin(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('sin(x)')
  })

  test('cos(x)', () => {
    const expr = new Cos(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('cos(x)')
  })

  test('tan(x)', () => {
    const expr = new Tan(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('tan(x)')
  })

  test('csc(x)', () => {
    const expr = new Csc(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('csc(x)')
  })

  test('sec(x)', () => {
    const expr = new Sec(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('sec(x)')
  })

  test('cot(x)', () => {
    const expr = new Cot(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('cot(x)')
  })
})

describe('renderText:hyper trigonometry', () => {
  test('sinh(x)', () => {
    const expr = new Sinh(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('sinh(x)')
  })

  test('cosh(x)', () => {
    const expr = new Cosh(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('cosh(x)')
  })

  test('tanh(x)', () => {
    const expr = new Tanh(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('tanh(x)')
  })

  test('csch(x)', () => {
    const expr = new Csch(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('csch(x)')
  })

  test('sech(x)', () => {
    const expr = new Sech(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('sech(x)')
  })

  test('coth(x)', () => {
    const expr = new Coth(x)
    expect(renderToText(expr).replaceAll(' ', '')).toBe('coth(x)')
  })
})
