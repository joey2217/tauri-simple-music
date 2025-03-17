import { mainWindow } from '@/lib/mainWindow'
import React, { useState } from 'react'
import ModeToggle from '@/components/mode-toggle'
import { Link } from 'react-router'

const minimize = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M3.755 12.5h16.492a.75.75 0 1 0 0-1.5H3.755a.75.75 0 0 0 0 1.5"
    ></path>
  </svg>
)

const maximize = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"
    ></path>
  </svg>
)

const restore = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
  >
    <g fill="currentColor">
      <path d="M5.085 4A1.5 1.5 0 0 1 6.5 3H10a3 3 0 0 1 3 3v3.5a1.5 1.5 0 0 1-1 1.415V6a2 2 0 0 0-2-2z"></path>
      <path d="M4.5 5h5A1.5 1.5 0 0 1 11 6.5v5A1.5 1.5 0 0 1 9.5 13h-5A1.5 1.5 0 0 1 3 11.5v-5A1.5 1.5 0 0 1 4.5 5m0 1a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"></path>
    </g>
  </svg>
)
const close = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
  >
    <path
      fill="currentColor"
      d="m2.089 2.216.057-.07a.5.5 0 0 1 .638-.057l.07.057L6 5.293l3.146-3.147a.5.5 0 1 1 .708.708L6.707 6l3.147 3.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057L6 6.707 2.854 9.854a.5.5 0 0 1-.708-.708L5.293 6 2.146 2.854a.5.5 0 0 1-.057-.638l.057-.07z"
    ></path>
  </svg>
)
const Header: React.FC = () => {
  const [max, setMax] = useState(true)
  return (
    <header className="titlebar">
      <div className="flex items-center h-full">
        <Link to="/">Music</Link>
        <div data-tauri-drag-region className="flex-1 h-full"></div>
        <ModeToggle />
        <div className="titlebar-button" onClick={mainWindow.minimize}>
          {minimize}
        </div>
        <div
          className="titlebar-button"
          onClick={() =>
            mainWindow.toggleMaximize().then(() => setMax((m) => !m))
          }
        >
          {max ? restore : maximize}
        </div>
        <div
          className="titlebar-button close-button"
          onClick={mainWindow.close}
        >
          {close}
        </div>
      </div>
    </header>
  )
}

export default Header
