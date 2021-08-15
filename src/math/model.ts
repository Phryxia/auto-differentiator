export interface Variables {
  [name: string]: number
}

// export interface Expression {
//   evaluate: (variables: Variables) => number
//   differentiate: (variableName: string) => Expression
//   optimize: (option?: Partial<OptimizerOption>) => Expression
//   isEquivalent: (expression: Expression) => boolean
// }

export abstract class Expression {
  private _isOptimized: boolean = false

  // Must return evaluated number using variables.
  public abstract evaluate(variables: Variables): number

  // Must return differentiated expression. You don't need to optimize the result.
  public abstract differentiate(variableName: string): Expression

  // Must return true if given expression is mathematically equivalent to this
  public abstract isEquivalent(expression: Expression): boolean

  // Must return optimized expression based on principled (See principles.md)
  // You don't have to worry about optimizing an expression which is already done
  // since this class prevents duplicated optimizing. (See function optimize)
  //
  // Note that even inside optimizedConcrete, you must call its child using
  // optimize, not optimizeConcrete.
  protected abstract optimizeConcrete(option: OptimizerOption): Expression

  // Return optimized expression. If this expression is already optimized,
  // just return itself.
  public optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    if (this.isOptimized()) return this

    const result = this.optimizeConcrete({
      ...DEFAULT_OPTIMIZER_OPTION,
      ...option,
    })
    result._isOptimized = true
    return result
  }

  // Return whether this expression is optimized one or not.
  // You can override this to return always true if your component doesn't need any optimization.
  // (for example, see Variable class)
  public isOptimized(): boolean {
    return this._isOptimized
  }
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

export interface Bucket<T> {
  [nodeType: string]: T[]
}
