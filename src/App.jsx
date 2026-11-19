import { useState } from 'react';
import AuthPage from './AuthPage.jsx';
import MemberDashboard from './MemberDashboard.jsx';
import {
  ArrowRight, BookOpen, Check, ChevronDown, Coins, Gift, Menu,
  ShieldCheck, Sparkles, Users, Wallet, X, Zap
} from 'lucide-react';

const benefits = [
  { icon: BookOpen, title: 'Discover useful reads', text: 'Explore engaging articles and reading activities selected for the community.' },
  { icon: Coins, title: 'Track your rewards', text: 'See eligible rewards and activity history clearly in your member dashboard.' },
  { icon: Users, title: 'Invite your community', text: 'Share your referral link and follow your referral activity in one place.' },
];

const steps = [
  ['01', 'Create your account', 'Register for free and set up your member profile.'],
  ['02', 'Read and participate', 'Complete available reading activities and follow their eligibility rules.'],
  ['03', 'Track your rewards', 'Review confirmed rewards, referrals and account activity in your dashboard.'],
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [authMode, setAuthMode] = useState(null);
  const [demoLoggedIn, setDemoLoggedIn] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const openLogin = (event) => { event?.preventDefault(); event?.stopPropagation(); setMenuOpen(false); setAuthMode('login'); };
  const openRegister = (event) => { event?.preventDefault(); event?.stopPropagation(); setMenuOpen(false); setAuthMode('register'); };

  if (demoLoggedIn) return <MemberDashboard onLogout={()=>setDemoLoggedIn(false)} />;
  if (authMode === "login" || authMode === "register") return <AuthPage key={authMode} mode={authMode} onMode={setAuthMode} onBack={()=>setAuthMode(null)} onDemoLogin={()=>{setDemoLoggedIn(true);setAuthMode(null);}} />;
  return (
    <div className="site-shell">
      <div className="announcement"><Sparkles size={14} /> A smarter way to make your reading time count <span>Explore ReadEarn <ArrowRight size={13} /></span></div>
      <header className="header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="ReadEarn home">
          <span className="brand-mark"><BookOpen size={22} strokeWidth={2.2} /></span>
          <span>Read<span className="brand-gold">Earn</span><small>READ. LEARN. GROW.</small></span>
        </a>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <a href="#how" onClick={closeMenu}>How it works</a>
          <a href="#benefits" onClick={closeMenu}>Why ReadEarn</a>
          <a href="#faq" onClick={closeMenu}>FAQs</a>
          <button type="button" className="nav-login auth-nav-button" onClick={openLogin}>Log in</button>
          <button type="button" className="button button-small" onClick={openRegister}>Create account <ArrowRight size={16} /></button>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span></span> WELCOME TO A NEW READING EXPERIENCE</div>
            <h1>Make every page<br /> <em>count.</em></h1>
            <p className="hero-text">Read interesting content, take part in activities and keep track of your rewards — all in one simple place.</p>
            <div className="hero-actions">
              <button type="button" className="button" onClick={openRegister}>Get started for free <ArrowRight size={18} /></button>
              <a className="text-link" href="#how">See how it works <span>↗</span></a>
            </div>
            <div className="hero-trust"><span className="trust-icons"><i><BookOpen size={14}/></i><i><ShieldCheck size={14}/></i><i><Users size={14}/></i></span><span>A community built around reading and growth</span></div>
          </div>
          <div className="hero-art">
            <div className="art-glow"></div>
            <div className="art-card art-card-back"></div>
            <div className="book-scene">
              <div className="book-top"><span>THE POWER OF</span><strong>KNOWLEDGE</strong><small>Every page opens a possibility.</small><div className="book-line"></div><BookOpen size={28}/></div>
              <div className="book-pages"></div>
            </div>
            <div className="floating-note note-one"><span className="note-icon"><BookOpen size={17}/></span><span><b>Read something new</b><small>Grow a little every day</small></span></div>
            <div className="floating-note note-two"><span className="coin-icon"><Coins size={18}/></span><span><b>Rewards overview</b><small>Clear activity tracking</small></span><Check className="note-check" size={16}/></div>
            <div className="sparkle sparkle-one">✦</div><div className="sparkle sparkle-two">✧</div>
          </div>
        </section>

        <section className="trust-strip">
          <div><ShieldCheck size={18}/><span>Clear activity records</span></div>
          <div><Wallet size={18}/><span>Reward tracking</span></div>
          <div><Users size={18}/><span>Community referrals</span></div>
          <div><Zap size={18}/><span>Simple member experience</span></div>
        </section>

        <section className="section-wrap benefits-section" id="benefits">
          <div className="section-heading"><div className="eyebrow centered">A BETTER WAY TO PARTICIPATE</div><h2>More than just reading.</h2><p>Everything you need to take part, stay informed and follow your progress.</p></div>
          <div className="benefit-grid">{benefits.map(({icon: Icon, title, text}, i) => <article className="benefit-card" key={title}><div className="benefit-icon"><Icon size={23}/></div><span className="card-number">0{i+1}</span><h3>{title}</h3><p>{text}</p><a href="#how">Learn more <ArrowRight size={15}/></a></article>)}</div>
        </section>

        <section className="how-section" id="how"><div className="section-wrap how-inner"><div className="how-intro"><div className="eyebrow">GETTING STARTED IS SIMPLE</div><h2>Your journey<br/>starts <em>here.</em></h2><p>Join the community and follow a clear process from registration to tracking your activity.</p><button type="button" className="button button-light" onClick={openRegister}>Join ReadEarn <ArrowRight size={17}/></button></div><div className="steps-list">{steps.map(([number,title,text]) => <div className="step" key={number}><div className="step-number">{number}</div><div><h3>{title}</h3><p>{text}</p></div><ArrowRight className="step-arrow" size={19}/></div>)}</div></div></section>

        <section className="faq-section section-wrap" id="faq"><div className="section-heading"><div className="eyebrow centered">GOOD TO KNOW</div><h2>Frequently asked questions</h2><p>Some quick answers about getting started with ReadEarn.</p></div><div className="faq-list">{[
          ['Is joining ReadEarn free?', 'Creating an account is free. Any activity with a reward will show its requirements and eligibility conditions before you participate.'],
          ['How do reading rewards work?', 'Rewards are tied to eligible activities and are subject to the rules displayed for each activity. Completed activities may need verification before a reward is confirmed.'],
          ['How do referrals work?', 'Your account will have a unique referral link. You can share it and view eligible referral activity from your dashboard.'],
          ['Can I withdraw my rewards?', 'Withdrawal options, minimum amounts and processing conditions will be displayed in your account once the wallet and payment features are enabled.']
        ].map(([q,a],i)=><div className={'faq-item '+(faqOpen===i?'faq-active':'')} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)}><span>{q}</span><ChevronDown size={19}/></button>{faqOpen===i&&<p>{a}</p>}</div>)}</div></section>

        <section className="cta-section section-wrap" id="get-started"><div className="cta-card"><div className="cta-decoration">✦</div><div className="eyebrow centered">YOUR NEXT CHAPTER STARTS NOW</div><h2>Ready to make your<br/><em>reading count?</em></h2><p>Create your free account and be part of the ReadEarn community.</p><button type="button" className="button" onClick={openRegister}>Get started <ArrowRight size={17}/></button><small>Free registration. Join the ReadEarn community today.</small></div></section>
      </main>

      <footer className="footer"><div className="section-wrap footer-inner"><a className="brand footer-brand" href="#home"><span className="brand-mark"><BookOpen size={21}/></span><span>Read<span className="brand-gold">Earn</span><small>READ. LEARN. GROW.</small></span></a><p>Make every page count.</p><div className="footer-bottom"><span>© {new Date().getFullYear()} ReadEarn. All rights reserved.</span><span>Built for readers, learners and curious minds.</span></div></div></footer>
    </div>
  );
}

export default App;