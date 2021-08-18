import {
  Sin,
  Cos,
  Tan,
  Csc,
  Sec,
  Cot,
  Variable,
  Mul,
  Constant,
  Power,
} from '../../nodes'
import { testNumericalSimilarity } from '../common'

const sin = new Sin(new Variable('x'))
const cos = new Cos(new Variable('x'))
const tan = new Tan(new Variable('x'))
const csc = new Csc(new Variable('x'))
const sec = new Sec(new Variable('x'))
const cot = new Cot(new Variable('x'))

describe('nodes.sin', () => {
  test('evaluate', () => {
    expect(sin.evaluate({ x: 1 })).toBe(Math.sin(1))
    expect(sin.evaluate({ x: Math.PI })).toBeCloseTo(0)
  })

  test('differentiate', () => {
    testNumericalSimilarity(sin.differentiate('x'), cos, -1, 1, 0.01)
  })
})

describe('nodes.cos', () => {
  test('evaluate', () => {
    expect(cos.evaluate({ x: 1 })).toBe(Math.cos(1))
    expect(cos.evaluate({ x: Math.PI })).toBeCloseTo(-1)
  })

  test('differentiate', () => {
    const expected = new Mul(sin, Constant.MINUS_ONE)
    testNumericalSimilarity(cos.differentiate('x'), expected, -1, 1, 0.01)
  })
})

describe('nodes.tan', () => {
  test('evaluate', () => {
    expect(tan.evaluate({ x: 1 })).toBe(Math.tan(1))
    expect(tan.evaluate({ x: Math.PI })).toBeCloseTo(0)
  })

  test('differentiate', () => {
    const expected = new Power(sec, new Constant(2))
    testNumericalSimilarity(tan.differentiate('x'), expected, -1, 1, 0.01)
  })
})

describe('nodes.csc', () => {
  test('evaluate', () => {
    expect(csc.evaluate({ x: 1 })).toBe(1 / Math.sin(1))
    expect(csc.evaluate({ x: Math.PI / 2 })).toBeCloseTo(1)
  })

  test('differentiate', () => {
    const expected = new Mul(Constant.MINUS_ONE, new Mul(cot, csc))
    testNumericalSimilarity(csc.differentiate('x'), expected, 0.5, 2.5, 0.01)
  })
})

describe('nodes.sec', () => {
  test('evaluate', () => {
    expect(sec.evaluate({ x: 1 })).toBe(1 / Math.cos(1))
    expect(sec.evaluate({ x: Math.PI })).toBeCloseTo(-1)
  })

  test('differentiate', () => {
    const expected = new Mul(tan, sec)
    testNumericalSimilarity(sec.differentiate('x'), expected, -1, 1, 0.01)
  })
})

describe('nodes.cot', () => {
  test('evaluate', () => {
    expect(cot.evaluate({ x: 1 })).toBeCloseTo(1 / Math.tan(1))
  })

  test('differentiate', () => {
    const expected = new Mul(
      Constant.MINUS_ONE,
      new Power(csc, new Constant(2))
    )
    testNumericalSimilarity(cot.differentiate('x'), expected, 0.5, 2.5, 0.01)
  })
})
