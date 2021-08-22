import {
  ConstantPool,
  Expression,
  OptimizerOption,
  Variables,
} from '../../model'
import { isConstantMinusOne, isConstantOne, isConstantZero } from '../../util'
import { Sub } from '../additive'
import Constant from '../constant'
import Power from '../power'
import { isEquivalentMulDiv, optimizeMulDiv } from './common'
import Mul from './mul'

export default class Div extends Expression {
  constructor(
    public readonly expr0: Expression,
    public readonly expr1: Expression
  ) {
    super()
    this.addChild(expr0)
    this.addChild(expr1)
  }

  evaluate(variables: Variables): number {
    return this.expr0.evaluate(variables) / this.expr1.evaluate(variables)
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Div(
      new Sub(
        new Mul(
          this.expr0.differentiate(variableName, constantPool),
          this.expr1
        ),
        new Mul(
          this.expr0,
          this.expr1.differentiate(variableName, constantPool)
        )
      ),
      new Power(this.expr1, constantPool.get(2))
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr0 = this.expr0.optimize(option, constantPool)
    const expr1 = this.expr1.optimize(option, constantPool)

    if (expr0 instanceof Constant && expr1 instanceof Constant)
      return new Constant(expr0.value / expr1.value)

    if (isConstantZero(expr0)) return Constant.ZERO
    if (isConstantZero(expr1)) return constantPool.get(NaN)

    if (isConstantOne(expr1)) return expr0

    if (isConstantMinusOne(expr1)) return new Mul(Constant.MINUS_ONE, expr0)

    return optimizeMulDiv(new Div(expr0, expr1))
  }

  isEquivalent(expression: Expression): boolean {
    return isEquivalentMulDiv(this, expression)
  }
}
