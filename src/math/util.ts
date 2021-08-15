import { Binary, Expression, isBinary } from './model'
import { Add, Log, Mul, Sub, Variable } from './nodes'
import Constant, { CONSTANT_MINUS_ONE } from './nodes/constant'

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
  expr: Expression | Binary,
  variableName: string
): boolean {
  if (expr instanceof Variable) return expr.name === variableName

  const anyExpr: any = expr

  if (isBinary(expr))
    return (
      isVariableUsed(expr.expr0, variableName) ||
      isVariableUsed(expr.expr1, variableName)
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
    lvalue = new Mul(CONSTANT_MINUS_ONE, expressions[0].expr)
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
