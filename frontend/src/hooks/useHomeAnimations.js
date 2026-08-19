import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom Hook untuk mengisolasi dan mengelola seluruh animasi GSAP & ScrollTrigger halaman Home
 */
export function useHomeAnimations({
  containerRef,
  progressBarRef,
  visitorCountRef,
  artworkCountRef,
  zoneCountRef,
  freeCountRef,
  attendancesCount,
  artworksCount,
  currentLiveSession
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll untuk tombol Scroll-to-Top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inisialisasi animasi GSAP & ScrollTrigger (Berjalan 1x saat Mount)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 0. Top Scroll Progress Bar
      if (progressBarRef?.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2
          }
        });
      }

      // 1. Floating badges bounce & Parallax Scroll
      gsap.fromTo(
        '.hero-float-badge',
        { scale: 0, opacity: 0, rotation: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(2)',
          stagger: 0.2
        }
      );

      gsap.to('.hero-float-left', {
        y: 120,
        rotation: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section-box',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to('.hero-float-right', {
        y: 150,
        rotation: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section-box',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      // 2. Hero Headline Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-pill',
        { y: -30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 }
      )
        .fromTo(
          '.hero-title-main',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.3'
        )
        .fromTo(
          '.hero-tag-box',
          { scale: 0.5, rotation: -12, opacity: 0 },
          { scale: 1, rotation: -2, opacity: 1, duration: 0.6, ease: 'back.out(2.5)' },
          '-=0.4'
        )
        .fromTo(
          '.hero-desc',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.hero-meta-badge',
          { scale: 0.8, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, stagger: 0.12, duration: 0.5, ease: 'back.out(1.5)' },
          '-=0.3'
        )
        .fromTo(
          '.hero-cta-btn',
          { scale: 0.8, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'back.out(2)' },
          '-=0.2'
        )
        .fromTo(
          '.hero-scroll-hint',
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.2'
        );

      // 3. ScrollTrigger: Quick Metrics Bar & Number Counter Animation
      ScrollTrigger.create({
        trigger: '.metrics-bar-container',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.metric-card',
            { y: 40, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.12,
              duration: 0.6,
              ease: 'back.out(1.6)'
            }
          );

          if (visitorCountRef?.current) {
            gsap.fromTo(
              visitorCountRef.current,
              { innerText: 0 },
              {
                innerText: attendancesCount || 0,
                duration: 1.6,
                snap: { innerText: 1 },
                ease: 'power1.out'
              }
            );
          }
          if (artworkCountRef?.current) {
            gsap.fromTo(
              artworkCountRef.current,
              { innerText: 0 },
              {
                innerText: artworksCount || 0,
                duration: 1.4,
                snap: { innerText: 1 },
                ease: 'power1.out'
              }
            );
          }
          if (zoneCountRef?.current) {
            gsap.fromTo(
              zoneCountRef.current,
              { innerText: 0 },
              {
                innerText: 5,
                duration: 1.0,
                snap: { innerText: 1 },
                ease: 'power1.out'
              }
            );
          }
          if (freeCountRef?.current) {
            gsap.fromTo(
              freeCountRef.current,
              { innerText: 0 },
              {
                innerText: 100,
                duration: 1.2,
                snap: { innerText: 1 },
                ease: 'power1.out'
              }
            );
          }
        }
      });

      // 4. ScrollTrigger: Live Session Banner (Jika ada sesi aktif)
      if (currentLiveSession) {
        gsap.fromTo(
          '.live-banner-alert',
          { scale: 0.9, opacity: 0, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: '.live-banner-alert',
              start: 'top 85%'
            }
          }
        );
      }

      // 5. ScrollTrigger: Feature Cards Section (3D Pop on Scroll)
      gsap.fromTo(
        '.feature-section-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#section-features',
            start: 'top 80%'
          }
        }
      );

      gsap.fromTo(
        '.feature-card-item',
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.18,
          duration: 0.7,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: '#section-features',
            start: 'top 75%'
          }
        }
      );

      // 6. ScrollTrigger: Featured Masterpieces (Karya Unggulan)
      gsap.fromTo(
        '.artwork-section-header',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#section-artworks',
            start: 'top 80%'
          }
        }
      );

      gsap.fromTo(
        '.artwork-featured-card',
        { y: 50, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#section-artworks',
            start: 'top 75%'
          }
        }
      );

      // 7. ScrollTrigger: Denah Spotlight Section (Split reveal)
      gsap.fromTo(
        '.spotlight-left-col',
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#section-denah-spotlight',
            start: 'top 80%'
          }
        }
      );

      gsap.fromTo(
        '.spotlight-right-col',
        { x: 40, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '#section-denah-spotlight',
            start: 'top 80%'
          }
        }
      );

      // 8. ScrollTrigger: Call to Action Banner
      gsap.fromTo(
        '.cta-banner-box',
        { scale: 0.9, y: 40, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '#section-cta',
            start: 'top 85%'
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Update teks angka saat props berubah tanpa memicu ulang animasi GSAP
  useEffect(() => {
    if (visitorCountRef?.current && attendancesCount !== undefined) {
      visitorCountRef.current.innerText = attendancesCount;
    }
  }, [attendancesCount]);

  useEffect(() => {
    if (artworkCountRef?.current && artworksCount !== undefined) {
      artworkCountRef.current.innerText = artworksCount;
    }
  }, [artworksCount]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    showScrollTop,
    scrollToTop
  };
}
