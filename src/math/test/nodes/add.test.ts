import { Constant, Add } from '../../nodes'

describe('nodes.Add', () => {
  const a = new Constant(3)
  const b = new Constant(8)
  const sum = new Add(a, b)

  test('evaluate', () => {
    expect(sum.evaluate({})).toBe(11)
  })
})
