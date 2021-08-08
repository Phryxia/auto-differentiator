import { Expression, Binary, isBinary } from './model'
import Constant from './nodes/constant'
import Log from './nodes/log'
import Variable from './nodes/variable'

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
