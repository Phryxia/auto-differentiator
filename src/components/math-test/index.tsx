import { useState } from 'react'
import Tab from '../Tab'
import EquivalenceTest from './equivalenceTest'
import ParserTest from './parserTest'

enum MathTestTab {
  PARSER,
  EQUIVALENCE_TEST,
}

const TAB_ENTRIES = [
  {
    label: 'Parser',
    value: MathTestTab.PARSER,
  },
]

export default function MathTest() {
  const [currentTab, setCurrentTab] = useState<MathTestTab>(MathTestTab.PARSER)

  return (
    <>
      <Tab<MathTestTab> entries={TAB_ENTRIES} onChange={setCurrentTab} />

      {currentTab === MathTestTab.PARSER && <ParserTest />}
      {currentTab === MathTestTab.EQUIVALENCE_TEST && <EquivalenceTest />}
    </>
  )
}
