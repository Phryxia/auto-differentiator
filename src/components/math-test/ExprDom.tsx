import classNames from 'classnames/bind'
import { ReactNode } from 'react'
import { Expression, isBinary } from '../../math/model'
import {
  Add,
  Constant,
  Div,
  Log,
  Mul,
  NamedConstant,
  Power,
  Sub,
  Variable,
} from '../../math/nodes'
import styles from '../../styles/tree.module.css'

const cx = classNames.bind(styles)

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
    return <span className={cx('token')}>{expr.value}</span>

  if (expr instanceof Variable || expr instanceof NamedConstant)
    return <span className={cx('token')}>{expr.name}</span>

  if (expr instanceof Add)
    return (
      <span className={cx('token')}>
        <ExprDom expr={expr.expr0} /> + <ExprDom expr={expr.expr1} />
      </span>
    )

  if (expr instanceof Sub)
    return (
      <span className={cx('token')}>
        <ExprDom expr={expr.expr0} /> -{' '}
        <Wrap isWrapped={isBinary(expr.expr0)}>
          <ExprDom expr={expr.expr1} />
        </Wrap>
      </span>
    )

  if (expr instanceof Mul)
    return (
      <span className={cx('token')}>
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
      <span className={cx('token', 'frac')}>
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
      <span className={cx('token', 'pow')}>
        <Wrap isWrapped={isBinary(expr.expr0)}>
          <ExprDom expr={expr.expr0} />
        </Wrap>
        <span className={cx('exponent')}>
          <ExprDom expr={expr.expr1} />
        </span>
      </span>
    )

  if (expr instanceof Log)
    return (
      <span className={cx('token', 'log')}>
        log_
        <span className={cx('logbase')}>
          <ExprDom expr={expr.base} />
        </span>
        (<ExprDom expr={expr.expr} />)
      </span>
    )

  return (
    <span className={cx('token')}>
      {expr.constructor.name.toLowerCase()}(
      <ExprDom expr={(expr as any).expr} />)
    </span>
  )
}
