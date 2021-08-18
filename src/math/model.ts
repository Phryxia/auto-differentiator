import { Pool } from '../common'
import { Constant } from './nodes'

export interface Variables {
  [name: string]: number
}

export class ConstantPool extends Pool<Constant, number> {
  constructor() {
    super(Constant)
  }

  get(value: number): Constant {
    if (value === 0) return Constant.ZERO
    if (value === 1) return Constant.ONE
    if (value === -1) return Constant.MINUS_ONE
    return super.get(value)
  }
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
  //
  // Note that even inside differentiateConcrete, you must call its child using
  // differentiate, not differentiateConcrete.
  //
  // Also you must pass variableName and constantPool to its child.
  // You should create constant using constantPool.get(number). Using new Constant
  // directly is not recommended since it'll takes your memory more.
  protected abstract differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression

  // Must return optimized expression based on principled (See principles.md)
  // You don't have to worry about optimizing an expression which is already done
  // since this class prevents duplicated optimizing. (See function optimize)
  //
  // Note that even inside optimizedConcrete, you must call its child using
  // optimize, not optimizeConcrete.
  //
  // Also you must pass option and constantPool to its child.
  // You should create constant using constantPool.get(number). Using new Constant
  // directly is not recommended since it'll takes your memory more.
  protected abstract optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression

  // Must return true if given expression is mathematically equivalent to this
  public abstract isEquivalent(expression: Expression): boolean

  // Return differentiated expression using given variable name.
  public differentiate(
    variableName: string,
    constantPool: ConstantPool = new ConstantPool()
  ): Expression {
    return this.differentiateConcrete(variableName, constantPool)
  }

  // Return optimized expression. If this expression is already optimized,
  // just return itself.
  public optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION,
    constantPool: ConstantPool = new ConstantPool()
  ): Expression {
    if (this.isOptimized()) return this

    const result = this.optimizeConcrete(
      {
        ...DEFAULT_OPTIMIZER_OPTION,
        ...option,
      },
      constantPool
    )
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

export interface Bucket<T> {
  [nodeType: string]: T[]
}
