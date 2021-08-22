import { Expression } from './model'
import { Add, Div, Log, Mul, Power, Sub, Variable } from './nodes'
import Constant from './nodes/constant'

export function isConstantZero(expr: Expression): boolean {
  return expr instanceof Constant && expr.value === 0
}

export function isConstantOne(expr: Expression): boolean {
  return expr instanceof Constant && expr.value === 1
}

export function isConstantMinusOne(expr: Expression): boolean {
  return expr instanceof Constant && expr.value === -1
}

export function isVariableUsed(
  expr: Expression,
  variableName: string
): boolean {
  if (expr instanceof Variable) return expr.name === variableName

  const anyExpr: any = expr

  if (anyExpr.expr0 && anyExpr.expr1)
    return (
      isVariableUsed(anyExpr.expr0, variableName) ||
      isVariableUsed(anyExpr.expr1, variableName)
    )

  if (expr instanceof Log)
    return (
      isVariableUsed(expr.expr, variableName) ||
      isVariableUsed(expr.base, variableName)
    )

  return isVariableUsed(anyExpr.expr, variableName)
}

export function joinAdd(
  expressions: { expr: Expression; isNegative?: boolean }[]
): Expression {
  if (expressions.length === 0)
    throw new Error('[utils.joinAdd] Array length is zero')

  let lvalue

  if (expressions[0].isNegative) {
    lvalue = new Mul(Constant.MINUS_ONE, expressions[0].expr)
  } else {
    lvalue = expressions[0].expr
  }

  for (let i = 1; i < expressions.length; ++i) {
    if (expressions[i].isNegative) {
      lvalue = new Sub(lvalue, expressions[i].expr)
    } else {
      lvalue = new Add(lvalue, expressions[i].expr)
    }
  }

  return lvalue
}

export function isAdditive(expr: Expression): boolean {
  return expr instanceof Add || expr instanceof Sub
}

export function isMultiplicative(expr: Expression): boolean {
  return expr instanceof Mul || expr instanceof Div
}

export function isBinary(expr: Expression) {
  return isAdditive(expr) || isMultiplicative(expr) || expr instanceof Power
}

// Get every combination of non negative integers having given sum
// ex) getPairs(3, 4) = [[0, 0, 4], [0, 1, 3], [0, 2, 2], ..., [3, 1, 0], [4, 0, 0]]
export function getSumPairs(numOfVariables: number, sum: number): number[][] {
  if (numOfVariables <= 0 || !Number.isInteger(numOfVariables))
    throw new Error('numOfVariables must be positive integer')

  if (sum <= 0 || !Number.isInteger(sum))
    throw new Error('sum must be positive integer')

  const result: number[][] = []
  const stack: number[] = []
  let partialSum = 0

  function _getPairs(depth: number) {
    if (depth >= numOfVariables) {
      result.push([...stack])
      return
    }

    if (depth === numOfVariables - 1) {
      const value = sum - partialSum
      stack.push(value)
      _getPairs(depth + 1)
      stack.pop()
      return
    }

    for (let n = 0; n <= sum - partialSum; ++n) {
      stack.push(n)
      partialSum += n
      _getPairs(depth + 1)
      stack.pop()
      partialSum -= n
    }
  }

  _getPairs(0)

  return result
}

// https://en.wikipedia.org/wiki/Euclidean_algorithm#Procedure
export function gcd(a: number, b: number): number {
  return b > 0 ? gcd(b, a % b) : a
}
