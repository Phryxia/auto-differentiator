import { Expression, OptimizerOption, Variables } from '../model'
import Constant from './constant'

export default class Variable extends Expression {
  constructor(public readonly name: string) {
    super()
  }

  evaluate(variables: Variables) {
    if (variables[this.name] === undefined)
      throw new Error(
        `[Variable.evalute] ${this.name} is not defined in the given parameter`
      )
    return variables[this.name]
  }

  differentiate(variableName: string) {
    if (this.name === variableName) return Constant.ONE
    else return Constant.ZERO
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
