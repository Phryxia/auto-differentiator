import { useState } from 'react'
import Tab from '../Tab'
import DifferentiationTest from './differentiationTest'
import EquivalenceTest from './equivalenceTest'
import OptimizationTest from './optimizationTest'
import ParserTest from './parserTest'

enum MathTestTab {
  PARSER,
  OPTIMIZATION_TEST,
  EQUIVALENCE_TEST,
  DIFFERENTIATION_TEST,
}

const TAB_ENTRIES = [
  {
    label: 'Parser',
    value: MathTestTab.PARSER,
  },
  {
    label: 'Optimization',
    value: MathTestTab.OPTIMIZATION_TEST,
  },
  {
    label: 'Equivalence',
    value: MathTestTab.EQUIVALENCE_TEST,
  },
  {
    label: 'Differentiation',
    value: MathTestTab.DIFFERENTIATION_TEST,
  },
]

export default function MathTest() {
  const [currentTab, setCurrentTab] = useState<MathTestTab>(MathTestTab.PARSER)

  return (
    <>
      <h1>Math Package</h1>
      <Tab<MathTestTab> entries={TAB_ENTRIES} onChange={setCurrentTab} />

      {currentTab === MathTestTab.PARSER && <ParserTest />}
      {currentTab === MathTestTab.OPTIMIZATION_TEST && <OptimizationTest />}
      {currentTab === MathTestTab.EQUIVALENCE_TEST && <EquivalenceTest />}
      {currentTab === MathTestTab.DIFFERENTIATION_TEST && (
        <DifferentiationTest />
      )}
    </>
  )
}
