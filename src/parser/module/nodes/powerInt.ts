import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant from './constant'
import Mul from './mul'
import Power from './power'

export default class PowerInt implements Expression {
  constructor(public expr: Expression, public readonly exponent: number) {
    if (exponent === 0)
      throw new Error(
        '[PowerInt] 0 exponent is meaningless. Use Constant instead.'
      )
    if (!Number.isInteger(exponent))
      throw new Error(`[PowerInt] ${exponent} is not integer.`)
  }

  evaluate(variables: Variables): number {
    return Math.pow(this.expr.evaluate(variables), this.exponent)
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      new Constant(this.exponent),
      new Mul(
        this.expr.differentiate(variableName),
        new PowerInt(this.expr, this.exponent - 1)
      )
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant)
      return new Constant(Math.pow(expr.value, this.exponent))

    // 지수 법칙
    if (expr instanceof Power)
      return new Power(
        expr.base,
        new Mul(expr.exponent, new Constant(this.exponent)).optimize()
      )

    return new PowerInt(expr, this.exponent)
  }
}
