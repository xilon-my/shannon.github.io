import { NavLink } from 'react-router-dom'
import './Nav.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/cv', label: 'CV' },
  { to: '/blog', label: 'Blog' },
  { to: '/write', label: 'Write' },
]

export default function Nav({ theme, onToggleTheme }) {
  return (
    <nav>
      <div className="container">
        <NavLink to="/" className="logo">shannon</NavLink>
        <div className="nav-right">
          <ul>
            {links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
          <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </nav>
  )
}
