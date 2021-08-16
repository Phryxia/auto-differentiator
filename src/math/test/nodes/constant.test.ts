import { Constant } from '../../nodes'

describe('nodes.Constant', () => {
  const constant = new Constant(4577)

  test('evaluate', () => {
    expect(constant.evaluate({})).toBe(4577)
  })

  test('optimize', () => {
    expect(constant.optimize()).toBe(constant)
  })

  test('differentiate', () => {
    expect(constant.differentiate('x')).toBe(Constant.ZERO)
  })
})
