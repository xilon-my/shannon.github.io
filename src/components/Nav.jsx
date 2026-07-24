import { NavLink } from 'react-router-dom'
import './Nav.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
]

export default function Nav() {
  return (
    <nav>
      <div className="container">
        <NavLink to="/" className="logo">Xinlong</NavLink>
        <ul>
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'}>{l.label}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
