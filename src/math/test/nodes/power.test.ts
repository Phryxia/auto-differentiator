import { Constant, Power } from '../../nodes'

describe('node.Power', () => {
  test('evaluate', () => {
    const power = new Power(new Constant(2), new Constant(4))
    expect(power.evaluate({})).toBe(16)
  })
})
