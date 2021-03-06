import { Add, Sub } from '.'
import { Expression } from '../../model'
import Constant from '../constant'
import { Div, Mul } from '../multiplicative'

export interface Term {
  coefficient: number
  remain: Expression
}

// 항의 엔트리가 되는 노드들 찾기
function findTermRoots(root: Add | Sub): [Expression, boolean][] {
  const out: [Expression, boolean][] = []

  function traverse(node: Add | Sub, isNegative: boolean = false) {
    ;[node.expr0, node.expr1].forEach((child, index) => {
      const negative =
        (node instanceof Sub && index === (isNegative ? 0 : 1)) || isNegative
      if (child instanceof Add || child instanceof Sub) {
        traverse(child, negative)
      } else {
        out.push([child, negative])
      }
    })
  }

  traverse(root)
  return out
}

// 항에서 변수와 계수 분리
function separateConstant(root: Expression, isNegative: boolean): Term {
  const out: { coefficient: number; remain?: Expression } = {
    coefficient: 1,
  }

  function traverse(node: Expression, isInverted: boolean) {
    if (node instanceof Mul || node instanceof Div) {
      ;[node.expr0, node.expr1].forEach((child, index) => {
        const invert =
          (node instanceof Div && index === (isInverted ? 0 : 1)) || isInverted

        if (child instanceof Mul || child instanceof Div) {
          traverse(child, invert)
        } else if (child instanceof Constant) {
          if (invert) {
            out.coefficient /= child.value
          } else {
            out.coefficient *= child.value
          }
        } else {
          if (out.remain) {
            if (invert) {
              out.remain = new Div(out.remain, child)
            } else {
              out.remain = new Mul(out.remain, child)
            }
          } else {
            if (invert) {
              out.remain = new Div(Constant.ONE, child)
            } else {
              out.remain = child
            }
          }
        }
      })

      if (!out.remain) {
        out.remain = Constant.ONE
      }
    } else {
      out.remain = node
    }
  }

  traverse(root, false)

  if (isNegative) {
    out.coefficient *= -1
  }
  // @ts-ignore
  return out
}

export default function transformToTerms(root: Add | Sub): Term[] {
  const roots = findTermRoots(root)

  return roots.map(([root, isNegative]) => separateConstant(root, isNegative))
}
