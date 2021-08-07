import Add from './add'
import Div from './div'
import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Ln from './ln'
import Mul from './mul'
import Constant from './constant'
import { CONSTANT_ONE, isConstantOne, isConstantZero } from '../util'
import PowerInt from './powerInt'
import NamedConstant from './namedConstant'

export default class Power implements Expression {
  constructor(public base: Expression, public exponent: Expression) {}

  evaluate(variables: Variables): number {
    return Math.pow(
      this.base.evaluate(variables),
      this.exponent.evaluate(variables)
    )
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      this,
      new Add(
        new Mul(this.exponent.differentiate(variableName), new Ln(this.base)),
        new Mul(
          this.exponent,
          new Div(this.base.differentiate(variableName), this.base)
        )
      )
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const base = this.base.optimize(option)
    const exponent = this.exponent.optimize(option)

    if (base instanceof Constant && exponent instanceof Constant)
      return new Constant(Math.pow(base.value, exponent.value))

    if (isConstantZero(exponent)) return CONSTANT_ONE
    if (isConstantOne(exponent)) return base

    if (
      base instanceof NamedConstant &&
      base.name === 'e' &&
      exponent instanceof Ln
    )
      return exponent.expr

    // 지수법칙
    if (base instanceof Power)
      return new Power(base.base, new Mul(base.exponent, exponent)).optimize(
        option
      )

    if (base instanceof PowerInt)
      return new Power(
        base.expr,
        new Mul(new Constant(base.exponent), exponent)
      ).optimize(option)

    return new Power(base, exponent)
  }
}
