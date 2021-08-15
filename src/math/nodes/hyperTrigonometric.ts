import { Expression, OptimizerOption, Variables } from '../model'
import Constant, { CONSTANT_MINUS_ONE } from './constant'
import { Mul } from './multiplicative'
import Power from './power'

export class Sinh extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return Math.sinh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(this.expr.differentiate(variableName), new Cosh(this.expr))
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const expr = this.expr.optimize(option)

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
  }

  evaluate(variables: Variables): number {
    return Math.cosh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(this.expr.differentiate(variableName), new Sinh(this.expr))
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.cosh(expr.value))

    return new Cosh(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Cosh && this.expr.isEquivalent(expression.expr)
  }
}

export class Tanh extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return Math.tanh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      this.expr.differentiate(variableName),
      new Power(new Sech(this.expr), new Constant(2))
    )
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.tanh(expr.value))

    return new Tanh(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Tanh && this.expr.isEquivalent(expression.expr)
  }
}

export class Csch extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return 1 / Math.sinh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      new Constant(-1),
      new Mul(
        new Mul(this.expr.differentiate(variableName), this),
        new Coth(this.expr)
      )
    )
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.sinh(expr.value))

    return new Csch(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Csch && this.expr.isEquivalent(expression.expr)
  }
}

export class Sech extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return 1 / Math.cosh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      CONSTANT_MINUS_ONE,
      new Mul(
        new Mul(this.expr.differentiate(variableName), this),
        new Tanh(this.expr)
      )
    )
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.cosh(expr.value))

    return new Sech(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sech && this.expr.isEquivalent(expression.expr)
  }
}

export class Coth extends Expression {
  constructor(public readonly expr: Expression) {
    super()
  }

  evaluate(variables: Variables): number {
    return 1 / Math.tanh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      CONSTANT_MINUS_ONE,
      new Mul(
        this.expr.differentiate(variableName),
        new Power(new Csch(this.expr), new Constant(2))
      )
    )
  }

  optimizeConcrete(option: OptimizerOption): Expression {
    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.tanh(expr.value))

    return new Coth(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Coth && this.expr.isEquivalent(expression.expr)
  }
}
