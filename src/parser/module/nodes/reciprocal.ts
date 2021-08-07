import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant from './constant'
import Div from './div'

export default class Reciprocal implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return 1 / this.expr.evaluate(variables)
  }

  differentiate(variableName: string): Expression {
    return new Div(this.expr.differentiate(variableName), this.expr)
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(expr.value)

    if (expr instanceof Reciprocal) return expr.expr

    return new Reciprocal(expr)
  }
}
