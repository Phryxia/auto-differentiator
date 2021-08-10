import { useState } from 'react'
import { Expression } from '../../math/model'
import Parser, { Token } from '../../math/parser'
import { renderToText } from '../../math/render'
import ExprDom from './ExprDom'
import TextInput from '../TextInput'

const parser = new Parser()

export default function ParserTest() {
  const [expression, setExpression] = useState<Expression | undefined>()
  const [tokens, setTokens] = useState<Token[]>([])
  const [warning, setWarning] = useState<string>('')
  const [error, setError] = useState<string>('')

  function handleChange(value: string): void {
    const { tokens } = parser.tokenize(value)
    const { expression, warning, error } = parser.parse(value)

    setTokens(tokens)
    setExpression(expression)
    setWarning(warning ?? '')
    setError(error ?? '')
  }

  return (
    <>
      <h1>Parser Test Page</h1>
      <TextInput onChange={handleChange} />

      <h2>Tokens</h2>
      {tokens.map((token, index) => (
        <div key={index}>
          {token.content} (type: {token.type})
        </div>
      ))}

      <h2>Parsed Expression</h2>
      {expression && renderToText(expression)}

      <h2>Tree</h2>
      {expression && <ExprDom expr={expression} />}

      <h2>Parwse Warning</h2>
      {warning}

      <h3>Parse Error</h3>
      {error}
    </>
  )
}
