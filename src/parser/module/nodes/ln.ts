import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant, { CONSTANT_ONE } from './constant'
import Div from './div'
import NamedConstant from './namedConstant'

export default class Ln implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.log(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Div(this.expr.differentiate(variableName), this.expr)
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.log(expr.value))

    if (expr instanceof NamedConstant && expr.name === 'e') return CONSTANT_ONE

    return new Ln(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Ln && this.expr.isEquivalent(expression.expr)
  }
}
