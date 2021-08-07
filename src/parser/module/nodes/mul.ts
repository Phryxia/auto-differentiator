import Add from './add'
import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant from './constant'
import {
  CONSTANT_ZERO,
  isConstantMinusOne,
  isConstantOne,
  isConstantZero,
} from '../util'
import Negative from './negative'
import Reciprocal from './reciprocal'
import Div from './div'

export default class Mul implements Expression {
  constructor(public expr0: Expression, public expr1: Expression) {}

  evaluate(variables: Variables): number {
    return this.expr0.evaluate(variables) * this.expr1.evaluate(variables)
  }

  differentiate(variableName: string): Expression {
    return new Add(
      new Mul(this.expr0.differentiate(variableName), this.expr1),
      new Mul(this.expr0, this.expr1.differentiate(variableName))
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr0 = this.expr0.optimize(option)
    const expr1 = this.expr1.optimize(option)

    if (expr0 instanceof Constant && expr1 instanceof Constant)
      return new Constant(expr0.value * expr1.value)

    if (isConstantZero(expr0) || isConstantZero(expr1)) return CONSTANT_ZERO

    if (isConstantOne(expr0)) return expr1
    if (isConstantOne(expr1)) return expr0

    if (isConstantMinusOne(expr0)) return new Negative(expr1)
    if (isConstantMinusOne(expr1)) return new Negative(expr0)

    if (expr0 instanceof Reciprocal && !(expr1 instanceof Reciprocal))
      return new Div(expr1, expr0.expr).optimize(option)

    if (expr1 instanceof Reciprocal && !(expr0 instanceof Reciprocal))
      return new Div(expr0, expr1.expr).optimize(option)

    return new Mul(expr0, expr1)
  }
}
