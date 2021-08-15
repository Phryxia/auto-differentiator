import { Expression } from '../model'

export function isSameStructure(
  expr: Expression | undefined,
  expectation: any
) {
  if (!expr) return false

  expect(expr.constructor.name).toEqual(expectation.className)

  for (const prop in expectation) {
    if (prop === 'className') continue

    if (prop.includes('expr')) {
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
