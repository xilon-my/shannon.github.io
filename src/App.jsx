import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: 12 }}>404</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Page not found. <a href="/">Go home</a>
        </p>
      </div>
    </section>
  )
}
