import { Div, Mul } from '.'
import { Expression } from '../../model'
import Constant from '../constant'
import Power from '../power'

export interface Factor {
  exponent: Expression
  base: Expression
}

// 밑의 엔트리가 되는 노드들 찾기
function findFactorRoots(root: Mul | Div): [Expression, boolean][] {
  const out: [Expression, boolean][] = []

  function traverse(node: Mul | Div, isInverted: boolean = false) {
    ;[node.expr0, node.expr1].forEach((child, index) => {
      const invert =
        (node instanceof Div && index === (isInverted ? 0 : 1)) || isInverted
      if (child instanceof Mul || child instanceof Div) {
        traverse(child, invert)
      } else {
        out.push([child, invert])
      }
    })
  }

  traverse(root)
  return out
}

// 밑과 지수를 분리
function separateExponent(root: Expression, isInverted: boolean): Factor {
  if (root instanceof Power)
    return {
      base: root.expr0,
      exponent: isInverted
        ? new Mul(Constant.MINUS_ONE, root.expr1)
        : root.expr1,
    }
  return {
    base: root,
    exponent: isInverted ? Constant.MINUS_ONE : Constant.ONE,
  }
}

export default function transformToFactors(root: Mul | Div): Factor[] {
  const roots = findFactorRoots(root)

  return roots.map(([root, isNegative]) => separateExponent(root, isNegative))
}
