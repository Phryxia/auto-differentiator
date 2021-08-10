import { useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from '../styles/tab.module.css'

const cx = classNames.bind(styles)

interface TabProps<T> {
  entries: {
    label: string
    value: T
  }[]
  defaultValue?: T
  onChange: (value: T) => void
}

export default function Tab<T = string>({
  entries,
  defaultValue,
  onChange,
}: TabProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T>(
    defaultValue ?? entries[0].value
  )

  useEffect(() => {
    onChange(selectedValue)
  }, [selectedValue])

  return (
    <div className={cx('container')}>
      {entries.map(({ label, value }) => (
        <button
          className={cx('entry', { selected: value === selectedValue })}
          onClick={() => setSelectedValue(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
