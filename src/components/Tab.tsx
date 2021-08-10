import { useState } from 'react'

interface TabProps<T> {
  entries: {
    label: string
    value: T
  }[]
  defaultValue?: T
}

export default function Tab<T = string>({
  entries,
  defaultValue,
}: TabProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T>(
    defaultValue ?? entries[0].value
  )

  return (
    <>
      {entries.map(({ label, value }) => (
        <button onClick={() => setSelectedValue(value)}>{label}</button>
      ))}
    </>
  )
}
