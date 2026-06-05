import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import BackgroundCanvas from './components/background/BackgroundCanvas';
import CursorTrail from './components/cursor/CursorTrail';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Sections
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Education from './components/sections/Education';
import Leadership from './components/sections/Leadership';
import Certifications from './components/sections/Certifications';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';

function App() {
  return (
    <ThemeProvider>
      {/* z-index 0: fixed animated background */}
      <BackgroundCanvas />

      {/* z-index 9999: custom cursor + trail overlay */}
      <CursorTrail />

      {/* z-index 1: all page content */}
      <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main className="flex-1">
          <Hero />
          <About />
          <Education />
          <Leadership />
          <Certifications />
          <Projects />
          <Skills />
          <Contact />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
