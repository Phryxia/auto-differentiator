import { useEffect } from 'react'
import { ChangeEvent, useState } from 'react'
import Parser, { Token } from './parser'
import { Expression } from './parser/module/model'
import render from './parser/module/render'
import { createRandomExpression } from './parser/module/fun'

const parser = new Parser()

function App() {
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
      <input type="text" onChange={handleChange} value={content} />
      <hr />
      {currentTokens.map((token, index) => (
        <div key={index}>
          {token.content} (type: {token.type})
        </div>
      ))}
      <hr />
      <div>{currentExpr && render(currentExpr)}</div>
      <hr />
      <div>
        x로 미분: {currentExpr && render(currentExpr.differentiate('x'))}
      </div>
      <hr />
      <div>
        x로 미분(단순화):{' '}
        {currentExpr && render(currentExpr.differentiate('x').optimize())}
      </div>
      <hr />
      <div>{currentWarning}</div>
      <hr />
      <div>{currentError}</div>
    </>
  )
}

export default App
