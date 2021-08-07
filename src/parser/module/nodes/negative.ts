import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant from './constant'

export default class Negative implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return -this.expr.evaluate(variables)
  }

  differentiate(variableName: string): Expression {
    return new Negative(this.expr.differentiate(variableName))
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(-expr.value)

    if (expr instanceof Negative) return expr

    return new Negative(expr)
  }
}
