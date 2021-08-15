import { Expression } from '../model'
import {
  Add,
  Constant,
  Cos,
  Cosh,
  Cot,
  Coth,
  Csc,
  Csch,
  Div,
  Log,
  Mul,
  NamedConstant,
  Power,
  Sec,
  Sech,
  Sin,
  Sinh,
  Sub,
  Tan,
  Tanh,
  Variable,
} from '../nodes'
import { isAdditive, isBinary } from '../util'

function wrapParenthesis(str: string, isWrapped: boolean): string {
  return isWrapped ? `(${str})` : str
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
    return `${renderToText(expr.expr0)} - ${wrapParenthesis(
      renderToText(expr.expr1),
      isAdditive(expr.expr1)
    )}`

  if (expr instanceof Mul) {
    return `${wrapParenthesis(
      renderToText(expr.expr0),
      isAdditive(expr.expr0)
    )} * ${wrapParenthesis(renderToText(expr.expr1), isAdditive(expr.expr1))}`
  }

  if (expr instanceof Div) {
    return `${wrapParenthesis(
      renderToText(expr.expr0),
      isAdditive(expr.expr0)
    )} / ${wrapParenthesis(
      renderToText(expr.expr0),
      !(expr.expr1 instanceof Power) && isBinary(expr.expr1)
    )}`
  }

  if (expr instanceof Power)
    return `${wrapParenthesis(
      renderToText(expr.expr0),
      isBinary(expr.expr0)
    )}^${wrapParenthesis(
      renderToText(expr.expr1),
      !(expr.expr1 instanceof Power) && isBinary(expr.expr1)
    )}`

  if (expr instanceof Log) {
    if (expr.base === NamedConstant.E) return `ln(${renderToText(expr.expr)})`
    return `log_{${renderToText(expr.base)}}(${renderToText(expr.expr)})`
  }

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

  return '?'
}
