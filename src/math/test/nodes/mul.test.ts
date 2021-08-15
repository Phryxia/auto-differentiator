import { Constant, Mul } from '../../nodes'

describe('nodes.Mul', () => {
  const a = new Constant(3)
  const b = new Constant(8)
  const sum = new Mul(a, b)

  test('evaluate', () => {
    expect(sum.evaluate({})).toBe(24)
  })
})
