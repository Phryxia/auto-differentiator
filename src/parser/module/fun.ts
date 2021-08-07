import { Expression } from './model'
import Add from './nodes/add'
import Constant from './nodes/constant'
import Div from './nodes/div'
import { Cosh, Coth, Csch, Sech, Sinh, Tanh } from './nodes/hyperTrigonometric'
import Ln from './nodes/ln'
import Log from './nodes/log'
import Mul from './nodes/mul'
import NamedConstant from './nodes/namedConstant'
import Power from './nodes/power'
import Sqrt from './nodes/sqrt'
import Sub from './nodes/sub'
import { Cos, Cot, Csc, Sec, Sin, Tan } from './nodes/trigonometric'
import Variable from './nodes/variable'
import { CONSTANT_ONE } from './util'

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

  const diff = 1 / 23
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
    return new Sqrt(createRandomExpression(depthLimit - 1))
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
