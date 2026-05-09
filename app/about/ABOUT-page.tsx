import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main className="about-main">

        {/* ── Hero ── */}
        <section className="about-hero">
          <div className="about-hero-inner">
            <div className="about-photo-col">
              <div className="about-photo-wrap">
                <Image
                  src="/joe.webp"
                  alt="Joe Jennings"
                  width={380}
                  height={460}
                  priority
                  className="about-photo"
                />
              </div>
            </div>
            <div className="about-text-col">
              <span className="section-eyebrow">About Joe</span>
              <h1 className="about-headline">
                A secret fat kid who learned to cook for his goals.
              </h1>
              <p className="about-intro">
                I wanted a simple way to shop every week and hit my diet and fitness goals. I didn&apos;t find anything that was doing it — so I built the tool for myself.
              </p>
            </div>
          </div>
        </section>

        {/* ── Story ── */}
        <section className="about-story">
          <div className="about-story-inner">
            <div className="about-story-body">
              <p>
                Here&apos;s the honest version: I&apos;ve always loved food — not in a pretentious, &ldquo;I only eat locally sourced&rdquo; kind of way. More like the &ldquo;third slice of pizza at midnight&rdquo; kind of way. Which is fine, until you also care about how you look and feel.
              </p>
              <p>
                The problem I kept running into wasn&apos;t motivation. It was friction. Every Sunday I&apos;d stare at a blank fridge, try to remember my macros, make something up, forget to check if I had ingredients, and end up at Chipotle. Every week.
              </p>
              <p>
                I looked for apps that would just tell me what to eat and what to buy. There were plenty that would track what I already ate, but nothing that would plan it forward and hand me a shopping list. So I built one.
              </p>
              <blockquote className="about-quote">
                &ldquo;I believe your diet doesn&apos;t have to be stale, boring, and repetitive just because you want to look good.&rdquo;
              </blockquote>
              <p>
                Joe&apos;s MealMap started as a personal spreadsheet, turned into a side project, and eventually became something I thought might actually help other people. The database has 100 real meals — not rabbit food, not bro-science chicken-and-rice, but actual food worth eating.
              </p>
              <p>
                Every meal is built around your macros. Every shopping list is built around what you actually need for the week — real quantities, real stores, real prices. The goal is to make &ldquo;eating right&rdquo; something you do on autopilot, not something you have to think about every day.
              </p>
              <p>
                If you want to reach out, find a bug, or just tell me your favorite meal in the database — I&apos;d genuinely love to hear it.
              </p>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="about-values">
          <div className="section-inner">
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🍕</div>
                <h3>Food first</h3>
                <p>Good macros and good flavor aren&apos;t opposites. Every recipe in MealMap was chosen because it&apos;s actually worth eating.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🧮</div>
                <h3>Numbers that work</h3>
                <p>No guessing. Your macro targets drive everything — meal selection, shopping quantities, weekly budget. The math is always there.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🛒</div>
                <h3>End-to-end</h3>
                <p>Most tools stop at the meal plan. MealMap ends at the checkout line — complete shopping list, real quantities, Walmart links included.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🆓</div>
                <h3>Free, always</h3>
                <p>The planner is free and always will be. I built this for myself first — I&apos;m just happy it helps other people too.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="about-cta">
          <div className="about-cta-inner">
            <h2>Ready to plan your week?</h2>
            <p>Takes about 3 minutes. No account required.</p>
            <Link href="/" className="btn-primary">Open the Planner →</Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-logo">Joe&apos;s MealMap</div>
            <div className="footer-links">
              <Link href="/home">Home</Link>
              <Link href="/recipes">Recipes</Link>
              <Link href="/">Planner</Link>
              <Link href="/about">About</Link>
            </div>
            <p className="footer-copy">
              © {new Date().getFullYear()} Joe&apos;s MealMap. Built by Joe Jennings.
            </p>
          </div>
        </footer>

      </main>
    </>
  );
}
