import { ConstantPool, Expression, OptimizerOption, Variables } from '../model'
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

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    if (this.base === NamedConstant.E) {
      return new Div(
        this.expr.differentiate(variableName, constantPool),
        this.expr
      )
    }

    const lnBase = new Log(this.base)
    return new Div(
      new Sub(
        new Mul(
          new Div(
            this.expr.differentiate(variableName, constantPool),
            this.expr
          ),
          lnBase
        ),
        new Mul(
          new Log(this.expr),
          lnBase.differentiate(variableName, constantPool)
        )
      ),
      new Power(lnBase, constantPool.get(2))
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const base = this.base.optimize(option, constantPool)
    const expr = this.expr.optimize(option, constantPool)

    if (base instanceof Constant && expr instanceof Constant)
      return constantPool.get(Math.log(expr.value) / Math.log(base.value))

    if (isConstantOne(expr)) return Constant.ZERO

    return new Log(expr, base)
  }

  isEquivalent(expression: Expression): boolean {
    return (
      expression instanceof Log &&
      this.base.isEquivalent(expression.base) &&
      this.expr.isEquivalent(expression.expr)
    )
  }
}
