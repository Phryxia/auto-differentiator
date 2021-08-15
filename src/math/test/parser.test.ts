import Parser, { TokenType } from '../../math/parser'
import { NamedConstant } from '../nodes'
import { CONSTANT_ONE, CONSTANT_ZERO } from '../nodes/constant'
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

  test('2.e+2', () => {
    const { tokens } = parser.tokenize('2.e+2')
    expect(tokens[0].content).toBe('2.e+2')
    expect(tokens[0].type).toBe(TokenType.NUMBER)
  })

  test('.1e2', () => {
    const { tokens } = parser.tokenize('.1e2')
    expect(tokens[0].content).toBe('.1e2')
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

  test('.', () => {
    const { tokens, warning } = parser.tokenize('.')
    expect(tokens.length).toBe(0)
    expect(warning).toBeTruthy()
  })
})

describe('Parser.parse', () => {
  test('empty string', () => {
    const { expression, error } = parser.parse('')
    expect(expression).toBeUndefined()
    expect(error).toBeTruthy()
  })

  test('72', () => {
    const { expression } = parser.parse('72')
    expect(
      isSameStructure(expression, {
        className: 'Constant',
        value: 72,
      })
    ).toBe(true)
  })

  test('babo', () => {
    const { expression } = parser.parse('babo')
    expect(
      isSameStructure(expression, {
        className: 'Variable',
        name: 'babo',
      })
    ).toBe(true)
  })

  test('e', () => {
    const { expression } = parser.parse('e')
    expect(expression).toBe(NamedConstant.E)
  })

  test('x + y + z', () => {
    const { expression } = parser.parse('x + y + z')
    expect(
      isSameStructure(expression, {
        className: 'Add',
        expr0: {
          className: 'Add',
          expr0: {
            className: 'Variable',
            name: 'x',
          },
          expr1: {
            className: 'Variable',
            name: 'y',
          },
        },
        expr1: {
          className: 'Variable',
          name: 'z',
        },
      })
    ).toBe(true)
  })

  test('x - (y - z)', () => {
    const { expression } = parser.parse('x - (y - z)')
    expect(
      isSameStructure(expression, {
        className: 'Sub',
        expr0: {
          className: 'Variable',
          name: 'x',
        },
        expr1: {
          className: 'Sub',
          expr0: {
            className: 'Variable',
            name: 'y',
          },
          expr1: {
            className: 'Variable',
            name: 'z',
          },
        },
      })
    ).toBe(true)
  })

  test('x + +x', () => {
    const { expression } = parser.parse('x + +x')
    expect(
      isSameStructure(expression, {
        className: 'Add',
        expr0: {
          className: 'Variable',
          name: 'x',
        },
        expr1: {
          className: 'Variable',
          name: 'x',
        },
      })
    )
  })

  test('x - -x', () => {
    const { expression } = parser.parse('x - -x')
    expect(
      isSameStructure(expression, {
        className: 'Sub',
        expr0: {
          className: 'Variable',
          name: 'x',
        },
        expr1: {
          className: 'Mul',
          expr0: {
            className: 'Constant',
            value: -1,
          },
          expr1: {
            className: 'Variable',
            name: 'x',
          },
        },
      })
    )
  })

  test('x * y * z', () => {
    const { expression } = parser.parse('x * y * z')
    expect(
      isSameStructure(expression, {
        className: 'Mul',
        expr0: {
          className: 'Mul',
          expr0: {
            className: 'Variable',
            name: 'x',
          },
          expr1: {
            className: 'Variable',
            name: 'y',
          },
        },
        expr1: {
          className: 'Variable',
          name: 'z',
        },
      })
    )
  })

  test('x / (y / z)', () => {
    const { expression } = parser.parse('x / (y / z)')
    expect(
      isSameStructure(expression, {
        className: 'Div',
        expr0: {
          className: 'Variable',
          name: 'x',
        },
        expr1: {
          className: 'Div',
          expr0: {
            className: 'Variable',
            name: 'y',
          },
          expr1: {
            className: 'Variable',
            name: 'z',
          },
        },
      })
    )
  })

  test('x ^ x ^ x', () => {
    const { expression } = parser.parse('x ^ y ^ z')
    expect(
      isSameStructure(expression, {
        className: 'Power',
        expr0: {
          className: 'Variable',
          name: 'x',
        },
        expr1: {
          className: 'Power',
          expr0: {
            className: 'Variable',
            name: 'y',
          },
          expr1: {
            className: 'Variable',
            name: 'z',
          },
        },
      })
    )
  })

  test('ln x + 1', () => {
    const { expression } = parser.parse('ln x + 1')
    expect(
      isSameStructure(expression, {
        className: 'Add',
        expr0: {
          className: 'Log',
          base: {
            className: 'NamedConstant',
            name: 'e',
          },
          expr: {
            className: 'Variable',
            name: 'x',
          },
        },
        expr1: {
          className: 'Constant',
          value: 1,
        },
      })
    )
  })

  test('log_x x', () => {
    const { expression } = parser.parse('log_x x')
    expect(
      isSameStructure(expression, {
        className: 'Log',
        base: {
          className: 'Variable',
          name: 'x',
        },
        expr: {
          className: 'Variable',
          name: 'x',
        },
      })
    )
  })

  test('(2}', () => {
    const { expression, error } = parser.parse('(2}')
    expect(expression).toBeUndefined()
    expect(error).toBeTruthy()
  })

  test('[0]', () => {
    const { expression } = parser.parse('[0]')
    expect(expression).toBe(CONSTANT_ZERO)
  })

  test('{1}', () => {
    const { expression } = parser.parse('{1}')
    expect(expression).toBe(CONSTANT_ONE)
  })
})
