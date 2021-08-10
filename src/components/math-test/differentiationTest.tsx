import { useState } from 'react'
import { Expression } from '../../math/model'
import Parser from '../../math/parser'
import { renderToText } from '../../math/render'
import TextInput from '../TextInput'

const parser = new Parser()

export default function DifferentiationTest() {
  const [expression, setExpression] = useState<Expression | undefined>()

  function handleChange(value: string): void {
    const { expression } = parser.parse(value)

    setExpression(expression)
  }

  return (
    <>
      <h1>Differentiation Test Page</h1>
      <TextInput onChange={handleChange} />

      <h2>Parsed Expression</h2>
      {expression && renderToText(expression)}

      <h2>Differentiated Expression (by x)</h2>
      {expression && renderToText(expression.optimize().differentiate('x'))}

      <h2>Optimized Differentiated Expression (by x)</h2>
      {expression &&
        renderToText(expression.optimize().differentiate('x').optimize())}
    </>
  )
}
