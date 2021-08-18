import { Constant, Variable } from '../../nodes'

describe('nodes.Variable', () => {
  const x = new Variable('x')

  test('evaluate', () => {
    expect(x.evaluate({ x: 283 })).toBe(283)
    expect(() => x.evaluate({ y: 111 })).toThrowError()
  })

  test('optimize', () => {
    expect(x.optimize()).toBe(x)
  })

  test('differentiate', () => {
    expect(x.differentiate('x')).toBe(Constant.ONE)
    expect(x.differentiate('y')).toBe(Constant.ZERO)
  })
})
