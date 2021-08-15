import { Bucket, Expression } from '../../model'
import Constant, { CONSTANT_ZERO } from '../constant'
import { Div, Mul } from '../multiplicative'
import Add from './add'
import Sub from './sub'
import transformToTerms, { Term } from './term'

export function optimizeAddSub(node: Add | Sub): Expression {
  // 트리를 항으로 변환
  const terms = transformToTerms(node)

  // [x항들, xy항들, a항들 ...]
  let shapeBank: Term[][] = []

  // 상수항은 위의 뱅크에 들어가지 않고 별도로 취급
  let constantValue = 0

  // 동류항으로 분류
  const isReserved: boolean[] = []
  for (let i = 0; i < terms.length; ++i) {
    if (terms[i].remain instanceof Constant) {
      // @ts-ignore
      constantValue += terms[i].remain.value * terms[i].coefficient
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
  if (constantValue !== 0) {
    const constant = new Constant(constantValue)
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

function collectAdditiveChilds(
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

function isEquivalentAdditive(expr0: Add | Sub, expr1: Add | Sub): boolean {
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

// Add 와 Sub의 공통 코드
export function isEquivalentAddSub(
  expr0: Add | Sub,
  expr1: Expression
): boolean {
  const expr0Optimized = expr0.optimize()
  const isExpr0Additive =
    expr0Optimized instanceof Add || expr0Optimized instanceof Sub

  const expr1Optimized = expr1.optimize()
  const isExpr1Additive =
    expr1Optimized instanceof Add || expr1Optimized instanceof Sub

  if (isExpr0Additive) {
    if (isExpr1Additive) {
      return isEquivalentAdditive(
        expr0Optimized as Add | Sub,
        expr1Optimized as Add | Sub
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
