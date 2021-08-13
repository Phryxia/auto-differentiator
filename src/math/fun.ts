import { Expression } from './model'
import {
  Add,
  Cos,
  Cosh,
  Cot,
  Coth,
  Csc,
  Csch,
  Div,
  Ln,
  Log,
  Mul,
  NamedConstant,
  Power,
  Sec,
  Sech,
  Sin,
  Sinh,
  Sub,
  Tan,
  Tanh,
  Variable,
} from './nodes'
import Constant, { CONSTANT_ONE } from './nodes/constant'

export function createRandomVariableName() {
  return 'x'
}

export function createRandomExpression(depthLimit: number): Expression {
  const seed = Math.random()

  if (depthLimit <= 0) {
    if (Math.random() < 0.5) {
      return new Variable(createRandomVariableName())
    }
    return new Constant(Math.floor(Math.random() * 128))
  }

  const diff = 1 / 22
  let threshold = diff
  if (seed < threshold) {
    return new Variable(createRandomVariableName())
  }
  threshold += diff

  if (seed < threshold) {
    return new Constant(Math.floor(Math.random() * 128))
  }
  threshold += diff

  if (seed < threshold) {
    return new Add(
      createRandomExpression(depthLimit - 1),
      createRandomExpression(depthLimit - 1)
    )
  }
  threshold += diff

  if (seed < threshold) {
    return new Sub(
      createRandomExpression(depthLimit - 1),
      createRandomExpression(depthLimit - 1)
    )
  }
  threshold += diff

  if (seed < threshold) {
    return new Mul(
      createRandomExpression(depthLimit - 1),
      createRandomExpression(depthLimit - 1)
    )
  }
  threshold += diff

  if (seed < threshold) {
    return new Div(
      createRandomExpression(depthLimit - 1),
      createRandomExpression(depthLimit - 1)
    )
  }
  threshold += diff

  if (seed < threshold) {
    return new Power(
      createRandomExpression(depthLimit - 1),
      createRandomExpression(depthLimit - 1)
    )
  }
  threshold += diff

  if (seed < threshold) {
    return new Log(
      createRandomExpression(depthLimit - 1),
      createRandomExpression(depthLimit - 1)
    )
  }
  threshold += diff

  if (seed < threshold) {
    return new Sin(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Cos(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Tan(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Csc(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Sec(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Cot(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Sinh(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Cosh(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Tanh(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Csch(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Sech(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Coth(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new Ln(createRandomExpression(depthLimit - 1))
  }
  threshold += diff

  if (seed < threshold) {
    return new NamedConstant('e', Math.E)
  }
  threshold += diff

  return CONSTANT_ONE
}
