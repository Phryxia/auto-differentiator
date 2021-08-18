import { ConstantPool, Expression, OptimizerOption, Variables } from '../model'
import Constant from './constant'
import { Mul } from './multiplicative'
import Power from './power'

export class Sin extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return Math.sin(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      this.expr.differentiate(variableName, constantPool),
      new Cos(this.expr)
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant) return constantPool.get(Math.sin(expr.value))

    return new Sin(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sin && this.expr.isEquivalent(expression.expr)
  }
}

export class Cos extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return Math.cos(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      Constant.MINUS_ONE,
      new Mul(
        this.expr.differentiate(variableName, constantPool),
        new Sin(this.expr)
      )
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant) return constantPool.get(Math.cos(expr.value))

    return new Cos(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Cos && this.expr.isEquivalent(expression.expr)
  }
}

export class Tan extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return Math.tan(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      this.expr.differentiate(variableName, constantPool),
      new Power(new Sec(this.expr), constantPool.get(2))
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant) return constantPool.get(Math.tan(expr.value))

    return new Tan(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Tan && this.expr.isEquivalent(expression.expr)
  }
}

export class Csc extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return 1 / Math.sin(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      Constant.MINUS_ONE,
      new Mul(
        this.expr.differentiate(variableName, constantPool),
        new Mul(this, new Cot(this.expr))
      )
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant) return new Constant(1 / Math.sin(expr.value))

    return new Csc(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Csc && this.expr.isEquivalent(expression.expr)
  }
}

export class Sec extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return 1 / Math.cos(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      this.expr.differentiate(variableName, constantPool),
      new Mul(this, new Tan(this.expr))
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant)
      return constantPool.get(1 / Math.cos(expr.value))

    return new Sec(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sec && this.expr.isEquivalent(expression.expr)
  }
}

export class Cot extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return 1 / Math.tan(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      Constant.MINUS_ONE,
      new Mul(
        this.expr.differentiate(variableName, constantPool),
        new Power(new Csc(this.expr), constantPool.get(2))
      )
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant)
      return constantPool.get(1 / Math.tan(expr.value))

    return new Cot(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Cot && this.expr.isEquivalent(expression.expr)
  }
}
