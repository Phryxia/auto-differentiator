import { useState } from 'react'
import { Expression } from '../../math/model'
import Parser, { Token } from '../../math/parser'
import { renderToText } from '../../math/render'
import ExprDom from './ExprDom'
import TextInput from '../TextInput'
import classNames from 'classnames/bind'
import tokenStyles from '../../styles/token/token.module.css'

const cx = classNames.bind(tokenStyles)

const parser = new Parser()

export default function ParserTest() {
  const [expression, setExpression] = useState<Expression | undefined>()
  const [tokens, setTokens] = useState<Token[]>([])
  const [warning, setWarning] = useState<string>('')
  const [error, setError] = useState<string>('')

  const [hoverIndex, setHoverIndex] = useState<number>(-1)

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
      <div className={cx('container')}>
        {tokens.map((token, index) => (
          <div
            key={index}
            className={cx('element')}
            onMouseOver={() => setHoverIndex(index)}
            onMouseOut={() => index === hoverIndex && setHoverIndex(-1)}
          >
            {token.content}
            <span className={cx('tooltip', { isActive: index === hoverIndex })}>
              {token.type}
            </span>
          </div>
        ))}
      </div>

      <h2>Parsed Expression</h2>
      {expression && renderToText(expression)}

      <h2>Tree</h2>
      {expression && <ExprDom expr={expression} />}

      <h2>Parser Warning</h2>
      <div
        dangerouslySetInnerHTML={{
          __html:
            warning?.replaceAll(' ', '&nbsp').replaceAll('\n', '<br />') ?? '',
        }}
      />

      <h2>Parse Error</h2>
      <div
        dangerouslySetInnerHTML={{
          __html:
            error?.replaceAll(' ', '&nbsp').replaceAll('\n', '<br />') ?? '',
        }}
      />
    </>
  )
}
