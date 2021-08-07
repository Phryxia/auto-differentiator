import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import Constant from './constant'
import Mul from './mul'
import Negative from './negative'
import PowerInt from './powerInt'

export class Sinh implements Expression {
  constructor(public expr: Expression) {}

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
}

export class Cosh implements Expression {
  constructor(public expr: Expression) {}

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
}

export class Tanh implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return Math.tanh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Mul(
      this.expr.differentiate(variableName),
      new PowerInt(new Sech(this.expr), 2)
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
}

export class Csch implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return 1 / Math.sinh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Negative(
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
}

export class Sech implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return 1 / Math.cosh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Negative(
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
}

export class Coth implements Expression {
  constructor(public expr: Expression) {}

  evaluate(variables: Variables): number {
    return 1 / Math.tanh(this.expr.evaluate(variables))
  }

  differentiate(variableName: string): Expression {
    return new Negative(
      new Mul(
        this.expr.differentiate(variableName),
        new PowerInt(new Csch(this.expr), 2)
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
}
