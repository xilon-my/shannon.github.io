import Hero from '../components/Hero.jsx'
import Skills from '../components/Skills.jsx'
import Experience from '../components/Experience.jsx'
import Projects from '../components/Projects.jsx'
import BlogList from '../components/BlogList.jsx'

export default function Home() {
  return (
    <>
      <Hero />

      <section id="about" className="section">
        <div className="container">
          <p className="section-label">About</p>
          <h2 className="section-title">Who I Am</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                I&apos;m a software engineer passionate about building systems that are both elegant and practical.
                I work across the stack — from designing resilient backends to crafting interfaces people enjoy using.
              </p>
              <p>
                Outside of code, I love diving into distributed systems, developer tooling, and open-source.
                I believe the best tools feel invisible, and the best code is a pleasure to read.
              </p>
            </div>
            <Skills />
          </div>
        </div>
      </section>

      <section id="experience" className="section">
        <div className="container">
          <p className="section-label">Experience</p>
          <h2 className="section-title">Where I&apos;ve Worked</h2>
          <Experience />
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <p className="section-label">Projects</p>
          <h2 className="section-title">Things I&apos;ve Built</h2>
          <Projects />
        </div>
      </section>

      <section id="blog" className="section">
        <div className="container">
          <p className="section-label">Blog</p>
          <h2 className="section-title">Recent Writing</h2>
          <BlogList />
        </div>
      </section>
    </>
  )
}
