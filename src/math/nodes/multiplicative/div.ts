import { Binary, Expression, OptimizerOption, Variables } from '../../model'
import { isConstantMinusOne, isConstantOne, isConstantZero } from '../../util'
import { Sub } from '../additive'
import Constant, { CONSTANT_MINUS_ONE, CONSTANT_ZERO } from '../constant'
import Power from '../power'
import { isEquivalentMulDiv, optimizeMulDiv } from './common'
import Mul from './mul'

export default class Div extends Expression implements Binary {
  constructor(
    public readonly expr0: Expression,
    public readonly expr1: Expression
  ) {
    super()
  }

  evaluate(variables: Variables): number {
    return this.expr0.evaluate(variables) / this.expr1.evaluate(variables)
  }

  differentiate(variableName: string): Expression {
    return new Div(
      new Sub(
        new Mul(this.expr0.differentiate(variableName), this.expr1),
        new Mul(this.expr0, this.expr1.differentiate(variableName))
      ),
      new Power(this.expr1, new Constant(2))
    )
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const expr0 = this.expr0.optimize(option)
    const expr1 = this.expr1.optimize(option)

    if (expr0 instanceof Constant && expr1 instanceof Constant)
      return new Constant(expr0.value / expr1.value)

    if (isConstantZero(expr0)) return CONSTANT_ZERO
    if (isConstantZero(expr1)) return new Constant(NaN)

    if (isConstantOne(expr1)) return expr0

    if (isConstantMinusOne(expr1)) return new Mul(CONSTANT_MINUS_ONE, expr0)

    return optimizeMulDiv(new Div(expr0, expr1))
  }

  isEquivalent(expression: Expression): boolean {
    return isEquivalentMulDiv(this, expression)
  }
}
