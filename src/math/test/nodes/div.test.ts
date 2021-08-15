import { Constant, Div } from '../../nodes'

describe('nodes.Div', () => {
  const a = new Constant(16)
  const b = new Constant(4)
  const sum = new Div(a, b)

  test('evaluate', () => {
    expect(sum.evaluate({})).toBe(4)
  })
})
