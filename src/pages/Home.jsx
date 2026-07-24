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
                I'm a master's student at Tsinghua University, where I study electronic information
                engineering at the Shenzhen International Graduate School. My research spans large language
                models, multimodal AI, and intelligent instrumentation systems.
              </p>
              <p>
                I hold a B.S. from Xiamen University (ranked 1/35), with a National Scholarship and awards
                including the RoboCup China Open champion and National College Math Contest prize. I've
                published research in Polymer Composites and hold a national invention patent.
              </p>
              <p>
                Outside of research, I enjoy building AI systems end-to-end — from training LLMs to
                deploying RAG pipelines and CLI agents. I also run half marathons (PB: 1:56:08)
                and love cycling and hiking.
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
