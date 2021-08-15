import { Expression, OptimizerOption, Variables } from '../model'

export default class Constant extends Expression {
  constructor(public readonly value: number) {
    super()
  }

  evaluate(variables: Variables): number {
    return this.value
  }

  differentiate(variableName: string): Expression {
    return new Constant(0)
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    return this
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Constant && this.value === expression.value
  }

  isOptimized(): boolean {
    return true
  }
}

export const CONSTANT_ZERO = new Constant(0)
export const CONSTANT_ONE = new Constant(1)
export const CONSTANT_MINUS_ONE = new Constant(-1)
