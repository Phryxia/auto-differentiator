import { useState } from 'react'
import Tab from '../Tab'
import ParserTest from './parserTest'

enum BooleanTestTab {
  PARSER,
  EQUIVALENCE_TEST,
}

const TAB_ENTRIES = [
  {
    label: 'Parser',
    value: BooleanTestTab.PARSER,
  },
  {
    label: 'Equivalence Test',
    value: BooleanTestTab.EQUIVALENCE_TEST,
  },
]

export default function BooleanTest() {
  const [currentTab, setCurrentTab] = useState<BooleanTestTab>(
    BooleanTestTab.PARSER
  )

  return (
    <>
      <h1>Boolean Algebra Package</h1>
      <Tab<BooleanTestTab> entries={TAB_ENTRIES} onChange={setCurrentTab} />

      {currentTab === BooleanTestTab.PARSER && <ParserTest />}
      {/* {currentTab === BooleanTestTab.EQUIVALENCE_TEST && <EquivalenceTest />} */}
    </>
  )
}
