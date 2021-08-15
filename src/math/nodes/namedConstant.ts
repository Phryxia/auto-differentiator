import {
  DEFAULT_OPTIMIZER_OPTION,
  Expression,
  OptimizerOption,
  Variables,
} from '../model'
import { CONSTANT_ZERO } from './constant'

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
export default class NamedConstant implements Expression {
  constructor(public readonly name: string, public readonly value: number) {}

  evaluate(variables: Variables) {
    return this.value
  }

  differentiate(variableName: string) {
    return CONSTANT_ZERO
  }

  optimize(
    option: Partial<OptimizerOption> = DEFAULT_OPTIMIZER_OPTION
  ): Expression {
    option = { ...DEFAULT_OPTIMIZER_OPTION, ...option }

    return this
  }

  isEquivalent(expression: Expression): boolean {
    return expression instanceof NamedConstant && this.name === expression.name
  }

  public static readonly E = new NamedConstant('e', Math.E)
  public static readonly PI = new NamedConstant('pi', Math.PI)
}
