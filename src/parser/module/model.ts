export interface Variables {
  [name: string]: number
}

export interface Expression {
  evaluate: (variables: Variables) => number
  differentiate: (variableName: string) => Expression
  optimize: (option?: Partial<OptimizerOption>) => Expression
}

export interface OptimizerOption {
  isConstantPreserved: boolean
}

export const DEFAULT_OPTIMIZER_OPTION: OptimizerOption = {
  isConstantPreserved: false,
}
