import { Expression } from './model'
import Add from './nodes/add'
import Constant from './nodes/constant'
import Div from './nodes/div'
import Log from './nodes/log'
import Mul from './nodes/mul'
import Power from './nodes/power'
import Sub from './nodes/sub'
import Variable from './nodes/variable'

export const CONSTANT_ZERO = new Constant(0)
export const CONSTANT_ONE = new Constant(1)

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

  if (
    expr instanceof Add ||
    expr instanceof Sub ||
    expr instanceof Mul ||
    expr instanceof Div
  )
    return (
      isVariableUsed(expr.expr0, variableName) ||
      isVariableUsed(expr.expr1, variableName)
    )

  if (expr instanceof Log)
    return (
      isVariableUsed(expr.expr, variableName) ||
      isVariableUsed(expr.base, variableName)
    )

  if (expr instanceof Power)
    return (
      isVariableUsed(expr.base, variableName) ||
      isVariableUsed(expr.exponent, variableName)
    )

  return isVariableUsed(anyExpr.expr, variableName)
}
