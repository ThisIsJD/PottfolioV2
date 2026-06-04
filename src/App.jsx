import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import BackgroundCanvas from './components/background/BackgroundCanvas';
import CursorTrail from './components/cursor/CursorTrail';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

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

        <main className="flex-1 pt-20">
          <div className="section-container text-center mt-20">
            <h1 className="font-syne font-bold text-4xl mb-4 gradient-text animate-fade-up delay-100">
              Phase 3 — Custom Cursor ✓
            </h1>
            <p className="text-lg animate-fade-up delay-200" style={{ color: 'var(--muted)' }}>
              Move your mouse to see the glowing cursor + trail.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
