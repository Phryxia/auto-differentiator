import { Expression } from '../model'
import {
  Constant,
  NamedConstant,
  Variable,
  Add,
  Sub,
  Mul,
  Div,
  Ln,
  Log,
  Power,
  Sqrt,
  Cos,
  Cot,
  Csc,
  Sec,
  Sin,
  Tan,
  Cosh,
  Coth,
  Csch,
  Sech,
  Sinh,
  Tanh,
} from '../nodes'

export enum TokenType {
  NUMBER = 'number',
  IDENTIFIER = 'identifier',
  OP_ADD = '+',
  OP_SUB = '-',
  OP_MUL = '*',
  OP_DIV = '/',
  OP_EXP = '^',
  UNDERBAR = '_',
  PARENTHESIS_LEFT = '(',
  PARENTHESIS_RIGHT = ')',
  UNKNOWN = '?',
}

export interface Token {
  content: string
  type: TokenType
  position: number
}

const FUNCTION_NAMES: string[] = [
  'ln',
  'log',
  'sin',
  'cos',
  'tan',
  'csc',
  'sec',
  'cot',
  'sinh',
  'cosh',
  'tanh',
  'csch',
  'sech',
  'coth',
  'sqrt',
]

const NAMED_CONSTANTS: string[] = ['e', 'pi']

function isDigit(c: string): boolean {
  return (
    '0'.charCodeAt(0) <= c.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0)
  )
}

function isAlphabet(c: string): boolean {
  const code = c.toLowerCase().charCodeAt(0)
  return 'a'.charCodeAt(0) <= code && code <= 'z'.charCodeAt(0)
}

function isWhitespace(c: string): boolean {
  return c === ' ' || c === '\t' || c === '\n'
}

export default class Parser {
  tokenize(str: string): { tokens: Token[]; warning: string } {
    let ptr = 0

    function getchar() {
      const result = str.charAt(ptr)
      ptr = Math.min(ptr + 1, str.length)
      return result
    }

    let c = ' '

    function lex(): Token {
      let content = ''

      while (isWhitespace(c)) {
        c = getchar()
      }

      // 숫자
      if (isDigit(c)) {
        const position = ptr - 1
        content += c
        c = getchar()

        while (isDigit(c)) {
          content += c
          c = getchar()
        }

        if (c === '.') {
          content += c
          c = getchar()

          while (isDigit(c)) {
            content += c
            c = getchar()
          }
        }

        if (c === 'e') {
          content += c
          c = getchar()

          if (c === '+' || c === '-') {
            content += c
            c = getchar()
          }

          while (isDigit(c)) {
            content += c
            c = getchar()
          }
        }

        return {
          content,
          type: TokenType.NUMBER,
          position,
        }
      }

      // Identifier
      if (isAlphabet(c)) {
        const position = ptr - 1
        content += c
        c = getchar()

        while (isAlphabet(c)) {
          content += c
          c = getchar()
        }

        return {
          content,
          type: TokenType.IDENTIFIER,
          position,
        }
      }

      // Operator
      if (c === '+') {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.OP_ADD,
          position,
        }
      }

      if (c === '-') {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.OP_SUB,
          position,
        }
      }

      if (c === '*') {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.OP_MUL,
          position,
        }
      }

      if (c === '/') {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.OP_DIV,
          position,
        }
      }

      if (c === '^') {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.OP_EXP,
          position,
        }
      }

      // 괄호
      if (c === '(' || c === '[' || c === '{') {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.PARENTHESIS_LEFT,
          position,
        }
      }

      if (c === ')' || c === ']' || c === '}') {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.PARENTHESIS_RIGHT,
          position,
        }
      }

      if (c === '_') {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.UNDERBAR,
          position,
        }
      }

      return {
        content: c,
        type: TokenType.UNKNOWN,
        position: ptr - 1,
      }
    }

    let tokens: Token[] = []
    let token = lex()
    let warning = ''

    while (token.type !== TokenType.UNKNOWN) {
      tokens.push(token)
      token = lex()
    }

    if (ptr < str.length) {
      warning = `Unexpected character ${str.charAt(ptr - 1)} has been found`
    }

    return {
      tokens,
      warning,
    }
  }

  //parse(str: string): Expression {}

  parse(str: string): {
    expression?: Expression
    warning?: string
    error?: string
  } {
    const { tokens, warning } = this.tokenize(str)

    let ptr = 0

    function getToken(): Token {
      const result = tokens[ptr] ?? {
        content: '',
        type: TokenType.UNKNOWN,
        position: -1,
      }
      ptr = Math.min(ptr + 1, tokens.length)
      return result
    }

    let token = getToken()
    /*
      Expr := Term | Expr '+' Term | Expr '-' Term
      Term := Expo | Term '*' Expo | Term '/' Expo
      Expo := Leaf | Leaf '^' Expo
      Leaf := number | identifier | '('Expr')' | identifier'('Expr')' | identifier_'('Expr')''('Expr')'
    */
    function parseExpr(): Expression {
      let lvalue = parseTerm()

      while (
        token.type === TokenType.OP_ADD ||
        token.type === TokenType.OP_SUB
      ) {
        const isAdd = token.type === TokenType.OP_ADD
        token = getToken()

        const rvalue = parseTerm()

        if (isAdd) {
          lvalue = new Add(lvalue, rvalue)
        } else {
          lvalue = new Sub(lvalue, rvalue)
        }
      }

      return lvalue
    }

    function parseTerm(): Expression {
      let lvalue = parseExpo()

      while (
        token.type === TokenType.OP_MUL ||
        token.type === TokenType.OP_DIV
      ) {
        const isMul = token.type === TokenType.OP_MUL
        token = getToken()

        const rvalue = parseExpo()

        if (isMul) {
          lvalue = new Mul(lvalue, rvalue)
        } else {
          lvalue = new Div(lvalue, rvalue)
        }
      }

      return lvalue
    }

    function parseExpo(): Expression {
      const base = parseUnary()

      if (token.type === TokenType.OP_EXP) {
        token = getToken()

        const expo = parseExpo()

        return new Power(base, expo)
      }

      return base
    }

    function parseUnary(): Expression {
      // 단항연산자
      let isMinus = false
      if (token.type === TokenType.OP_ADD || token.type === TokenType.OP_SUB) {
        isMinus = token.type === TokenType.OP_SUB
        token = getToken()
      }

      const expr = parseLeaf()

      if (isMinus) {
        if (expr instanceof Constant) {
          return new Constant(-expr.value)
        }
        return new Mul(new Constant(-1), expr)
      }
      return expr
    }

    function parseLeaf(): Expression {
      // 숫자
      if (token.type === TokenType.NUMBER) {
        const num = token.content
        token = getToken()
        return new Constant(parseFloat(num))
      }

      // 식별자
      if (token.type === TokenType.IDENTIFIER) {
        // 함수 이름인 경우
        if (FUNCTION_NAMES.includes(token.content)) {
          const functionName = token.content
          token = getToken()

          // 언더바 사용하는 특수한 함수들
          if (functionName === 'log' && token.type === TokenType.UNDERBAR) {
            token = getToken()

            const base = parseExpr()

            if (token.type === TokenType.PARENTHESIS_LEFT) {
              token = getToken()

              const expr = parseExpr()

              if (token.type === TokenType.PARENTHESIS_RIGHT) {
                token = getToken()
                return new Log(expr, base)
              }
              throw new Error(
                `[Parser.parse] Invalid token ${token.content} (type: ${token.type}), expect )`
              )
            }
            throw new Error(
              `[Parser.parse] Invalid token ${token.content} (type: ${token.type}), expect (`
            )
          }

          if (token.type === TokenType.PARENTHESIS_LEFT) {
            token = getToken()

            const expr = parseExpr()

            if (token.type === TokenType.PARENTHESIS_RIGHT) {
              token = getToken()

              switch (functionName) {
                case 'log':
                case 'ln':
                  return new Ln(expr)
                case 'sin':
                  return new Sin(expr)
                case 'cos':
                  return new Cos(expr)
                case 'tan':
                  return new Tan(expr)
                case 'csc':
                  return new Csc(expr)
                case 'sec':
                  return new Sec(expr)
                case 'cot':
                  return new Cot(expr)
                case 'sinh':
                  return new Sinh(expr)
                case 'cosh':
                  return new Cosh(expr)
                case 'tanh':
                  return new Tanh(expr)
                case 'csch':
                  return new Csch(expr)
                case 'sech':
                  return new Sech(expr)
                case 'coth':
                  return new Coth(expr)
                case 'sqrt':
                  return new Sqrt(expr)
                default:
                  throw new Error(
                    `[Parser.parse] Invalid token ${token.content} (type: ${token.type}), expect function name`
                  )
              }
            }
            throw new Error(
              `[Parser.parse] Invalid token ${token.content} (type: ${token.type}), expect )`
            )
          }
          throw new Error(
            `[Parser.parse] Invalid identifier ${functionName} which is reserved as function name`
          )
        }

        // 예약된 상수
        if (NAMED_CONSTANTS.includes(token.content)) {
          const constantName = token.content
          token = getToken()

          switch (constantName) {
            case 'e':
              return new NamedConstant(constantName, Math.E)
            case 'pi':
              return new NamedConstant(constantName, Math.PI)
          }
        }

        // 변수
        const variableName = token.content
        token = getToken()

        return new Variable(variableName)
      }

      // 괄호
      if (token.type === TokenType.PARENTHESIS_LEFT) {
        token = getToken()

        const expr = parseExpr()

        if (token.type === TokenType.PARENTHESIS_RIGHT) {
          token = getToken()

          return expr
        }
        throw new Error(
          `[Parser.parse] Invalid token ${token.content} (type: ${token.type}), expect )`
        )
      }
      throw new Error(
        `[Parser.parse] Invalid token ${token.content} (type: ${token.type}), expect (`
      )
    }

    try {
      return {
        expression: parseExpr(),
        warning: warning ? warning : undefined,
      }
    } catch (e: any) {
      return {
        warning: warning ? warning : undefined,
        error: e instanceof Error ? e.message : `${e}`,
      }
    }
  }
}
