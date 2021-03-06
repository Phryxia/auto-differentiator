import { Constant, NamedConstant } from '../../nodes'

describe('nodes.NamedConstant', () => {
  const tsubasa = new NamedConstant('tsubasa', 283)

  test('evaluate', () => {
    expect(tsubasa.evaluate({})).toBe(283)
  })

  test('optimize', () => {
    expect(tsubasa.optimize()).toBe(tsubasa)
  })

  test('differentiate', () => {
    expect(tsubasa.differentiate('x')).toBe(Constant.ZERO)
  })

  test('isEquivalent', () => {
    expect(tsubasa.isEquivalent(tsubasa)).toBeTruthy()
    expect(tsubasa.isEquivalent(NamedConstant.PI)).toBeFalsy()
    expect(tsubasa.isEquivalent(new NamedConstant('tsubasa', 72))).toBeFalsy()
  })
})
