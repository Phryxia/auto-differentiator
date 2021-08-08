import { useEffect } from 'react'
import { ChangeEvent, useState } from 'react'
import Parser, { Token } from '../parser'
import { Expression } from '../parser/module/model'
import render from '../parser/module/render'
import { createRandomExpression } from '../parser/module/fun'
import ExprDom from './ExprDom'
import EquivalenceTest from './EquivalenceTest'

const parser = new Parser()

function App() {
  const [isTokenShow, setIsTokenShow] = useState<boolean>(false)

  const [content, setContent] = useState<string>('')
  const [currentTokens, setCurrentTokens] = useState<Token[]>([])
  const [currentExpr, setCurrentExpr] = useState<Expression | undefined>(
    undefined
  )
  const [currentWarning, setCurrentWarning] = useState<string>('')
  const [currentError, setCurrentError] = useState<string>('')

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setContent(e.target.value)
  }

  useEffect(() => {
    setContent(render(createRandomExpression(4)))
  }, [])

  useEffect(() => {
    const { tokens } = parser.tokenize(content)

    const { expression, warning, error } = parser.parse(content)

    setCurrentTokens(tokens)
    expression && setCurrentExpr(expression)
    setCurrentWarning(warning ?? '')
    setCurrentError(error ?? '')
  }, [content])

  return (
    <>
      <h1>Auto Differentiation System</h1>
      <input type="text" onChange={handleChange} value={content} />
      <a onClick={() => setIsTokenShow(!isTokenShow)}>
        <h2>Tokens {isTokenShow ? '▲' : '▼'}</h2>
      </a>
      {isTokenShow &&
        currentTokens.map((token, index) => (
          <div key={index}>
            {token.content} (type: {token.type})
          </div>
        ))}

      <h2>Tree</h2>
      {currentExpr && <ExprDom expr={currentExpr} />}

      <h2>Input Expression</h2>
      <div>{currentExpr && render(currentExpr)}</div>

      <h2>Optimized Expression</h2>
      <div>{currentExpr && render(currentExpr.optimize())}</div>

      <h2>Differentiated Expression</h2>
      <div>{currentExpr && render(currentExpr.differentiate('x'))}</div>

      <h2>Optimized Differentiated Expression</h2>
      <div>
        {currentExpr && render(currentExpr.differentiate('x').optimize())}
      </div>

      <hr />
      <div>{currentWarning}</div>
      <hr />
      <div>{currentError}</div>

      <EquivalenceTest />
    </>
  )
}

export default App
