import { ConstantPool, Expression, OptimizerOption, Variables } from '../model'
import { gcd, getSumPairs, isConstantOne, isConstantZero } from '../util'
import { Add } from './additive'
import Constant from './constant'
import Log from './log'
import { Div, Mul } from './multiplicative'
import NamedConstant from './namedConstant'
import transformToFactors from './multiplicative/exponent'
import transformToTerms from './additive/term'

export default class Power extends Expression {
  // expr0: base, expr1: exponent
  constructor(
    public readonly expr0: Expression,
    public readonly expr1: Expression
  ) {
    super()
    this.addChild(expr0)
    this.addChild(expr1)
  }

  evaluate(variables: Variables): number {
    return Math.pow(
      this.expr0.evaluate(variables),
      this.expr1.evaluate(variables)
    )
  }

  differentiateConcrete(
    variableName: string,
    constantPool: ConstantPool
  ): Expression {
    if (this.expr0 === NamedConstant.E) return this

    return new Mul(
      this,
      new Add(
        new Mul(
          this.expr1.differentiate(variableName, constantPool),
          new Log(this.expr0)
        ),
        new Mul(
          this.expr1,
          new Div(
            this.expr0.differentiate(variableName, constantPool),
            this.expr0
          )
        )
      )
    )
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    // rule g0
    const base = this.expr0.optimize(option, constantPool)
    const exponent = this.expr1.optimize(option, constantPool)

    // rule g1
    if (base instanceof Constant && exponent instanceof Constant)
      return constantPool.get(Math.pow(base.value, exponent.value))

    if (isConstantZero(exponent)) return Constant.ONE
    if (isConstantOne(exponent)) return base

    // rule e0
    if (base instanceof Power)
      return new Power(base.expr0, new Mul(base.expr1, exponent)).optimize(
        option,
        constantPool
      )

    // rule e1
    if (
      base.getUsedVariables().length > 0 &&
      exponent.getUsedVariables().length > 0
    )
      return new Power(
        NamedConstant.E,
        new Mul(new Log(base), exponent)
      ).optimize(option, constantPool)

    // rule e2
    if (
      base.getUsedVariables().length > 0 &&
      base instanceof Add &&
      exponent instanceof Constant &&
      Number.isInteger(exponent.value)
    )
      return this.e2(base, exponent, option, constantPool)

    // rule e3
    if (base instanceof Mul)
      return this.e3(base, exponent, option, constantPool)

    // rule e4
    if (base instanceof Constant && exponent instanceof Add) {
      const { remains, constant } = splitConstantFromAdditive(exponent)

      if (constant) {
        return new Mul(new Power(base, constant), remains).optimize(
          option,
          constantPool
        )
      }
    }

    // rule e5
    if (this.isE5Available(base, exponent))
      return this.e5(
        base as Constant | NamedConstant,
        exponent as Log | Mul,
        option,
        constantPool
      )

    return new Power(base, exponent)
  }

  isEquivalent(expression: Expression): boolean {
    return (
      expression instanceof Power &&
      this.expr0.isEquivalent(expression.expr0) &&
      this.expr1.isEquivalent(expression.expr1)
    )
  }

  // https://en.wikipedia.org/wiki/Multinomial_theorem
  private e2(
    base: Add,
    exponent: Constant,
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const n = exponent.value
    const terms = transformToTerms(base)
    console.log('start get sum pairs')
    const pairs = getSumPairs(terms.length, n)
    console.log('end get sum pairs')

    let sums: Expression
    pairs.forEach((pair) => {
      let products: Expression = constantPool.get(
        getMultinomialCoefficient(n, pair)
      )
      pair.forEach((pow, index) => {
        if (pow === 0) return

        const product = new Power(
          new Mul(
            terms[index].remain,
            constantPool.get(terms[index].coefficient)
          ),
          constantPool.get(pow)
        )

        products = new Mul(products, product)
      })

      if (sums) {
        sums = new Add(sums, products)
      } else {
        sums = products
      }
    })

    return sums!.optimize(option, constantPool)
  }

  private e3(
    base: Mul,
    exponent: Expression,
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    const factors = transformToFactors(base)
    let products: Expression | null = null

    for (const factor of factors) {
      const product = new Power(factor.base, new Mul(exponent, factor.exponent))
      if (products) {
        products = new Mul(products, product)
      } else {
        products = product
      }
    }

    return products!.optimize(option, constantPool)
  }

  private isE5Available(base: Expression, exponent: Expression): boolean {
    if (!(base instanceof Constant || base instanceof NamedConstant))
      return false

    if (exponent instanceof Log) return true

    if (exponent instanceof Mul)
      return (
        (exponent.expr0 instanceof Log && exponent.expr1 instanceof Constant) ||
        (exponent.expr0 instanceof Constant && exponent.expr1 instanceof Log)
      )

    return false
  }

  private e5(
    base: Constant | NamedConstant,
    exponent: Log | Mul,
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    // Normalize exponent to pure log
    // since exponent is optimized, it must have e as bases
    let newBase: Expression
    if (exponent instanceof Mul) {
      if (exponent.expr0 instanceof Log)
        newBase = new Power(exponent.expr0.expr, exponent.expr1)
      if (exponent.expr1 instanceof Log)
        newBase = new Power(exponent.expr1.expr, exponent.expr0)
    } else {
      newBase = exponent.expr
    }

    if (base === NamedConstant.E) {
      return newBase!.optimize(option, constantPool)
    }

    return new Power(newBase!, new Log(base)).optimize(option, constantPool)
  }
}

// This assume node is optimized already.
function splitConstantFromAdditive(node: Add): {
  remains: Expression
  constant?: Expression
} {
  let remains: Expression | undefined = undefined
  let constant: Expression | undefined = undefined

  function traverse(root: Add) {
    ;[root.expr0, root.expr1].forEach((child) => {
      if (child instanceof Add) {
        traverse(child)
      } else if (child instanceof Constant) {
        constant = child
      } else {
        if (remains) {
          remains = new Add(remains, child)
        } else {
          remains = child
        }
      }
    })
  }

  traverse(node)

  return {
    remains: remains!,
    constant,
  }
}

function createFactorial(n: number): number[] {
  if (n <= 1) return [1]

  const result = []
  for (let i = 2; i <= n; ++i) result.push(i)

  return result
}

// This is not general implementation
// This assumes xF > yF and they are always divisible
function divideFactorial(xF: number[], yF: number[]): void {
  for (let denomIndex = 0; denomIndex < yF.length; ++denomIndex) {
    for (let nomIndex = 0; nomIndex < xF.length; ++nomIndex) {
      const commonDivisor = gcd(xF[nomIndex], yF[denomIndex])

      if (commonDivisor > 1) {
        xF[nomIndex] /= commonDivisor
        yF[denomIndex] /= commonDivisor
      }
    }
  }
}

// Specialized for computing factorials
// This handles large number as small as possible
function getMultinomialCoefficient(n: number, pows: number[]): number {
  const nFactorial = createFactorial(n)

  for (const pow of pows) {
    const pFactorial = createFactorial(pow)

    divideFactorial(nFactorial, pFactorial)
  }

  return nFactorial.reduce((acc, num) => acc * num, 1)
}
