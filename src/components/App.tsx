import classNames from 'classnames/bind'
import styles from '../styles/app.module.css'
import tabStyles from '../styles/app-tab.module.css'
import MathTest from './math-test'
import BooleanTest from './boolean-test'
import Tab from './Tab'
import useQuery from '../hooks/useQuery'
import * as qs from 'query-string'
import { useEffect } from 'react'

const cx = classNames.bind(styles)

enum PageTab {
  MATH = 'math',
  BOOLEAN_ALGEBRA = 'boolean',
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

function extractPage(queries: qs.ParsedQuery): PageTab {
  switch (queries.page) {
    case PageTab.MATH:
    case PageTab.BOOLEAN_ALGEBRA:
      return queries.page
    default:
      return PageTab.MATH
  }
}

function App() {
  const { setQuery, queries } = useQuery()
  const page = extractPage(queries)

  function handleTabChange(page: PageTab) {
    setQuery('page', page)
  }

  useEffect(() => {
    setQuery('page', page)
  }, [])

  return (
    <>
      <div className={cx('header')}>
        <h1>Parser Heaven</h1>
      </div>

      <Tab<PageTab>
        entries={TAB_ENTRIES}
        onChange={handleTabChange}
        styles={tabStyles}
        defaultValue={page}
        value={page}
      />

      <div className={cx('content')}>
        {page === PageTab.MATH && <MathTest />}
        {page === PageTab.BOOLEAN_ALGEBRA && <BooleanTest />}
      </div>
    </>
  )
}

export default App
