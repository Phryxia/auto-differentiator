import { ConstantPool, Expression, OptimizerOption, Variables } from '../model'
import Constant from './constant'

/*
  pi나 e같은 것들을 표현하기 위함

  Constant, NamedConstant, Variable의 차이

  Constant는 자기들끼리의 연산을 optimize했을 때 자동으로 머지된다.
  NamedConstant는 Constant와 별개로 취급되어 머지되지 않는다.
  
  한편 Variable은 평가 시 값을 주입할 수 있다.
  NamedConstant는 값을 주입할 수 없다.

  NamedConstant는 변수가 아니기 때문에 미분하면 항상 0이다.
  NamedConstant가 점유하는 값은 외부 변수로도 사용 불가능하다.
*/
export default class NamedConstant extends Expression {
  constructor(public readonly name: string, public readonly value: number) {
    super()
  }

  evaluate(variables: Variables) {
    return this.value
  }

  differentiateConcrete(variableName: string, constantPool: ConstantPool) {
    return Constant.ZERO
  }

  optimizeConcrete(
    option: OptimizerOption,
    constantPool: ConstantPool
  ): Expression {
    return this
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof NamedConstant && this.name === expression.name
  }

  isOptimized(): boolean {
    return true
  }

  public static readonly E = new NamedConstant('e', Math.E)
  public static readonly PI = new NamedConstant('pi', Math.PI)
}
