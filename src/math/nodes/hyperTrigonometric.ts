import { ConstantPool, Expression, OptimizerOption, Variables } from '../model'
import Constant from './constant'
import { Mul } from './multiplicative'
import Power from './power'

export class Sinh extends Expression {
  constructor(public readonly expr: Expression) {
    super()
    this.addChild(expr)
  }

  evaluate(variables: Variables): number {
    return Math.sinh(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      this.expr.differentiate(variableName, constantPool),
      new Cosh(this.expr)
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant) return new Constant(Math.sinh(expr.value))

    return new Sinh(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sinh && this.expr.isEquivalent(expression.expr)
  }
}

export class Cosh extends Expression {
  constructor(public readonly expr: Expression) {
    super()
    this.addChild(expr)
  }

  evaluate(variables: Variables): number {
    return Math.cosh(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      this.expr.differentiate(variableName, constantPool),
      new Sinh(this.expr)
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant) return constantPool.get(Math.cosh(expr.value))

    return new Cosh(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Cosh && this.expr.isEquivalent(expression.expr)
  }
}

export class Tanh extends Expression {
  constructor(public readonly expr: Expression) {
    super()
    this.addChild(expr)
  }

  evaluate(variables: Variables): number {
    return Math.tanh(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      this.expr.differentiate(variableName, constantPool),
      new Power(new Sech(this.expr), constantPool.get(2))
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant) return constantPool.get(Math.tanh(expr.value))

    return new Tanh(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Tanh && this.expr.isEquivalent(expression.expr)
  }
}

export class Csch extends Expression {
  constructor(public readonly expr: Expression) {
    super()
    this.addChild(expr)
  }

  evaluate(variables: Variables): number {
    return 1 / Math.sinh(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      Constant.MINUS_ONE,
      new Mul(
        new Mul(this.expr.differentiate(variableName, constantPool), this),
        new Coth(this.expr)
      )
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant)
      return constantPool.get(1 / Math.sinh(expr.value))

    return new Csch(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Csch && this.expr.isEquivalent(expression.expr)
  }
}

export class Sech extends Expression {
  constructor(public readonly expr: Expression) {
    super()
    this.addChild(expr)
  }

  evaluate(variables: Variables): number {
    return 1 / Math.cosh(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      Constant.MINUS_ONE,
      new Mul(
        new Mul(this.expr.differentiate(variableName, constantPool), this),
        new Tanh(this.expr)
      )
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant)
      return constantPool.get(1 / Math.cosh(expr.value))

    return new Sech(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sech && this.expr.isEquivalent(expression.expr)
  }
}

export class Coth extends Expression {
  constructor(public readonly expr: Expression) {
    super()
    this.addChild(expr)
  }

  evaluate(variables: Variables): number {
    return 1 / Math.tanh(this.expr.evaluate(variables))
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    return new Mul(
      Constant.MINUS_ONE,
      new Mul(
        this.expr.differentiate(variableName, constantPool),
        new Power(new Csch(this.expr), constantPool.get(2))
      )
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const expr = this.expr.optimize(option, constantPool)

    if (expr instanceof Constant)
      return constantPool.get(1 / Math.tanh(expr.value))

    return new Coth(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Coth && this.expr.isEquivalent(expression.expr)
  }
}
