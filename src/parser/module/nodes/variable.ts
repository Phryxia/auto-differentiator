import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import { CONSTANT_ONE, CONSTANT_ZERO } from '../util'

export default class Variable implements Expression {
  constructor(public readonly name: string) {}

  evaluate(variables: Variables) {
    return variables[this.name]
  }

  differentiate(variableName: string) {
    if (this.name === variableName) return CONSTANT_ONE
    else return CONSTANT_ZERO
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }
    return this
  }
}
