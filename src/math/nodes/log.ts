import { Expression, OptimizerOption, Variables } from '../model'
import { isConstantOne } from '../util'
import { Sub } from './additive'
import Constant from './constant'
import { Div, Mul } from './multiplicative'
import NamedConstant from './namedConstant'
import Power from './power'

export default class Log extends Expression {
  constructor(
    public readonly expr: Expression,
    public readonly base: Expression = NamedConstant.E
  ) {
    super()
  }

  evaluate(variables: Variables): number {
    if (this.base === NamedConstant.E)
      return Math.log(this.expr.evaluate(variables))

    return (
      Math.log(this.expr.evaluate(variables)) /
      Math.log(this.base.evaluate(variables))
    )
  }

  differentiate(variableName: string): Expression {
    if (this.base === NamedConstant.E) {
      return new Div(this.expr.differentiate(variableName), this.expr)
    }

    const lnBase = new Log(this.base, NamedConstant.E)
    return new Div(
      new Sub(
        new Mul(
          new Div(this.expr.differentiate(variableName), this.expr),
          lnBase
        ),
        new Mul(
          new Log(this.expr, NamedConstant.E),
          lnBase.differentiate(variableName)
        )
      ),
      new Power(lnBase, new Constant(2))
    )
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const base = this.base.optimize(option)
    const expr = this.expr.optimize(option)

    if (base instanceof Constant && expr instanceof Constant)
      return new Constant(Math.log(expr.value) / Math.log(base.value))

    if (isConstantOne(expr)) return Constant.ZERO

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
