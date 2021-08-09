import { Expression } from '../model'
import Add from '../nodes/add'
import Constant, { CONSTANT_ONE, CONSTANT_ZERO } from '../nodes/constant'
import Div from '../nodes/div'
import Mul from '../nodes/mul'
import Sub from '../nodes/sub'
import transformToTerms, { Term } from './term'
import transformToExponent, { Exponent } from './exponent'
import { joinAdd } from '../util'
import Power from '../nodes/power'

export interface Bucket<T> {
  [nodeType: string]: T[]
}

export function optimizeAddSub(node: Add | Sub): Expression {
  // 트리를 항으로 변환
  const terms = transformToTerms(node)

  // [x항들, xy항들, a항들 ...]
  let shapeBank: Term[][] = []

  // 상수항은 위의 뱅크에 들어가지 않고 별도로 취급
  let constantIndex = -1

  // 동류항으로 분류
  const isReserved: boolean[] = []
  for (let i = 0; i < terms.length; ++i) {
    if (terms[i].remain instanceof Constant) {
      constantIndex = i
      isReserved[i] = true
      continue
    }
    if (isReserved[i]) continue
    isReserved[i] = true

    const sameShape: Term[] = [terms[i]]
    for (let j = i + 1; j < terms.length; ++j) {
      if (terms[j].remain instanceof Constant || isReserved[j]) continue

      if (terms[i].remain.isEquivalent(terms[j].remain)) {
        isReserved[j] = true
        sameShape.push(terms[j])
      }
    }

    shapeBank.push(sameShape)
  }

  // 동류항 합치기
  let lvalue: Expression | null = null
  shapeBank.forEach((sameShape) => {
    // 동류항 종류별로 처리
    let coefficient = sameShape.reduce(
      (sum, { coefficient }) => sum + coefficient,
      0
    )

    let rvalue
    if (coefficient === 0) {
      return
    } else if (coefficient === 1) {
      rvalue = sameShape[0].remain
    } else {
      rvalue = new Mul(new Constant(coefficient), sameShape[0].remain)
    }

    if (lvalue) {
      if (coefficient === -1) {
        lvalue = new Sub(lvalue, rvalue)
      } else {
        lvalue = new Add(lvalue, rvalue)
      }
    } else {
      lvalue = rvalue
    }
  })

  // 상수항 있는 경우
  if (constantIndex !== -1) {
    const constant = new Constant(terms[constantIndex].coefficient)
    if (lvalue) {
      lvalue = new Add(lvalue, constant)
    } else {
      lvalue = constant
    }
  }

  // 변수는 전부 상쇄되어 0이고 상수항이 없는 경우
  if (!lvalue) {
    lvalue = CONSTANT_ZERO
  }

  return lvalue
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
        lvalue = new Div(CONSTANT_ONE, rvalue)
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
    lvalue = CONSTANT_ONE
  }

  return lvalue
}

export function collectAdditiveChilds(
  root: Add | Sub,
  output: Bucket<{ expression: Expression; isNegative: boolean }>,
  isNegative: boolean = false
): void {
  ;[root.expr0, root.expr1].forEach((node, index) => {
    const negative =
      root instanceof Div ? index === (isNegative ? 0 : 1) : isNegative

    if (node instanceof Add || node instanceof Sub) {
      collectAdditiveChilds(node, output, negative)
    } else {
      const className = node.constructor.name
      let list = output[className]
      if (!list) {
        list = output[className] = []
      }
      list.push({ expression: node, isNegative: negative })
    }
  })
}

export function collectMultiplyingChilds(
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
export function isEquivalentAddSub(
  expr0: Add | Sub,
  expr1: Add | Sub
): boolean {
  const bucket0: Bucket<{ expression: Expression; isNegative: boolean }> = {}
  collectAdditiveChilds(expr0, bucket0)

  const bucket1: Bucket<{ expression: Expression; isNegative: boolean }> = {}
  collectAdditiveChilds(expr1, bucket1)

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
      (isCleared, { expression: exprA, isNegative: isNegativeA }) => {
        if (!isCleared) return false

        for (let i = 0; i < bucket1[typeName].length; ++i) {
          if (matched[i]) continue

          const { expression: exprB, isNegative: isNegativeB } =
            bucket1[typeName][i]

          if (isNegativeA === isNegativeB && exprA.isEquivalent(exprB)) {
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

// 최적화 된 애들끼리만 제대로 비교함
export function isEquivalentMulDiv(
  expr0: Mul | Div,
  expr1: Mul | Div,
  isConstantIgnored: boolean = false
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
