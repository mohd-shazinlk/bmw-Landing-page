"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useEffect } from "react";

const FadeInText = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-10%" }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Hero sequence frame logic
  const { scrollYProgress: heroScrollY } = useScroll({ target: heroRef, offset: ["start start", "end end"] });

  useMotionValueEvent(heroScrollY, "change", (latest) => {
    let nextFrame = Math.max(1, Math.min(240, Math.floor(latest * 240) + 1));
    const canvas = canvasRef.current;
    const img = imagesRef.current[nextFrame];
    if (canvas && img) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  });

  // Preload frames for extremely smooth scrolling
  useEffect(() => {
    const preloadFrames = async () => {
      // Preload in batches of 30 to prevent network bottlenecking
      for (let i = 1; i <= 240; i += 30) {
        const promises: Promise<unknown>[] = [];
        for (let j = i; j < i + 30 && j <= 240; j++) {
          const frameStr = String(j).padStart(3, '0');
          const url = `/images/herosection/ezgif-frame-${frameStr}.png`;
          promises.push(
            new Promise((resolve) => {
              const img = new window.Image();
              img.src = url;
              img.onload = () => {
                imagesRef.current[j] = img;
                // Draw first frame safely on load
                if (j === 1 && canvasRef.current) {
                  const ctx = canvasRef.current.getContext("2d");
                  ctx?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
                resolve(null);
              };
              img.onerror = resolve;
            })
          );
        }
        await Promise.all(promises);
      }
    };
    preloadFrames();
  }, []);

  // Text 1: The Next Evolution (Top Left)
  const text1Opacity = useTransform(heroScrollY, [0, 0.15, 0.25], [1, 1, 0]);
  const text1Y = useTransform(heroScrollY, [0, 0.15, 0.25], [0, 0, -30]);

  // Text 2: Aerodynamically Perfected (Bottom Right)
  const text2Opacity = useTransform(heroScrollY, [0.25, 0.35, 0.5, 0.6], [0, 1, 1, 0]);
  const text2Y = useTransform(heroScrollY, [0.25, 0.35, 0.5, 0.6], [30, 0, 0, -30]);

  // Text 3: Power without Compromise (Bottom Left)
  const text3Opacity = useTransform(heroScrollY, [0.6, 0.7, 0.85, 0.95], [0, 1, 1, 0]);
  const text3Y = useTransform(heroScrollY, [0.6, 0.7, 0.85, 0.95], [30, 0, 0, -30]);

  const endHeroOpacity = useTransform(heroScrollY, [0.95, 1], [1, 0]);

  return (
    <div ref={containerRef} className="bg-black text-white font-sans selection:bg-blue-500/30 w-full min-h-[300vh]">

      {/* Navigation */}
      <nav className="fixed top-0 z-50 flex items-center justify-between px-8 md:px-16 py-6 w-full mix-blend-difference bg-transparent backdrop-blur-md border-b border-white/5 transition-all">
        <div className="text-xl font-bold tracking-[0.2em] text-white uppercase italic">
          VELOCITY<span className="text-gray-400 font-light">MOTORS</span>
        </div>
        <div className="hidden md:flex gap-12 text-xs font-medium tracking-[0.2em] text-gray-300 uppercase">
          <a href="#" className="hover:text-white transition-colors">Vision</a>
          <a href="#" className="hover:text-white transition-colors">Design</a>
          <a href="#" className="hover:text-white transition-colors">Performance</a>
        </div>
      </nav>

      {/* 1. Hero Image Sequence Section */}
      <div ref={heroRef} className="h-[400vh] relative w-full">
        <motion.div 
          className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-black"
          style={{ opacity: endHeroOpacity }}
        >
          {/* Hardware accelerated canvas for 0-latency frame drawing */}
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-black pointer-events-none">
             <canvas 
               ref={canvasRef}
               width={1920}
               height={1080}
               className="w-full h-full object-cover object-center scale-[1.03]"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
            
            {/* Feature 1 - Top Left */}
            <motion.div 
              style={{ opacity: text1Opacity, y: text1Y }} 
              className="absolute top-[20vh] left-8 md:left-24 flex flex-col items-start pointer-events-none text-left"
            >
              <div className="text-blue-400 text-xs font-semibold tracking-[0.3em] mb-3 uppercase drop-shadow-md">
                The Next Evolution
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-xl mb-4 leading-tight">
                Form Meets Function.
              </h1>
              <p className="text-sm md:text-base text-gray-300 font-light max-w-sm drop-shadow-lg leading-relaxed">
                Experience a perfectly balanced aerodynamic silhouette designed to turn heads and cut through the wind.
              </p>
            </motion.div>

            {/* Feature 2 - Bottom Right */}
            <motion.div 
              style={{ opacity: text2Opacity, y: text2Y }} 
              className="absolute bottom-[20vh] right-8 md:right-24 flex flex-col items-end pointer-events-none text-right"
            >
              <div className="text-blue-400 text-xs font-semibold tracking-[0.3em] mb-3 uppercase drop-shadow-md">
                Precision Design
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-xl mb-4 leading-tight">
                Aerodynamically <br /> Perfected.
              </h2>
              <p className="text-sm md:text-base text-gray-300 font-light max-w-sm drop-shadow-lg leading-relaxed">
                Every line and curve carefully sculpted to manipulate air flow, minimize drag, and maximize battery efficiency.
              </p>
            </motion.div>

            {/* Feature 3 - Bottom Left */}
            <motion.div 
              style={{ opacity: text3Opacity, y: text3Y }} 
              className="absolute bottom-[20vh] left-8 md:left-24 flex flex-col items-start pointer-events-none text-left"
            >
              <div className="text-blue-400 text-xs font-semibold tracking-[0.3em] mb-3 uppercase drop-shadow-md">
                Unbridled Performance
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-xl mb-4 leading-tight">
                Power without <br /> Compromise.
              </h2>
              <p className="text-sm md:text-base text-gray-300 font-light max-w-sm drop-shadow-lg leading-relaxed">
                Pure, instantaneous electric power delivering an unforgettable driving sensation the moment you touch the pedal.
              </p>
            </motion.div>

          </div>
          
          <div className="absolute bottom-8 w-full flex flex-col items-center gap-4 text-gray-400">
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/50">Scroll sequence</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent animate-pulse"></div>
          </div>
        </motion.div>
      </div>

      {/* 2. Detail Section - Typography Heavy (Apple Style) */}
      <section className="min-h-screen py-32 flex items-center bg-black relative z-10">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <FadeInText className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-12 text-neutral-500">
            It’s not just an electric car. <br />
            <span className="text-neutral-100">It’s a declaration of power.</span>
          </FadeInText>

          <FadeInText delay={0.1} className="text-xl md:text-3xl text-neutral-400 font-light leading-relaxed max-w-4xl">
            Engineered with microscopic precision, the aerodynamic drag coefficient is cut by 25%. Meaning you cut through the wind without making a sound.
          </FadeInText>

          <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { label: "0-60 mph", value: "2.9s", desc: "Mind-bending acceleration via dual liquid-cooled electric motors." },
              { label: "Horsepower", value: "620", desc: "Peak torque instantly available off the line, anytime." },
              { label: "Range", value: "380mi", desc: "Next-gen solid state battery architecture for marathon coverage." }
            ].map((stat, i) => (
              <FadeInText key={i} delay={i * 0.1}>
                <div className="border-t border-white/20 pt-8">
                  <h3 className="text-neutral-500 uppercase tracking-[0.2em] text-xs font-bold mb-6">{stat.label}</h3>
                  <div className="text-6xl font-extrabold text-white mb-4 tracking-tighter">{stat.value}</div>
                  <p className="text-base text-neutral-400 leading-relaxed max-w-[250px]">{stat.desc}</p>
                </div>
              </FadeInText>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Immersive Detail Section */}
      <section className="min-h-[120vh] relative flex items-center justify-center overflow-hidden py-32">
        <div className="absolute inset-0 opacity-40">
          <Image src="/bmw.png" alt="Detail" fill className="object-cover blur-3xl scale-125 saturate-150" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center mt-[-10vh]">
          <FadeInText className="text-blue-400 text-xs md:text-sm font-semibold tracking-[0.5em] mb-8 uppercase">Design Language</FadeInText>
          <FadeInText delay={0.1} className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-tight mb-10">
            Sculpted by <br /> aerodynamics.
          </FadeInText>
          <FadeInText delay={0.2} className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed mb-16 max-w-3xl mx-auto">
            Every curve, every air intake, and the sleek kidney grille are designed specifically to channel air efficiency and provide maximum cooling to the ultra-performance battery pack.
          </FadeInText>
        </div>
      </section>

      {/* 4. Pricing / CTA Section */}
      <section className="min-h-screen py-32 bg-zinc-950 flex flex-col justify-center border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <FadeInText>
              <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-8">
                Your Next<br />Chapter.
              </h2>
            </FadeInText>
            <FadeInText delay={0.1}>
              <p className="text-2xl text-neutral-400 font-light mb-16">
                Order today and be among the exclusive few to experience the pinnacle of luxury driving.
              </p>
            </FadeInText>
            <FadeInText delay={0.2}>
              <div className="space-y-6 mb-16">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-lg text-neutral-400">Base MSRP</span>
                  <span className="text-3xl text-white font-medium">$145,200</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-lg text-neutral-400">Est. Monthly</span>
                  <span className="text-3xl text-white font-medium">$1,890 <span className="text-xl text-neutral-500 font-light">/ mo</span></span>
                </div>
              </div>
            </FadeInText>
            <FadeInText delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="px-12 py-6 bg-white text-black font-semibold uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-transform duration-300 shrink-0 shadow-xl">
                  Configure Now
                </button>
                <button className="px-12 py-6 bg-transparent border border-white/30 text-white font-semibold uppercase tracking-[0.2em] text-sm hover:border-white transition-colors shrink-0">
                  Compare Trims
                </button>
              </div>
            </FadeInText>
          </div>

          <div className="relative aspect-square w-full">
            <FadeInText delay={0.4} className="h-full w-full">
              <div className="relative h-[80%] my-auto w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black group transition-all duration-700 hover:scale-[1.02] hover:shadow-blue-900/20 hover:shadow-2xl">
                <Image src="/bmw.png" alt="BMW Config" fill className="object-cover scale-[1.7] right-[-30%] object-[75%_center] group-hover:scale-[1.75] transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent"></div>
              </div>
            </FadeInText>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 text-center text-sm text-neutral-500 uppercase tracking-widest bg-zinc-950">
        Velocity Motors © 2026. All rights reserved.
      </footer>
    </div>
  );
}
