import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import defaultStyles from '../styles/tab.module.css'

let cx: any

interface TabProps<T> {
  entries: {
    label: string
    value: T
  }[]
  defaultValue?: T
  onChange: (value: T) => void
  styles?: { [key: string]: string }
}

export default function Tab<T = string>({
  entries,
  defaultValue,
  onChange,
  styles = defaultStyles,
}: TabProps<T>) {
  cx = classNames.bind(styles)

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
          key={label}
          className={cx('entry', { selected: value === selectedValue })}
          onClick={() => setSelectedValue(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
