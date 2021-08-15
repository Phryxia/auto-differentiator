import { Expression } from '../model'
import {
  Constant,
  NamedConstant,
  Variable,
  Add,
  Sub,
  Mul,
  Div,
  Log,
  Power,
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
import { CONSTANT_ZERO } from '../nodes/constant'

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
  EOF = 'EOF',
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

    let c = getchar()

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
      if (c && '+-*/^'.includes(c)) {
        const position = ptr - 1
        content += c

        let type: TokenType
        if (c === '+') type = TokenType.OP_ADD
        else if (c === '-') type = TokenType.OP_SUB
        else if (c === '*') type = TokenType.OP_MUL
        else if (c === '/') type = TokenType.OP_DIV
        else type = TokenType.OP_EXP

        c = getchar()

        return {
          content,
          type,
          position,
        }
      }

      // 괄호
      if (c && '({['.includes(c)) {
        const position = ptr - 1
        content += c
        c = getchar()

        return {
          content,
          type: TokenType.PARENTHESIS_LEFT,
          position,
        }
      }

      if (c && ')}]'.includes(c)) {
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

      const dummy = c
      const position = ptr - 1
      c = getchar()

      return {
        content: dummy,
        type: !dummy ? TokenType.EOF : TokenType.UNKNOWN,
        position,
      }
    }

    let tokens: Token[] = []
    let token = lex()
    let warning = ''

    while (token.type !== TokenType.EOF) {
      if (token.type === TokenType.UNKNOWN) {
        warning += `[MathParser.tokenize] Unknown character ${
          token.content
        } will be ignored.\n${str}\n${' '.repeat(token.position)}^\n\n`
      } else {
        tokens.push(token)
      }
      token = lex()
    }

    return {
      tokens,
      warning,
    }
  }

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
        type: TokenType.EOF,
        position: -1,
      }
      ptr = Math.min(ptr + 1, tokens.length)
      return result
    }

    let token = getToken()

    function throwError(name: string, expected: string) {
      if (token.type === TokenType.EOF) {
        throw new Error(
          `[${name}] Token ends unexpectedly, expected ${expected}\n${str}\n${' '.repeat(
            str.length
          )}^\n`
        )
      }
      throw new Error(
        `[${name}] Unexpected token '${token.content}'(type: ${
          token.type
        }), expected ${expected}\n${str}\n${' '.repeat(token.position)}^\n`
      )
    }
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

            const base = parseLeaf()
            const expr = parseLeaf()
            return new Log(expr, base)
          }

          const expr = parseLeaf()

          switch (functionName) {
            case 'log':
            case 'ln':
              return new Log(expr, NamedConstant.E)
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
              return new Power(expr, new Constant(0.5))
            default:
              throwError(
                'MathParser.parse',
                'nothing (this is unrechable code)'
              )
          }
        }

        // 예약된 상수
        if (NAMED_CONSTANTS.includes(token.content)) {
          const constantName = token.content
          token = getToken()

          switch (constantName) {
            case 'e':
              return NamedConstant.E
            case 'pi':
              return NamedConstant.PI
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
        throwError('MathParser.parse', ')')
      }
      throwError('MathParser.parse', 'identifier or (')

      // Unrechable Code
      return CONSTANT_ZERO
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
