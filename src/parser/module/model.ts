export interface Variables {
  [name: string]: number
}

export interface Expression {
  evaluate: (variables: Variables) => number
  differentiate: (variableName: string) => Expression
  optimize: (option?: Partial<OptimizerOption>) => Expression
  isEquivalent: (expression: Expression) => boolean
}

export interface OptimizerOption {
  isConstantPreserved: boolean
}

export const DEFAULT_OPTIMIZER_OPTION: OptimizerOption = {
  isConstantPreserved: false,
}

export interface Unary extends Expression {
  expr: Expression
}

export function isUnary(expr: any): expr is Unary {
  return !!expr?.expr
}

export interface Binary extends Expression {
  expr0: Expression
  expr1: Expression
}

export function isBinary(expr: any): expr is Binary {
  return !!expr?.expr0 && !!expr?.expr1
}
