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
