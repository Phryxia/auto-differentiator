import {
  ConstantPool,
  Expression,
  OptimizerOption,
  Variables,
} from '../../model'
import { isConstantOne, isConstantZero } from '../../util'
import { Add } from '../additive'
import Constant from '../constant'
import { isEquivalentMulDiv, optimizeMulDiv } from './common'

export default class Mul extends Expression {
  constructor(
    public readonly expr0: Expression,
    public readonly expr1: Expression
  ) {
    super()
    this.addChild(expr0)
    this.addChild(expr1)
  }

  evaluate(variables: Variables): number {
    return this.expr0.evaluate(variables) * this.expr1.evaluate(variables)
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Add(
      new Mul(this.expr0.differentiate(variableName, constantPool), this.expr1),
      new Mul(this.expr0, this.expr1.differentiate(variableName, constantPool))
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr0 = this.expr0.optimize(option, constantPool)
    const expr1 = this.expr1.optimize(option, constantPool)

    if (expr0 instanceof Constant && expr1 instanceof Constant)
      return constantPool.get(expr0.value * expr1.value)

    if (isConstantZero(expr0) || isConstantZero(expr1)) return Constant.ZERO

    if (isConstantOne(expr0)) return expr1
    if (isConstantOne(expr1)) return expr0

    return optimizeMulDiv(new Mul(expr0, expr1))
  }

  isEquivalent(expression: Expression): boolean {
    return isEquivalentMulDiv(this, expression)
  }
}
