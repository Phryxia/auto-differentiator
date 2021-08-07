import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant from './constant'
import { isConstantZero } from '../util'

export default class Add implements Expression {
  constructor(public expr0: Expression, public expr1: Expression) {}

  evaluate(variables: Variables): number {
    return this.expr0.evaluate(variables) + this.expr1.evaluate(variables)
  }

  differentiate(variableName: string): Expression {
    return new Add(
      this.expr0.differentiate(variableName),
      this.expr1.differentiate(variableName)
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr0 = this.expr0.optimize(option)
    const expr1 = this.expr1.optimize(option)

    if (expr0 instanceof Constant && expr1 instanceof Constant)
      return new Constant(expr0.value + expr1.value)

    if (isConstantZero(expr0)) return expr1
    if (isConstantZero(expr1)) return expr0

    return new Add(expr0, expr1)
  }
}
