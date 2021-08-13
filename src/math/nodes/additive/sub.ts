import {
  Binary,
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  NodeType,
  OptimizerOption,
  Variables,
} from '../../model'
import { isConstantZero } from '../../util'
import Constant, { CONSTANT_MINUS_ONE } from '../constant'
import { Mul } from '../multiplicative'
import { optimizeAddSub, isEquivalentAddSub } from './common'

export default class Sub implements Expression, Binary {
  public readonly type: NodeType = '-'

  constructor(public expr0: Expression, public expr1: Expression) {}

  evaluate(variables: Variables): number {
    return this.expr0.evaluate(variables) - this.expr1.evaluate(variables)
  }

  differentiate(variableName: string): Expression {
    return new Sub(
      this.expr0.differentiate(variableName),
      this.expr1.differentiate(variableName)
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

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
