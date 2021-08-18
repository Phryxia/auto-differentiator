import { Sinh, Cosh, Tanh, Csch, Sech, Coth, Variable } from '../../nodes'

describe('nodes.sinh', () => {
  test('evaluate', () => {
    const sinh = new Sinh(new Variable('x'))
    expect(sinh.evaluate({ x: 1 })).toBeCloseTo(Math.sinh(1))
  })
})

describe('nodes.cosh', () => {
  test('evaluate', () => {
    const cosh = new Cosh(new Variable('x'))
    expect(cosh.evaluate({ x: 1 })).toBeCloseTo(Math.cosh(1))
  })
})

describe('nodes.tanh', () => {
  test('evaluate', () => {
    const tanh = new Tanh(new Variable('x'))
    expect(tanh.evaluate({ x: 1 })).toBeCloseTo(Math.tanh(1))
  })
})

describe('nodes.csch', () => {
  test('evaluate', () => {
    const csch = new Csch(new Variable('x'))
    expect(csch.evaluate({ x: 1 })).toBeCloseTo(1 / Math.sinh(1))
  })
})

describe('nodes.sech', () => {
  test('evaluate', () => {
    const sech = new Sech(new Variable('x'))
    expect(sech.evaluate({ x: 1 })).toBeCloseTo(1 / Math.cosh(1))
  })
})

describe('nodes.coth', () => {
  test('evaluate', () => {
    const coth = new Coth(new Variable('x'))
    expect(coth.evaluate({ x: 1 })).toBeCloseTo(1 / Math.tanh(1))
  })
})
