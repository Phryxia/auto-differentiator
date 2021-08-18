import { Add, Constant, Log, Variable } from '../nodes'
import { isSameStructure, isSameTree } from './common'

describe('common', () => {
  test('isSameStructure', () => {
    const expr = new Add(
      new Variable('x'),
      new Log(new Constant(5), new Variable('z'))
    )
    expect(
      isSameStructure(expr, {
        className: 'Add',
        expr0: {
          className: 'Variable',
          name: 'x',
        },
        expr1: {
          className: 'Log',
          expr: {
            className: 'Constant',
            value: 5,
          },
          base: {
            className: 'Variable',
            name: 'z',
          },
        },
      })
    ).toBeTruthy()
  })

  test('isSameTree', () => {
    const expr0 = new Add(new Variable('x'), new Constant(283))
    const expr1 = new Add(new Variable('x'), new Constant(283))
    expect(isSameTree(expr0, expr1)).toBeTruthy()
  })
})
