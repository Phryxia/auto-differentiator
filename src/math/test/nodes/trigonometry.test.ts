import { Sin, Cos, Tan, Csc, Sec, Cot, Variable } from '../../nodes'

describe('nodes.sin', () => {
  test('evaluate', () => {
    const sin = new Sin(new Variable('x'))
    expect(sin.evaluate({ x: 1 })).toBe(Math.sin(1))
    expect(sin.evaluate({ x: Math.PI })).toBe(0)
  })
})

describe('nodes.cos', () => {
  test('evaluate', () => {
    const cos = new Cos(new Variable('x'))
    expect(cos.evaluate({ x: 1 })).toBe(Math.cos(1))
    expect(cos.evaluate({ x: Math.PI })).toBe(-1)
  })
})

describe('nodes.tan', () => {
  test('evaluate', () => {
    const tan = new Tan(new Variable('x'))
    expect(tan.evaluate({ x: 1 })).toBe(Math.tan(1))
    expect(tan.evaluate({ x: Math.PI })).toBe(0)
  })
})

describe('nodes.csc', () => {
  test('evaluate', () => {
    const csc = new Csc(new Variable('x'))
    expect(csc.evaluate({ x: 1 })).toBe(1 / Math.sin(1))
    expect(csc.evaluate({ x: Math.PI / 2 })).toBe(1)
  })
})

describe('nodes.sec', () => {
  test('evaluate', () => {
    const sec = new Sec(new Variable('x'))
    expect(sec.evaluate({ x: 1 })).toBe(1 / Math.cos(1))
    expect(sec.evaluate({ x: Math.PI })).toBe(-1)
  })
})

describe('nodes.cot', () => {
  test('evaluate', () => {
    const cot = new Cot(new Variable('x'))
    expect(cot.evaluate({ x: 1 })).toBe(1 / Math.tan(1))
  })
})
