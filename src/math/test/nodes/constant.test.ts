import { Constant } from '../../nodes'

describe('nodes.Constant', () => {
  const constant = new Constant(4577)

  test('evaluate test', () => {
    expect(constant.evaluate({})).toBe(4577)
  })

  test('differentiation test', () => {
    expect(constant.differentiate('x').evaluate({})).toBe(0)
  })
})
