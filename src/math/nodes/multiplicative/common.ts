import { Bucket, Expression } from '../../model'
import { joinAdd } from '../../util'
import Constant from '../constant'
import Power from '../power'
import Div from './div'
import transformToExponent, { Exponent } from './exponent'
import Mul from './mul'

function collectMultiplyingChilds(
  root: Mul | Div,
  output: Bucket<{ expression: Expression; isInverted: boolean }>,
  isInverted: boolean = false
): void {
  ;[root.expr0, root.expr1].forEach((node, index) => {
    const invert =
      root instanceof Div ? index === (isInverted ? 0 : 1) : isInverted

    if (node instanceof Mul || node instanceof Div) {
      collectMultiplyingChilds(node, output, invert)
    } else {
      const className = node.constructor.name
      let list = output[className]
      if (!list) {
        list = output[className] = []
      }
      list.push({ expression: node, isInverted: invert })
    }
  })
}

// 최적화 된 애들끼리만 제대로 비교함
function isEquivalentMultiplicative(
  expr0: Mul | Div,
  expr1: Mul | Div
): boolean {
  const bucket0: Bucket<{ expression: Expression; isInverted: boolean }> = {}
  collectMultiplyingChilds(expr0, bucket0)

  const bucket1: Bucket<{ expression: Expression; isInverted: boolean }> = {}
  collectMultiplyingChilds(expr1, bucket1)

  // 동일한 타입들을 가지고 있는지
  const isTypeCleared: { [typeName: string]: boolean } = {}
  for (const typeName in bucket0) {
    isTypeCleared[typeName] = true
  }
  for (const typeName in bucket1) {
    if (!isTypeCleared[typeName]) return false
    isTypeCleared[typeName] = false
  }
  for (const typeName in bucket0) {
    if (isTypeCleared[typeName]) return false
  }

  // 타입별 매칭
  for (const typeName in bucket0) {
    if (bucket0[typeName].length !== bucket1[typeName].length) return false

    const matched: boolean[] = []

    const isCleared = bucket0[typeName].reduce(
      (isCleared, { expression: exprA, isInverted: isInvertedA }) => {
        if (!isCleared) return false

        for (let i = 0; i < bucket1[typeName].length; ++i) {
          if (matched[i]) continue

          const { expression: exprB, isInverted: isInvertedB } =
            bucket1[typeName][i]

          if (isInvertedA === isInvertedB && exprA.isEquivalent(exprB)) {
            matched[i] = true
            return true
          }
        }
        return false
      },
      true
    )

    if (!isCleared) return false
  }
  return true
}

// Add 와 Sub의 공통 코드
export function isEquivalentMulDiv(
  expr0: Mul | Div,
  expr1: Expression
): boolean {
  const expr0Optimized = expr0.optimize()
  const isExpr0Additive =
    expr0Optimized instanceof Mul || expr0Optimized instanceof Div

  const expr1Optimized = expr1.optimize()
  const isExpr1Additive =
    expr1Optimized instanceof Mul || expr1Optimized instanceof Div

  if (isExpr0Additive) {
    if (isExpr1Additive) {
      return isEquivalentMultiplicative(
        expr0Optimized as Mul | Div,
        expr1Optimized as Mul | Div
      )
    } else {
      return false
    }
  } else {
    if (isExpr1Additive) {
      return false
    }
    return expr0Optimized.isEquivalent(expr1Optimized)
  }
}

export function optimizeMulDiv(node: Mul | Div): Expression {
  const exponents = transformToExponent(node)

  // [x항들, xy항들, a항들 ...]
  let shapeBank: Exponent[][] = []

  // 같은 밑으로 분류
  let constantValue = 1
  const isReserved: boolean[] = []
  for (let i = 0; i < exponents.length; ++i) {
    // 순수상수인 경우 별도로 합침
    if (
      exponents[i].base instanceof Constant &&
      exponents[i].exponent instanceof Constant
    ) {
      constantValue *= Math.pow(
        // @ts-ignore
        exponents[i].base.value,
        // @ts-ignore
        exponents[i].exponent.value
      )
      isReserved[i] = true
      continue
    }

    if (isReserved[i]) continue
    isReserved[i] = true

    const sameShape: Exponent[] = [exponents[i]]
    for (let j = i + 1; j < exponents.length; ++j) {
      if (isReserved[j]) continue

      if (exponents[i].base.isEquivalent(exponents[j].base)) {
        isReserved[j] = true
        sameShape.push(exponents[j])
      }
    }

    shapeBank.push(sameShape)
  }

  let lvalue: Expression | null = null

  shapeBank.forEach((sameShape) => {
    let exponent = joinAdd(
      sameShape.map(({ exponent }) => ({ expr: exponent }))
    )
    exponent = exponent.optimize()

    let isInverted = false
    let rvalue: Expression
    if (exponent instanceof Constant) {
      if (exponent.value === 0) return

      if (exponent.value === 1) {
        rvalue = sameShape[0].base
      } else if (exponent.value === -1) {
        isInverted = true
        rvalue = sameShape[0].base
      } else if (exponent.value > 0) {
        rvalue = new Power(sameShape[0].base, exponent)
      } else {
        isInverted = true
        rvalue = new Power(sameShape[0].base, new Constant(-exponent.value))
      }
    } else {
      rvalue = new Power(sameShape[0].base, exponent)
    }

    if (lvalue) {
      if (isInverted) {
        lvalue = new Div(lvalue, rvalue)
      } else {
        lvalue = new Mul(lvalue, rvalue)
      }
    } else {
      if (isInverted) {
        lvalue = new Div(Constant.ONE, rvalue)
      } else {
        lvalue = rvalue
      }
    }
  })

  if (constantValue !== 1) {
    const constant = new Constant(constantValue)
    if (lvalue) {
      lvalue = new Mul(constant, lvalue)
    } else {
      lvalue = constant
    }
  }

  if (!lvalue) {
    lvalue = Constant.ONE
  }

  return lvalue
}
