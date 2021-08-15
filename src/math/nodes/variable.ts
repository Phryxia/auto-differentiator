import { Expression, OptimizerOption, Variables } from '../model'
import { CONSTANT_ONE, CONSTANT_ZERO } from './constant'

export default class Variable extends Expression {
  constructor(public readonly name: string) {
    super()
  }

  evaluate(variables: Variables) {
    return variables[this.name]
  }

  differentiate(variableName: string) {
    if (this.name === variableName) return CONSTANT_ONE
    else return CONSTANT_ZERO
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    return this
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Variable && this.name === expression.name
  }

  isOptimized(): boolean {
    return true
  }
}
