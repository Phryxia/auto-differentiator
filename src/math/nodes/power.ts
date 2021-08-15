import { Binary, Expression, OptimizerOption, Variables } from '../model'
import { Add } from './additive'
import { Mul, Div } from './multiplicative'
import Constant, { CONSTANT_ONE } from './constant'
import { isConstantOne, isConstantZero } from '../util'
import NamedConstant from './namedConstant'
import Log from './log'

export default class Power extends Expression implements Binary {
  // expr0: base, expr1: exponent
  constructor(
    public readonly expr0: Expression,
    public readonly expr1: Expression
  ) {
    super()
  }

  evaluate(variables: Variables): number {
    return Math.pow(
      this.expr0.evaluate(variables),
      this.expr1.evaluate(variables)
    )
  }

  differentiate(variableName: string): Expression {
    if (this.expr0 === NamedConstant.E) return this

    return new Mul(
      this,
      new Add(
        new Mul(
          this.expr1.differentiate(variableName),
          new Log(this.expr0, NamedConstant.E)
        ),
        new Mul(
          this.expr1,
          new Div(this.expr0.differentiate(variableName), this.expr0)
        )
      )
    )
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const base = this.expr0.optimize(option)
    const exponent = this.expr1.optimize(option)

    if (base instanceof Constant && exponent instanceof Constant)
      return new Constant(Math.pow(base.value, exponent.value))

    if (isConstantZero(exponent)) return CONSTANT_ONE
    if (isConstantOne(exponent)) return base

    // 역수처리
    if (exponent instanceof Constant && exponent.value < 0) {
      if (exponent.value === -1) {
        return new Div(CONSTANT_ONE, base)
      }
      return new Div(
        CONSTANT_ONE,
        new Power(base, new Constant(-exponent.value))
      )
    }

    // e^ln(x) => x
    if (
      base === NamedConstant.E &&
      exponent instanceof Log &&
      exponent.base === NamedConstant.E
    )
      return exponent.expr

    // 지수법칙
    if (base instanceof Power)
      return new Power(base.expr0, new Mul(base.expr1, exponent)).optimize(
        option
      )

    return new Power(base, exponent)
  }

  isEquivalent(expression: Expression): boolean {
    return (
      expression instanceof Power &&
      this.expr0.isEquivalent(expression.expr0) &&
      this.expr1.isEquivalent(expression.expr1)
    )
  }
}
