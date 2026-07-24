import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="container">
        <p>&copy; {year} Xinlong Zhang. Built with curiosity.</p>
      </div>
    </footer>
  )
}
