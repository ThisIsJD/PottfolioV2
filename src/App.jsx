import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import BackgroundCanvas from './components/background/BackgroundCanvas';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <ThemeProvider>
      {/* Canvas is fixed at z-index 0, behind everything */}
      <BackgroundCanvas />

      <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        {/* Main content — pt-20 offsets the fixed 80px navbar */}
        <main className="flex-1 pt-20">
          <div className="section-container text-center mt-20">
            <h1
              className="font-syne font-bold text-4xl mb-4 gradient-text animate-fade-up delay-100"
            >
              Phase 2 — Background Animations ✓
            </h1>
            <p
              className="text-lg animate-fade-up delay-200"
              style={{ color: 'var(--muted)' }}
            >
              Dark mode = galaxy + shooting stars. Light mode = connected particle field.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
