import classNames from 'classnames'
import { Expression } from '../model'

// test if given expression have same structure as simplified object
//
// expectation may looks like:
// {
//   className: 'Power',
//   expr0: {
//     className: 'Variable',
//     name: 'x',
//   },
//   expr1: {
//     className: 'Constant',
//     value: 5,
//   },
// }
export function isSameStructure(
  expr: Expression | undefined,
  expectation: any
) {
  if (!expr) return false

  expect(expr.constructor.name).toEqual(expectation.className)

  for (const prop in expectation) {
    if (prop === 'className') continue

    if (prop.includes('expr') || prop === 'base') {
      if (
        !expr.hasOwnProperty(prop) ||
        !isSameStructure((expr as any)[prop], expectation[prop])
      )
        return false
    } else {
      expect((expr as any)[prop]).toEqual(expectation[prop])
    }
  }

  return true
}

// test if they both expression have same tree structure
// Note that this doesn't test mathematical equivalence.
// For example, (x + y) is different to (y + x)
export function isSameTree(expr0?: Expression, expr1?: Expression): boolean {
  if (!expr0) return !expr1
  if (!expr1) return !expr0

  if (expr0.constructor.name !== expr1.constructor.name) return false

  const expr0any = expr0 as any
  const expr1any = expr1 as any

  for (const propName in expr0) {
    if (expr0any[propName] instanceof Expression) {
      if (expr1any[propName] instanceof Expression) {
        expect(isSameTree(expr0any[propName], expr1any[propName])).toBe(true)
      } else {
        return false
      }
    } else {
      expect(expr0any[propName]).toBe(expr1any[propName])
    }
  }

  return true
}

// Since many modules are mutually related, it's hard to test their equivalence using them.
// Add.optimize may call Mul.optimize, and Mul.optimize again may call Add.optimize with its child.
// This makes circular dependency between test codes.
//
// Also examining tree can be exponentially complex:
// For example, differentiation of csc(x) is -cot(x)*csc(x) which can be expressed
// as many form ((-1) * cot(x)) * csc(x) or (-1) * (cot(x) * csc(x)) ...
//
// Therfore for simple cases I use numerical similarity by injecting x value as some range.
// Two expressions must only use the variable x.
//
// Note that this never guarantees strict mathematical equivalence. Only use this to small test.
export function testNumericalSimilarity(
  expr0: Expression,
  expr1: Expression,
  xMin: number,
  xMax: number,
  xRes: number
): void {
  let x = xMin
  while (x <= xMax) {
    expect(expr0.evaluate({ x })).toBeCloseTo(expr1.evaluate({ x }))
    x += xRes
  }
}
