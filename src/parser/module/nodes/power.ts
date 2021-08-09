import Add from './add'
import Div from './div'
import {
  Binary,
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Ln from './ln'
import Mul from './mul'
import Constant, { CONSTANT_ONE } from './constant'
import { isConstantOne, isConstantZero } from '../util'
import NamedConstant from './namedConstant'

export default class Power implements Expression, Binary {
  constructor(public expr0: Expression, public expr1: Expression) {}

  evaluate(variables: Variables): number {
    return Math.pow(
      this.expr0.evaluate(variables),
      this.expr1.evaluate(variables)
    )
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      this,
      new Add(
        new Mul(this.expr1.differentiate(variableName), new Ln(this.expr0)),
        new Mul(
          this.expr1,
          new Div(this.expr0.differentiate(variableName), this.expr0)
        )
      )
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

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
      base instanceof NamedConstant &&
      base.name === 'e' &&
      exponent instanceof Ln
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
