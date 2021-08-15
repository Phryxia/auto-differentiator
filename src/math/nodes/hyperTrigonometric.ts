import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant, { CONSTANT_MINUS_ONE } from './constant'
import { Mul } from './multiplicative'
import Power from './power'

export class Sinh implements Expression {
  constructor(public readonly expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.sinh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(this.expr.differentiate(variableName), new Cosh(this.expr))
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.sinh(expr.value))

    return new Sinh(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sinh && this.expr.isEquivalent(expression.expr)
  }
}

export class Cosh implements Expression {
  constructor(public readonly expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.cosh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(this.expr.differentiate(variableName), new Sinh(this.expr))
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.cosh(expr.value))

    return new Cosh(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Cosh && this.expr.isEquivalent(expression.expr)
  }
}

export class Tanh implements Expression {
  constructor(public readonly expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.tanh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      this.expr.differentiate(variableName),
      new Power(new Sech(this.expr), new Constant(2))
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.tanh(expr.value))

    return new Tanh(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Tanh && this.expr.isEquivalent(expression.expr)
  }
}

export class Csch implements Expression {
  constructor(public readonly expr: Expression) {}

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

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.sinh(expr.value))

    return new Csch(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Csch && this.expr.isEquivalent(expression.expr)
  }
}

export class Sech implements Expression {
  constructor(public readonly expr: Expression) {}

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

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.cosh(expr.value))

    return new Sech(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sech && this.expr.isEquivalent(expression.expr)
  }
}

export class Coth implements Expression {
  constructor(public readonly expr: Expression) {}

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

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.tanh(expr.value))

    return new Coth(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Coth && this.expr.isEquivalent(expression.expr)
  }
}
