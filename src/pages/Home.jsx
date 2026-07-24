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
                I'm a master's student at Tsinghua University's Shenzhen International Graduate School,
                where I research <strong>six-dimensional force sensors</strong> in electronic information engineering.
              </p>
              <p>
                I earned my B.S. in <strong>Measurement &amp; Control Technology and Instruments</strong> from
                Xiamen University, School of Aeronautics &amp; Astronautics (2021–2025). During my undergraduate
                studies, I was ranked 1st in my class and received:
              </p>
              <p>
                <strong>Scholarships:</strong> National Scholarship (top 3%), Luyan Scholarship (top 3%),
                BYD Scholarship (top 1%), Academic Excellence Scholarship, Academic Innovation Scholarship.
                <br />
                <strong>Honors:</strong> Outstanding Merit Student (top 3%), Outstanding Graduate,
                Outstanding Graduation Design.
              </p>
            </div>
            <Skills />
          </div>
        </div>
      </section>

      <section id="experience" className="section">
        <div className="container">
          <p className="section-label">Experience</p>
          <h2 className="section-title">My Journey</h2>
          <Experience />
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <p className="section-label">Projects</p>
          <h2 className="section-title">Things I've Built</h2>
          <Projects />
        </div>
      </section>

      <section id="blog" className="section">
        <div className="container">
          <p className="section-label">Blog</p>
          <h2 className="section-title">Recent Writing</h2>
          <BlogList limit={3} />
        </div>
      </section>
    </>
  )
}
