import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant from './constant'
import Div from './div'
import Mul from './mul'

export default class Sqrt implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.sqrt(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Div(
      this.expr.differentiate(variableName),
      new Mul(new Constant(2), this)
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.sqrt(expr.value))

    return new Sqrt(expr)
  }
}
