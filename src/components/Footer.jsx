import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="container">
        <p>&copy; {year} Shannon. Built with curiosity.</p>
      </div>
    </footer>
  )
}
