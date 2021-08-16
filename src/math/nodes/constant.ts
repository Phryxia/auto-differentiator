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

  public static readonly ZERO = new Constant(0)
  public static readonly ONE = new Constant(1)
  public static readonly MINUS_ONE = new Constant(-1)
}
