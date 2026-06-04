import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { initParticleField } from './ParticleField';
import { initGalaxyField } from './GalaxyField';

/**
 * BackgroundCanvas — fixed full-screen canvas behind all content.
 *
 * - Sits at z-index 0 (position: fixed)
 * - Switches animation on theme change
 * - Handles window resize (debounced)
 * - Cleans up RAF on unmount
 */
const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const cancelRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const initAnimation = () => {
      // Cancel any running animation loop before starting a new one
      if (cancelRef.current) {
        cancelRef.current();
        cancelRef.current = null;
      }

      // Resize canvas to fill the viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Clear before starting new animation
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Launch the correct animation based on current theme
      if (theme === 'dark') {
        cancelRef.current = initGalaxyField(canvas, ctx);
      } else {
        cancelRef.current = initParticleField(canvas, ctx);
      }
    };

    // Debounced resize handler
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAnimation, 150);
    };

    initAnimation();
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount or theme change
    return () => {
      if (cancelRef.current) cancelRef.current();
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none', // let clicks pass through to content
      }}
      aria-hidden="true"
    />
  );
};

export default BackgroundCanvas;
