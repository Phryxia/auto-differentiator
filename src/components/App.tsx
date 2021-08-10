import classNames from 'classnames/bind'
import styles from '../styles/app.module.css'
import tabStyles from '../styles/app-tab.module.css'
import MathTest from './math-test'
import { useState } from 'react'
import Tab from './Tab'

const cx = classNames.bind(styles)

enum PageTab {
  MATH,
  BOOLEAN_ALGEBRA,
}

const TAB_ENTRIES = [
  {
    label: 'Math',
    value: PageTab.MATH,
  },
  {
    label: 'Boolean Algebra',
    value: PageTab.BOOLEAN_ALGEBRA,
  },
]

function App() {
  const [page, setPage] = useState<PageTab>(PageTab.MATH)

  return (
    <>
      <div className={cx('header')}>
        <h1>Parser Heaven</h1>
      </div>

      <Tab<PageTab>
        entries={TAB_ENTRIES}
        onChange={setPage}
        styles={tabStyles}
      />

      <div className={cx('content')}>
        {page === PageTab.MATH && <MathTest />}
      </div>
    </>
  )
}

export default App
