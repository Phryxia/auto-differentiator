import { Expression } from '../model'
import Constant, { CONSTANT_MINUS_ONE, CONSTANT_ONE } from '../nodes/constant'
import Div from '../nodes/div'
import Mul from '../nodes/mul'
import Power from '../nodes/power'

export interface Exponent {
  exponent: Expression
  base: Expression
}

// 밑의 엔트리가 되는 노드들 찾기
function findExponentRoots(root: Mul | Div): [Expression, boolean][] {
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
function separateConstant(root: Expression, isInverted: boolean): Exponent {
  if (root instanceof Power)
    return {
      base: root.expr0,
      exponent: isInverted
        ? new Mul(CONSTANT_MINUS_ONE, root.expr1)
        : root.expr1,
    }
  return {
    base: root,
    exponent: isInverted ? CONSTANT_MINUS_ONE : CONSTANT_ONE,
  }
}

export default function transformToTerms(root: Mul | Div): Exponent[] {
  const roots = findExponentRoots(root)

  return roots.map(([root, isNegative]) => separateConstant(root, isNegative))
}
