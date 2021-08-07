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
}
