import Parser, { TokenType } from '../../math/parser'
import { isSameStructure } from './common'

const parser = new Parser()

describe('Parser.tokenize', () => {
  test('empty string', () => {
    const { tokens } = parser.tokenize('')
    expect(tokens).toEqual([])
  })

  test('4577', () => {
    const { tokens } = parser.tokenize('4577')
    expect(tokens[0].content).toBe('4577')
    expect(tokens[0].type).toBe(TokenType.NUMBER)
  })

  test('3.141592', () => {
    const { tokens } = parser.tokenize('3.141592')
    expect(tokens[0].content).toBe('3.141592')
    expect(tokens[0].type).toBe(TokenType.NUMBER)
  })

  test('.1', () => {
    const { tokens } = parser.tokenize('.1')
    expect(tokens[0].content).toBe('.1')
    expect(tokens[0].type).toBe(TokenType.NUMBER)
  })

  test('1.', () => {
    const { tokens } = parser.tokenize('1.')
    expect(tokens[0].content).toBe('1.')
    expect(tokens[0].type).toBe(TokenType.NUMBER)
  })

  test('1e3', () => {
    const { tokens } = parser.tokenize('1e3')
    expect(tokens[0].content).toBe('1e3')
    expect(tokens[0].type).toBe(TokenType.NUMBER)
  })

  test('5.7e-2', () => {
    const { tokens } = parser.tokenize('5.7e-2')
    expect(tokens[0].content).toBe('5.7e-2')
    expect(tokens[0].type).toBe(TokenType.NUMBER)
  })

  test('niceVariable', () => {
    const { tokens } = parser.tokenize('niceVariable')
    expect(tokens[0].content).toBe('niceVariable')
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER)
  })

  test('a bb ccc dddd', () => {
    const { tokens } = parser.tokenize('a bb ccc dddd')
    expect(tokens.map((token) => token.content)).toEqual([
      'a',
      'bb',
      'ccc',
      'dddd',
    ])
  })
})

describe('Parser.parse', () => {
  test('empty string', () => {
    const { expression, error } = parser.parse('')
    expect(expression).toBeUndefined()
    expect(error).toBeTruthy()
  })

  test('x + y', () => {
    const { expression } = parser.parse('x + y')
    expect(
      isSameStructure(expression, {
        className: 'Add',
        expr0: {
          className: 'Variable',
          name: 'x',
        },
        expr1: {
          className: 'Variable',
          name: 'y',
        },
      })
    ).toBe(true)
  })
})
