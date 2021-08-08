import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'

export default class Constant implements Expression {
  constructor(public readonly value: number) {}

  evaluate(variables: Variables): number {
    return this.value
  }

  differentiate(variableName: string): Expression {
    return new Constant(0)
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    return this
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Constant && this.value === expression.value
  }
}

export const CONSTANT_ZERO = new Constant(0)
export const CONSTANT_ONE = new Constant(1)
export const CONSTANT_MINUS_ONE = new Constant(-1)
