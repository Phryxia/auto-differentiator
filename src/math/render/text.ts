import { Expression, isUnary } from '../model'
import {
  Add,
  Sub,
  Mul,
  Div,
  Constant,
  NamedConstant,
  Variable,
  Ln,
  Log,
  Power,
  Sqrt,
  Cosh,
  Coth,
  Csch,
  Sech,
  Sinh,
  Tanh,
  Cos,
  Cot,
  Csc,
  Sec,
  Sin,
  Tan,
} from '../nodes'

function wrapParenthesis(str: string, isWrapped: boolean): string {
  return isWrapped ? `(${str})` : str
}

function wrapIfBinary(expr: Expression): string {
  return wrapParenthesis(
    renderToText(expr),
    !(
      isUnary(expr) ||
      expr instanceof Constant ||
      expr instanceof Variable ||
      expr instanceof NamedConstant
    )
  )
}

export default function renderToText(expr: Expression): string {
  if (expr instanceof Constant) {
    if (expr.value >= 0) return `${expr.value}`
    else return `(${expr.value})`
  }

  if (expr instanceof Variable || expr instanceof NamedConstant)
    return expr.name

  if (expr instanceof Add)
    return `${renderToText(expr.expr0)} + ${renderToText(expr.expr1)}`

  if (expr instanceof Sub)
    return `${renderToText(expr.expr0)} - ${wrapIfBinary(expr.expr1)}`

  if (expr instanceof Mul)
    return `${wrapIfBinary(expr.expr0)} * ${wrapIfBinary(expr.expr1)}`

  if (expr instanceof Div)
    return `${wrapIfBinary(expr.expr0)} / ${wrapIfBinary(expr.expr1)}`

  if (expr instanceof Power)
    return `${wrapIfBinary(expr.expr0)}^${wrapIfBinary(expr.expr1)}`

  if (expr instanceof Ln) return `ln(${renderToText(expr.expr)})`

  if (expr instanceof Log)
    return `log_{${renderToText(expr.base)}}(${renderToText(expr.expr)})`

  if (expr instanceof Sin) return `sin(${renderToText(expr.expr)})`

  if (expr instanceof Cos) return `cos(${renderToText(expr.expr)})`

  if (expr instanceof Tan) return `tan(${renderToText(expr.expr)})`

  if (expr instanceof Csc) return `csc(${renderToText(expr.expr)})`

  if (expr instanceof Sec) return `sec(${renderToText(expr.expr)})`

  if (expr instanceof Cot) return `cot(${renderToText(expr.expr)})`

  if (expr instanceof Sinh) return `sinh(${renderToText(expr.expr)})`

  if (expr instanceof Cosh) return `cosh(${renderToText(expr.expr)})`

  if (expr instanceof Tanh) return `tanh(${renderToText(expr.expr)})`

  if (expr instanceof Csch) return `csch(${renderToText(expr.expr)})`

  if (expr instanceof Sech) return `sech(${renderToText(expr.expr)})`

  if (expr instanceof Coth) return `coth(${renderToText(expr.expr)})`

  if (expr instanceof Sqrt) return `sqrt(${renderToText(expr.expr)})`

  return '?'
}
