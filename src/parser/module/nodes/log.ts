import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Sub from './sub'
import Mul from './mul'
import Div from './div'
import Ln from './ln'
import { isConstantOne } from '../util'
import Constant, { CONSTANT_ZERO } from './constant'
import NamedConstant from './namedConstant'
import Power from './power'

export default class Log implements Expression {
  constructor(public expr: Expression, public base: Expression) {}

  evaluate(variables: Variables): number {
    return (
      Math.log(this.expr.evaluate(variables)) /
      Math.log(this.base.evaluate(variables))
    )
  }

  differentiate(variableName: string): Expression {
    const lnBase = new Ln(this.base)
    return new Div(
      new Sub(
        new Mul(
          new Div(this.expr.differentiate(variableName), this.expr),
          lnBase
        ),
        new Mul(new Ln(this.expr), lnBase.differentiate(variableName))
      ),
      new Power(lnBase, new Constant(2))
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const base = this.base.optimize(option)
    const expr = this.expr.optimize(option)

    if (base instanceof Constant && expr instanceof Constant)
      return new Constant(Math.log(expr.value) / Math.log(base.value))

    if (base instanceof NamedConstant && base.name === 'e')
      return new Ln(expr).optimize(option)

    if (isConstantOne(expr)) return CONSTANT_ZERO

    return new Log(base, expr)
  }

  isEquivalent(expression: Expression): boolean {
    return (
      expression instanceof Log &&
      this.base.isEquivalent(expression.base) &&
      this.expr.isEquivalent(expression.expr)
    )
  }
}
