import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Main Content Area */}
        {/* Padding top is needed so content isn't hidden behind the fixed Navbar (h-20 = 5rem = 80px) */}
        <main className="flex-1 pt-20">
          <div className="section-container text-center mt-20">
            <h1 className="font-syne font-bold text-4xl mb-4 gradient-text animate-fade-up delay-100">
              Phase 1 — Theme System Complete
            </h1>
            <p className="text-lg animate-fade-up delay-200" style={{ color: 'var(--muted)' }}>
              Toggle the theme using the button in the Navbar.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
