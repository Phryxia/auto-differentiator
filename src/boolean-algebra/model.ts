export interface BooleanVariables {
  [name: string]: boolean
}

export interface BooleanExpression {
  evaluate: (variables: BooleanVariables) => boolean
  optimize: (option?: BooleanOptimizerOption) => BooleanExpression
  // isEquivalent: (expression: BooleanExpression) => boolean
}

export interface BooleanOptimizerOption {}
