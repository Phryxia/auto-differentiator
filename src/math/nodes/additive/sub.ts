import { Binary, Expression, OptimizerOption, Variables } from '../../model'
import { isConstantZero } from '../../util'
import Constant, { CONSTANT_MINUS_ONE } from '../constant'
import { Mul } from '../multiplicative'
import { isEquivalentAddSub, optimizeAddSub } from './common'

export default class Sub extends Expression implements Binary {
  constructor(
    public readonly expr0: Expression,
    public readonly expr1: Expression
  ) {
    super()
  }

  evaluate(variables: Variables): number {
    return this.expr0.evaluate(variables) - this.expr1.evaluate(variables)
  }

  differentiate(variableName: string): Expression {
    return new Sub(
      this.expr0.differentiate(variableName),
      this.expr1.differentiate(variableName)
    )
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const expr0 = this.expr0.optimize(option)
    const expr1 = this.expr1.optimize(option)

    if (expr0 instanceof Constant && expr1 instanceof Constant)
      return new Constant(expr0.value - expr1.value)

    if (isConstantZero(expr0)) return new Mul(CONSTANT_MINUS_ONE, expr1)
    if (isConstantZero(expr1)) return expr0

    return optimizeAddSub(new Sub(expr0, expr1))
  }

  isEquivalent(expression: Expression): boolean {
    return isEquivalentAddSub(this, expression)
  }
}
