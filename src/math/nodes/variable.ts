import { ConstantPool, Expression, OptimizerOption, Variables } from '../model'
import Constant from './constant'

export default class Variable extends Expression {
  constructor(public readonly name: string) {
    super()
    this.assignVariable(name)
  }

  evaluate(variables: Variables): number {
    if (variables[this.name] === undefined)
      throw new Error(
        `[Variable.evalute] ${this.name} is not defined in the given parameter`
      )
    return variables[this.name]
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    if (this.name === variableName) return Constant.ONE
    else return Constant.ZERO
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    return this
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Variable && this.name === expression.name
  }

  isOptimized(): boolean {
    return true
  }
}
