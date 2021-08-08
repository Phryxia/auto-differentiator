import { useState } from 'react'
import Parser from '../parser'
import { Expression } from '../parser/module/model'
import ExprDom from './ExprDom'
import TextInput from './TextInput'

const parser = new Parser()

export default function EquivalenceTest() {
  const [exprA, setExprA] = useState<Expression | undefined>()
  const [exprB, setExprB] = useState<Expression | undefined>()

  function handleChangeA(value: string): void {
    const { expression } = parser.parse(value)

    if (expression) setExprA(expression)
    else setExprA(undefined)
  }

  function handleChangeB(value: string): void {
    const { expression } = parser.parse(value)

    if (expression) setExprB(expression)
    else setExprB(undefined)
  }

  return (
    <>
      <h1>Equivalence Test</h1>

      <h2>Expression A</h2>
      <TextInput onChange={handleChangeA} />
      {exprA && <ExprDom expr={exprA} />}

      <h2>Expression B</h2>
      <TextInput onChange={handleChangeB} />
      {exprB && <ExprDom expr={exprB} />}

      {exprA && exprB && exprA.isEquivalent(exprB)
        ? 'EQUIVALENT'
        : 'NOT EQUIVALENT'}
    </>
  )
}
