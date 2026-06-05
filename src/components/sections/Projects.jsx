import React from 'react';
import SectionTag from '../ui/SectionTag';
import RevealWrapper from '../ui/RevealWrapper';
import ProjectCard from '../ui/ProjectCard';
import projects from '../../data/projects';

const Projects = () => {
  return (
    <section id="projects">
      <div className="section-container">
        <RevealWrapper>
          <SectionTag number="05" label="Projects" />
          <h2 className="font-syne font-bold text-3xl mb-8" style={{ color: 'var(--text)' }}>
            Featured Projects
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={150}>
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
          >
            {projects.map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
};

export default Projects;
