import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant, { CONSTANT_MINUS_ONE } from './constant'
import { Mul } from './multiplicative'
import Power from './power'

export class Sin implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.sin(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(this.expr.differentiate(variableName), new Cos(this.expr))
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.sin(expr.value))

    return new Sin(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sin && this.expr.isEquivalent(expression.expr)
  }
}

export class Cos implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.cos(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      CONSTANT_MINUS_ONE,
      new Mul(this.expr.differentiate(variableName), new Sin(this.expr))
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.cos(expr.value))

    return new Cos(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Cos && this.expr.isEquivalent(expression.expr)
  }
}

export class Tan implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.tan(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      this.expr.differentiate(variableName),
      new Power(new Sec(this.expr), new Constant(2))
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(Math.tan(expr.value))

    return new Tan(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Tan && this.expr.isEquivalent(expression.expr)
  }
}

export class Csc implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return 1 / Math.sin(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      CONSTANT_MINUS_ONE,
      new Mul(
        this.expr.differentiate(variableName),
        new Mul(this, new Cot(this.expr))
      )
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.sin(expr.value))

    return new Csc(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Csc && this.expr.isEquivalent(expression.expr)
  }
}

export class Sec implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return 1 / Math.cos(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      this.expr.differentiate(variableName),
      new Mul(this, new Tan(this.expr))
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.cos(expr.value))

    return new Sec(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Sec && this.expr.isEquivalent(expression.expr)
  }
}

export class Cot implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return 1 / Math.tan(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      CONSTANT_MINUS_ONE,
      new Mul(
        this.expr.differentiate(variableName),
        new Power(new Csc(this.expr), new Constant(2))
      )
    )
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    const expr = this.expr.optimize(option)

    if (expr instanceof Constant) return new Constant(1 / Math.tan(expr.value))

    return new Cot(expr)
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof Cot && this.expr.isEquivalent(expression.expr)
  }
}
