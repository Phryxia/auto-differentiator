import {
  Sinh,
  Cosh,
  Tanh,
  Csch,
  Sech,
  Coth,
  Variable,
  Sub,
  Constant,
  Power,
  Mul,
} from '../../nodes'
import { testNumericalSimilarity } from '../common'

const sinh = new Sinh(new Variable('x'))
const cosh = new Cosh(new Variable('x'))
const tanh = new Tanh(new Variable('x'))
const csch = new Csch(new Variable('x'))
const sech = new Sech(new Variable('x'))
const coth = new Coth(new Variable('x'))

describe('nodes.sinh', () => {
  test('evaluate', () => {
    expect(sinh.evaluate({ x: 1 })).toBeCloseTo(Math.sinh(1))
  })

  test('differentiate', () => {
    testNumericalSimilarity(sinh.differentiate('x'), cosh, -1, 1, 0.01)
  })
})

describe('nodes.cosh', () => {
  test('evaluate', () => {
    expect(cosh.evaluate({ x: 1 })).toBeCloseTo(Math.cosh(1))
  })

  test('differentiate', () => {
    testNumericalSimilarity(cosh.differentiate('x'), sinh, -1, 1, 0.01)
  })
})

describe('nodes.tanh', () => {
  test('evaluate', () => {
    expect(tanh.evaluate({ x: 1 })).toBeCloseTo(Math.tanh(1))
  })

  test('differentiate', () => {
    const expected = new Sub(Constant.ONE, new Power(tanh, new Constant(2)))
    testNumericalSimilarity(tanh.differentiate('x'), expected, -1, 1, 0.01)
  })
})

describe('nodes.csch', () => {
  test('evaluate', () => {
    expect(csch.evaluate({ x: 1 })).toBeCloseTo(1 / Math.sinh(1))
  })

  test('differentiate', () => {
    const expected = new Mul(Constant.MINUS_ONE, new Mul(csch, coth))
    testNumericalSimilarity(csch.differentiate('x'), expected, 0.1, 2, 0.01)
  })
})

describe('nodes.sech', () => {
  test('evaluate', () => {
    expect(sech.evaluate({ x: 1 })).toBeCloseTo(1 / Math.cosh(1))
  })

  test('differentiate', () => {
    const expected = new Mul(Constant.MINUS_ONE, new Mul(sech, tanh))
    testNumericalSimilarity(sech.differentiate('x'), expected, -1, 1, 0.01)
  })
})

describe('nodes.coth', () => {
  test('evaluate', () => {
    expect(coth.evaluate({ x: 1 })).toBeCloseTo(1 / Math.tanh(1))
  })

  test('differentiate', () => {
    const expected = new Mul(
      Constant.MINUS_ONE,
      new Power(csch, new Constant(2))
    )
    testNumericalSimilarity(coth.differentiate('x'), expected, 0.1, 2, 0.01)
  })
})
