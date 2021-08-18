import { Constant, Sub } from '../../nodes'
import Parser from '../../parser'
import { isSameTree } from '../common'

const parser = new Parser()

describe('nodes.Sub', () => {
  const a = new Constant(3)
  const b = new Constant(8)
  const sum = new Sub(a, b)

  test('evaluate', () => {
    expect(sum.evaluate({})).toBe(-5)
  })

  test('differentiate', () => {
    const { expression: expr0 } = parser.parse('sinh(x)')
    const { expression: expr1 } = parser.parse('sin(x)')
    const expr = new Sub(expr0!, expr1!)

    expect(
      isSameTree(
        expr.differentiate('x'),
        new Sub(expr0!.differentiate('x'), expr1!.differentiate('x'))
      )
    ).toBeTruthy()
  })
})
