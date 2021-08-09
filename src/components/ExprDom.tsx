import { ReactNode } from 'react'
import { Expression, isBinary } from '../parser/module/model'
import { Add, Sub } from '../parser/module/nodes/additive'
import { Mul, Div } from '../parser/module/nodes/multiplicative'
import Constant from '../parser/module/nodes/constant'
import NamedConstant from '../parser/module/nodes/namedConstant'
import Variable from '../parser/module/nodes/variable'
import Log from '../parser/module/nodes/log'
import Power from '../parser/module/nodes/power'
import '../styles/token.css'

function Wrap({
  isWrapped,
  children,
}: {
  isWrapped?: boolean
  children: ReactNode
}) {
  return isWrapped ? <>({children})</> : <>{children}</>
}

export default function ExprDom({ expr }: { expr: Expression }) {
  if (expr instanceof Constant)
    return <span className="token">{expr.value}</span>

  if (expr instanceof Variable || expr instanceof NamedConstant)
    return <span className="token">{expr.name}</span>

  if (expr instanceof Add)
    return (
      <span className="token">
        <ExprDom expr={expr.expr0} /> + <ExprDom expr={expr.expr1} />
      </span>
    )

  if (expr instanceof Sub)
    return (
      <span className="token">
        <ExprDom expr={expr.expr0} /> -{' '}
        <Wrap isWrapped={isBinary(expr.expr0)}>
          <ExprDom expr={expr.expr1} />
        </Wrap>
      </span>
    )

  if (expr instanceof Mul)
    return (
      <span className="token">
        <Wrap isWrapped={isBinary(expr.expr0)}>
          <ExprDom expr={expr.expr0} />
        </Wrap>{' '}
        *{' '}
        <Wrap isWrapped={isBinary(expr.expr0)}>
          <ExprDom expr={expr.expr1} />
        </Wrap>
      </span>
    )

  if (expr instanceof Div)
    return (
      <span className="token frac">
        <div>
          <ExprDom expr={expr.expr0} />
        </div>
        <hr />
        <div>
          <ExprDom expr={expr.expr1} />
        </div>
      </span>
    )

  if (expr instanceof Power)
    return (
      <span className="token pow">
        <Wrap isWrapped={isBinary(expr.expr0)}>
          <ExprDom expr={expr.expr0} />
        </Wrap>
        <span className="exponent">
          <ExprDom expr={expr.expr1} />
        </span>
      </span>
    )

  if (expr instanceof Log)
    return (
      <span className="token log">
        log_
        <span className="logbase">
          <ExprDom expr={expr.base} />
        </span>
        (<ExprDom expr={expr.expr} />)
      </span>
    )

  return (
    <span className="token">
      {expr.constructor.name.toLowerCase()}(
      <ExprDom expr={(expr as any).expr} />)
    </span>
  )
}
