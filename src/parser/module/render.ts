import { Expression, isUnary } from './model'
import Add from './nodes/add'
import Constant from './nodes/constant'
import Div from './nodes/div'
import { Cosh, Coth, Csch, Sech, Sinh, Tanh } from './nodes/hyperTrigonometric'
import Ln from './nodes/ln'
import Log from './nodes/log'
import Mul from './nodes/mul'
import NamedConstant from './nodes/namedConstant'
import Power from './nodes/power'
import Sqrt from './nodes/sqrt'
import Sub from './nodes/sub'
import { Cos, Cot, Csc, Sec, Sin, Tan } from './nodes/trigonometric'
import Variable from './nodes/variable'

function wrapParenthesis(str: string, isWrapped: boolean): string {
  return isWrapped ? `(${str})` : str
}

function wrapIfBinary(expr: Expression): string {
  return wrapParenthesis(
    render(expr),
    !(
      isUnary(expr) ||
      expr instanceof Constant ||
      expr instanceof Variable ||
      expr instanceof NamedConstant
    )
  )
}

export default function render(expr: Expression): string {
  if (expr instanceof Constant) {
    if (expr.value >= 0) return `${expr.value}`
    else return `(${expr.value})`
  }

  if (expr instanceof Variable || expr instanceof NamedConstant)
    return expr.name

  if (expr instanceof Add)
    return `${render(expr.expr0)} + ${render(expr.expr1)}`

  if (expr instanceof Sub)
    return `${render(expr.expr0)} - ${wrapIfBinary(expr.expr1)}`

  if (expr instanceof Mul)
    return `${wrapIfBinary(expr.expr0)} * ${wrapIfBinary(expr.expr1)}`

  if (expr instanceof Div)
    return `${wrapIfBinary(expr.expr0)} / ${wrapIfBinary(expr.expr1)}`

  if (expr instanceof Power)
    return `${wrapIfBinary(expr.expr0)}^${wrapIfBinary(expr.expr1)}`

  if (expr instanceof Ln) return `ln(${render(expr.expr)})`

  if (expr instanceof Log)
    return `log_{${render(expr.base)}}(${render(expr.expr)})`

  if (expr instanceof Sin) return `sin(${render(expr.expr)})`

  if (expr instanceof Cos) return `cos(${render(expr.expr)})`

  if (expr instanceof Tan) return `tan(${render(expr.expr)})`

  if (expr instanceof Csc) return `csc(${render(expr.expr)})`

  if (expr instanceof Sec) return `sec(${render(expr.expr)})`

  if (expr instanceof Cot) return `cot(${render(expr.expr)})`

  if (expr instanceof Sinh) return `sinh(${render(expr.expr)})`

  if (expr instanceof Cosh) return `cosh(${render(expr.expr)})`

  if (expr instanceof Tanh) return `tanh(${render(expr.expr)})`

  if (expr instanceof Csch) return `csch(${render(expr.expr)})`

  if (expr instanceof Sech) return `sech(${render(expr.expr)})`

  if (expr instanceof Coth) return `coth(${render(expr.expr)})`

  if (expr instanceof Sqrt) return `sqrt(${render(expr.expr)})`

  return '?'
}
