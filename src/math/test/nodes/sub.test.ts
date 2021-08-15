import { Constant, Sub } from '../../nodes'

describe('nodes.Sub', () => {
  const a = new Constant(3)
  const b = new Constant(8)
  const sum = new Sub(a, b)

  test('evaluate', () => {
    expect(sum.evaluate({})).toBe(-5)
  })
})
