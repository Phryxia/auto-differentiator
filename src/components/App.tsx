import { useState } from 'react'
import Parser, { Token } from '../parser'
import { Expression } from '../parser/module/model'
import render from '../parser/module/render'
import ExprDom from './ExprDom'
import EquivalenceTest from './EquivalenceTest'
import TextInput from './TextInput'

const parser = new Parser()

function App() {
  const [isTokenShow, setIsTokenShow] = useState<boolean>(false)

  const [tokens, setTokens] = useState<Token[]>([])
  const [expr, setExpr] = useState<Expression | undefined>()
  const [exprOptimized, setExprOptimized] = useState<Expression | undefined>()
  const [warning, setWarning] = useState<string>('')
  const [error, setError] = useState<string>('')

  function handleChange(value: string) {
    const { tokens } = parser.tokenize(value)
    const { expression, warning, error } = parser.parse(value)

    setTokens(tokens)
    setExpr(expression)
    setExprOptimized(expression?.optimize())
    setWarning(warning ?? '')
    setError(error ?? '')
  }

  return (
    <>
      <h1>Auto Differentiation System</h1>
      <TextInput onChange={handleChange} />
      <a onClick={() => setIsTokenShow(!isTokenShow)}>
        <h2>Tokens {isTokenShow ? '▲' : '▼'}</h2>
      </a>
      {isTokenShow &&
        tokens.map((token, index) => (
          <div key={index}>
            {token.content} (type: {token.type})
          </div>
        ))}

      <h2>Tree</h2>
      {expr && <ExprDom expr={expr} />}

      <h2>Input Expression</h2>
      <div>{expr && render(expr)}</div>

      <h2>Optimized Expression</h2>
      <div>{exprOptimized && render(exprOptimized)}</div>

      <h2>Differentiated Expression</h2>
      <div>{exprOptimized && render(exprOptimized.differentiate('x'))}</div>

      <h2>Optimized Differentiated Expression</h2>
      <div>
        {exprOptimized && render(exprOptimized.differentiate('x').optimize())}
      </div>

      <hr />
      <div>{warning}</div>
      <hr />
      <div>{error}</div>

      <EquivalenceTest />
    </>
  )
}

export default App
