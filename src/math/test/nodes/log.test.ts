import { Constant, Log, Variable } from '../../nodes'

describe('nodes.log', () => {
  test('evaluate', () => {
    const log = new Log(new Variable('x'), new Constant(4))
    expect(log.evaluate({ x: 1 })).toBe(0)
    expect(log.evaluate({ x: 2 })).toBe(0.5)
    expect(log.evaluate({ x: 4 })).toBe(1)
  })
})
