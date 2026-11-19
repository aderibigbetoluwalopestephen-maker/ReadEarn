import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, LayoutDashboard, Wallet, Users, Gift, Bell, UserRound,
  LogOut, Menu, X, Search, Clock3, CheckCircle2, ArrowUpRight,
  Copy, Coins, TrendingUp, CircleHelp, Settings, ChevronRight,
  FileText, BadgeCheck, CalendarDays, ShieldCheck, ListChecks, Flame
} from 'lucide-react';

const starterArticles = [
  { id: 1, category: 'Personal growth', title: 'The Power of Building a Daily Reading Habit', excerpt: 'Small, consistent reading sessions can strengthen focus, build knowledge and create room for new ideas.', minutes: 4, reward: 50 },
  { id: 2, category: 'Technology', title: 'How Digital Skills Are Changing the Future of Work', excerpt: 'Explore the practical digital skills that help people learn, collaborate and adapt in a changing world.', minutes: 5, reward: 60 },
  { id: 3, category: 'Education', title: 'Learning Beyond the Classroom', excerpt: 'Discover simple ways to keep learning through articles, curiosity and everyday experiences.', minutes: 3, reward: 40 },
  { id: 4, category: 'Money matters', title: 'Simple Habits for Better Money Management', excerpt: 'Understand budgeting basics and build healthier habits around saving and spending.', minutes: 5, reward: 60 }
];
const navItems = [
  ['Overview', LayoutDashboard], ['Daily Tasks', ListChecks], ['Read & Earn', BookOpen], ['My Referrals', Users],
  ['My Wallet', Wallet], ['Withdrawals', ArrowUpRight], ['Notifications', Bell], ['My Profile', UserRound]
];
const money = n => '₦' + Number(n || 0).toLocaleString('en-NG');
const dailyTaskTemplates = [
  { id: 'read-one', title: 'Complete a reading activity', description: 'Read an article in the Read & Earn section.', reward: 50, icon: BookOpen },
  { id: 'learn-more', title: 'Spend time learning', description: 'Spend at least 10 minutes exploring learning content.', reward: 30, icon: Flame },
  { id: 'share-link', title: 'Share your referral link', description: 'Share your personal invitation link with someone.', reward: 20, icon: Users },
  { id: 'check-wallet', title: 'Review your wallet', description: 'Visit your wallet and review your rewards.', reward: 10, icon: Wallet }
];
const lagosDateKey = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export default function MemberDashboard({ onLogout, initialMember }) {
  const memberId = (initialMember?.email || 'testing@gmail.com').trim().toLowerCase();
  const storageKey = key => 're_demo_' + memberId + '_' + key;
  const [active, setActive] = useState('Overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem(storageKey('completed')) || '[]'));
  const [balance, setBalance] = useState(() => Number(localStorage.getItem(storageKey('balance')) || 0));
  const [withdrawals, setWithdrawals] = useState(() => JSON.parse(localStorage.getItem(storageKey('withdrawals')) || '[]'));
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem(storageKey('profile')) || JSON.stringify({name:initialMember?.name||'Testing Member',phone:initialMember?.phone||'',email:memberId,bank:'',account:''})));
  const todayKey = lagosDateKey();
  const dailyStorageKey = storageKey('daily_' + todayKey);
  const [dailyCompleted, setDailyCompleted] = useState(() => JSON.parse(localStorage.getItem(dailyStorageKey) || '[]'));
  const [notice, setNotice] = useState('');
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', bank: '', account: '', name: '' });
  const referralLink = 'https://read-earn.vercel.app/register?ref=TESTING';

  useEffect(() => { localStorage.setItem(storageKey('completed'), JSON.stringify(completed)); }, [completed]);
  useEffect(() => { localStorage.setItem(storageKey('balance'), String(balance)); }, [balance]);
  useEffect(() => { localStorage.setItem(storageKey('withdrawals'), JSON.stringify(withdrawals)); }, [withdrawals]);
  useEffect(() => { localStorage.setItem(storageKey('profile'), JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem(dailyStorageKey, JSON.stringify(dailyCompleted)); }, [dailyCompleted, dailyStorageKey]);

  const earned = useMemo(() => completed.reduce((sum, id) => sum + (starterArticles.find(a => a.id === id)?.reward || 0), 0), [completed]);
  const filtered = starterArticles.filter(a => (a.title + a.category + a.excerpt).toLowerCase().includes(search.toLowerCase()));
  const toast = msg => { setNotice(msg); window.setTimeout(() => setNotice(''), 3000); };
  const completeDailyTask = task => {
    if (dailyCompleted.includes(task.id)) return toast('You have already completed this task today.');
    setDailyCompleted(prev => [...prev, task.id]);
    setBalance(prev => prev + task.reward);
    toast(money(task.reward) + ' demo daily-task reward added to your wallet.');
  };
  const completeArticle = article => {
    if (completed.includes(article.id)) return toast('You have already completed this reading activity.');
    setCompleted(prev => [...prev, article.id]);
    setBalance(prev => prev + article.reward);
    toast(money(article.reward) + ' demo reward added to your wallet.');
  };
  const copyReferral = async () => {
    try { await navigator.clipboard.writeText(referralLink); toast('Referral link copied.'); }
    catch { toast(referralLink); }
  };
  const submitWithdrawal = e => {
    e.preventDefault();
    const amount = Number(withdrawForm.amount);
    if (!amount || amount < 500 || amount > balance) return toast('Enter an amount of at least ₦500, not more than your available balance.');
    if (!withdrawForm.bank || !withdrawForm.account || !withdrawForm.name) return toast('Complete your bank details first.');
    setWithdrawals(prev => [{ id: Date.now(), amount, bank: withdrawForm.bank, account: withdrawForm.account, name: withdrawForm.name, status: 'Pending demo request', date: new Date().toLocaleDateString('en-NG') }, ...prev]);
    setBalance(prev => prev - amount);
    setWithdrawForm({ amount: '', bank: '', account: '', name: '' });
    toast('Demo withdrawal request recorded locally. No payment has been sent.');
  };

  const pageTitle = active;
  const Sidebar = () => <aside className={'member-sidebar ' + (mobileNav ? 'member-sidebar-open' : '')}>
    <div className="member-brand"><span><BookOpen size={22}/></span><b>Read<span>Earn</span><small>MEMBER SPACE</small></b><button className="member-close" onClick={()=>setMobileNav(false)}><X/></button></div>
    <div className="member-nav-label">MENU</div>
    <nav>{navItems.map(([label, Icon]) => <button key={label} className={active===label?'member-nav-active':''} onClick={()=>{setActive(label);setMobileNav(false);}}><Icon size={18}/>{label}{label==='Notifications'&&<i>2</i>}</button>)}</nav>
    <div className="member-sidebar-bottom"><div className="member-help"><CircleHelp size={18}/><b>Need help?</b><small>We're here to help you.</small><span className="member-support-soon">Support centre coming soon</span></div><button className="member-logout" onClick={onLogout}><LogOut size={17}/> Log out</button></div>
  </aside>;

  return <div className="member-app">
    {mobileNav && <button className="member-overlay" onClick={()=>setMobileNav(false)} aria-label="Close navigation"/>}
    <Sidebar/>
    <main className="member-main">
      <header className="member-topbar"><button className="member-menu" onClick={()=>setMobileNav(true)}><Menu/></button><div><small>MEMBER PORTAL</small><h1>{pageTitle}</h1></div><div className="member-top-actions"><button className="member-icon-button" onClick={()=>setActive('Notifications')} aria-label="Notifications"><Bell size={19}/><i/></button><div className="member-user"><span>{(profile.name||'T').slice(0,1).toUpperCase()}</span><div><b>{profile.name || 'Testing Member'}</b><small>Member account</small></div></div></div></header>
      <div className="member-content">
        {notice && <div className="member-toast"><CheckCircle2 size={17}/>{notice}</div>}
        {active==='Overview' && <>
          <div className="member-welcome"><div><span className="member-kicker">YOUR READING JOURNEY</span><h2>Hello, {profile.name.split(' ')[0] || 'there'} 👋</h2><p>Welcome back. Keep learning, complete reading activities and follow your progress.</p></div><div className="welcome-mark"><BookOpen size={35}/></div></div>
          <div className="member-stats">
            <article><span className="stat-icon gold"><Wallet/></span><small>Available balance</small><strong>{money(balance)}</strong><em>Demo wallet balance</em></article>
            <article><span className="stat-icon blue"><Coins/></span><small>Total reading rewards</small><strong>{money(earned)}</strong><em>{completed.length} activities completed</em></article>
            <article><span className="stat-icon purple"><BookOpen/></span><small>Articles completed</small><strong>{completed.length}</strong><em>Keep your learning streak</em></article>
            <article><span className="stat-icon green"><Users/></span><small>My referrals</small><strong>0</strong><em>Referral tracking preview</em></article>
          </div>
          <section className="member-panel daily-overview-panel"><div className="member-panel-heading"><div><h3>Today's tasks</h3><p>{dailyCompleted.length} of {dailyTaskTemplates.length} completed · Resets at midnight (Nigeria time)</p></div><button onClick={()=>setActive('Daily Tasks')}>View tasks <ChevronRight size={16}/></button></div><div className="daily-progress-track"><span style={{width:((dailyCompleted.length/dailyTaskTemplates.length)*100)+'%'}}/></div><div className="daily-overview-items">{dailyTaskTemplates.slice(0,3).map(task=><span key={task.id}><CheckCircle2 size={15}/>{task.title}</span>)}</div></section>
          <div className="member-two-col"><section className="member-panel"><div className="member-panel-heading"><div><h3>Continue reading</h3><p>Explore available reading activities</p></div><button onClick={()=>setActive('Read & Earn')}>View all <ChevronRight size={16}/></button></div>{starterArticles.slice(0,3).map(a=><div className="mini-article" key={a.id}><span className="mini-book"><BookOpen/></span><div><b>{a.title}</b><small>{a.minutes} min read · Reward {money(a.reward)}</small></div><button onClick={()=>setActive('Read & Earn')} aria-label="Open article"><ChevronRight/></button></div>)}</section><section className="member-panel referral-panel"><span className="referral-gift"><Gift/></span><h3>Invite friends, grow together</h3><p>Share your personal referral link with friends. Referral rewards will be enabled when the platform backend is connected.</p><div className="referral-copy"><span>{referralLink}</span><button onClick={copyReferral}><Copy size={16}/> Copy</button></div><small className="demo-note">Demo referral link</small></section></div>
          <section className="member-panel"><div className="member-panel-heading"><div><h3>Recent activity</h3><p>Your latest reading and wallet activity</p></div></div>{completed.length===0?<div className="member-empty"><Clock3/><b>No activity yet</b><span>Complete your first reading activity to see it here.</span></div>:completed.slice(-4).reverse().map(id=>{const a=starterArticles.find(x=>x.id===id);return a&&<div className="activity-row" key={id}><CheckCircle2/><div><b>{a.title}</b><small>Reading reward · Completed</small></div><strong>+{money(a.reward)}</strong></div>})}</section>
        </>}
        {active==='Daily Tasks' && <><div className="member-page-intro"><h2>Your daily tasks</h2><p>Complete today's activities to collect extra demo rewards. Your checklist refreshes every day at midnight in Nigeria time.</p></div><div className="daily-summary"><div><small>DAILY PROGRESS</small><strong>{dailyCompleted.length} / {dailyTaskTemplates.length}</strong></div><div><small>REWARDS EARNED TODAY</small><strong>{money(dailyTaskTemplates.filter(t=>dailyCompleted.includes(t.id)).reduce((sum,t)=>sum+t.reward,0))}</strong></div><div><small>DATE (NIGERIA)</small><strong>{new Date().toLocaleDateString('en-NG',{timeZone:'Africa/Lagos',day:'numeric',month:'short',year:'numeric'})}</strong></div></div><div className="daily-task-list">{dailyTaskTemplates.map(task=>{const Icon=task.icon;const done=dailyCompleted.includes(task.id);return <article className={'daily-task-card '+(done?'daily-task-done':'')} key={task.id}><span className="daily-task-icon"><Icon size={21}/></span><div className="daily-task-copy"><h3>{task.title}</h3><p>{task.description}</p><b>Reward: {money(task.reward)}</b></div><button className="member-primary" disabled={done} onClick={()=>completeDailyTask(task)}>{done?'Completed ✓':'Mark complete'}</button></article>})}</div><p className="demo-warning">Demo mode: task completion and rewards are saved in this browser only. A secure shared task system requires the platform backend before real rewards can be issued.</p></>}
        {active==='Read & Earn' && <><div className="member-page-intro"><h2>Read. Learn. Earn.</h2><p>Choose an article, read through it and mark it complete to test the demo rewards experience.</p></div><div className="member-search"><Search/><input placeholder="Search articles..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="article-grid">{filtered.map(a=><article className="reading-card" key={a.id}><div className="reading-card-top"><span>{a.category}</span><BookOpen/></div><h3>{a.title}</h3><p>{a.excerpt}</p><div className="reading-meta"><span><Clock3 size={15}/>{a.minutes} min read</span><b>{money(a.reward)} reward</b></div><button className="member-primary" disabled={completed.includes(a.id)} onClick={()=>completeArticle(a)}>{completed.includes(a.id)?'Completed ✓':'Mark as read & earn'}</button></article>)}</div>{filtered.length===0&&<div className="member-empty">No articles match your search.</div>}</>}
        {active==='My Referrals' && <><div className="member-page-intro"><h2>Your referral centre</h2><p>Invite people to join ReadEarn and keep track of your referral activity.</p></div><div className="referral-hero"><div><span className="member-kicker">YOUR UNIQUE REFERRAL LINK</span><h3>Share the opportunity to read and grow.</h3><p>Friends can use this link when registration is enabled.</p><div className="referral-copy"><span>{referralLink}</span><button onClick={copyReferral}><Copy size={16}/> Copy link</button></div></div><Gift size={70}/></div><div className="member-stats referral-stats"><article><span className="stat-icon blue"><Users/></span><small>Total referrals</small><strong>0</strong></article><article><span className="stat-icon gold"><BadgeCheck/></span><small>Active referrals</small><strong>0</strong></article><article><span className="stat-icon green"><Coins/></span><small>Referral earnings</small><strong>₦0</strong></article></div><section className="member-panel"><h3>Referral history</h3><div className="member-empty"><Users/><b>No referrals yet</b><span>Your invited members will appear here when referral tracking is connected.</span></div></section></>}
        {active==='My Wallet' && <><div className="member-page-intro"><h2>Your wallet</h2><p>Review your demo balance and rewards earned from reading activities.</p></div><div className="wallet-highlight"><small>AVAILABLE BALANCE</small><strong>{money(balance)}</strong><span><ShieldCheck size={15}/> Preview balance · Not real funds</span></div><div className="member-stats"><article><small>Reading rewards</small><strong>{money(earned)}</strong><em>From completed activities</em></article><article><small>Withdrawal requests</small><strong>{withdrawals.length}</strong><em>Demo requests submitted</em></article><article><small>Referrals</small><strong>₦0</strong><em>Not yet connected</em></article></div><section className="member-panel"><h3>Wallet transactions</h3>{completed.length===0&&withdrawals.length===0?<div className="member-empty"><Wallet/><b>No transactions yet</b><span>Your wallet history will appear here.</span></div>:<>{completed.map(id=>{const a=starterArticles.find(x=>x.id===id);return <div className="activity-row" key={'a'+id}><span className="transaction-symbol positive">+</span><div><b>Reading reward</b><small>{a?.title}</small></div><strong>+{money(a?.reward)}</strong></div>})}{withdrawals.map(w=><div className="activity-row" key={w.id}><span className="transaction-symbol negative">−</span><div><b>Withdrawal request</b><small>{w.date} · {w.status}</small></div><strong>−{money(w.amount)}</strong></div>)}</>}</section></>}
        {active==='Withdrawals' && <><div className="member-page-intro"><h2>Withdraw your rewards</h2><p>Submit a demo withdrawal request and review its status. No real payment is processed in preview mode.</p></div><div className="withdraw-layout"><section className="member-panel"><h3>Request withdrawal</h3><div className="withdraw-balance"><small>Available balance</small><strong>{money(balance)}</strong></div><form className="withdraw-form" onSubmit={submitWithdrawal}><label>Amount (minimum ₦500)<input type="number" min="500" max={balance} value={withdrawForm.amount} onChange={e=>setWithdrawForm(p=>({...p,amount:e.target.value}))} placeholder="Enter amount" required/></label><label>Bank name<input value={withdrawForm.bank} onChange={e=>setWithdrawForm(p=>({...p,bank:e.target.value}))} placeholder="Enter bank name" required/></label><label>Account number<input inputMode="numeric" maxLength="10" value={withdrawForm.account} onChange={e=>setWithdrawForm(p=>({...p,account:e.target.value}))} placeholder="10-digit account number" required/></label><label>Account name<input value={withdrawForm.name} onChange={e=>setWithdrawForm(p=>({...p,name:e.target.value}))} placeholder="Name on bank account" required/></label><button className="member-primary" type="submit">Submit demo request <ArrowUpRight size={17}/></button></form><p className="demo-warning">Preview only: withdrawal requests are saved in this browser. Bank transfers are not made.</p></section><section className="member-panel"><h3>Withdrawal history</h3>{withdrawals.length===0?<div className="member-empty"><FileText/><b>No withdrawal requests</b><span>Your submitted requests will appear here.</span></div>:withdrawals.map(w=><div className="withdraw-history" key={w.id}><b>{money(w.amount)}</b><span>{w.bank} · {w.account}</span><small>{w.date} · {w.status}</small></div>)}</section></div></>}
        {active==='Notifications' && <><div className="member-page-intro"><h2>Notifications</h2><p>Stay updated with your reading and account activity.</p></div><section className="member-panel notification-list"><div><span className="notification-symbol"><BookOpen/></span><div><b>Welcome to ReadEarn</b><p>Your member dashboard preview is ready. Explore reading activities and your wallet.</p><small>Just now · Account</small></div></div><div><span className="notification-symbol"><Gift/></span><div><b>Invite your friends</b><p>Your referral centre is ready to preview. Referral tracking will activate with the backend.</p><small>Today · Referrals</small></div></div><div><span className="notification-symbol"><Wallet/></span><div><b>Wallet preview</b><p>Rewards earned in this demo are sample values and are not withdrawable funds.</p><small>Today · Wallet</small></div></div></section></>}
        {active==='My Profile' && <><div className="member-page-intro"><h2>Account settings</h2><p>Manage your member details in this local preview.</p></div><section className="member-panel profile-panel"><div className="profile-avatar">{(profile.name||'T').slice(0,1).toUpperCase()}</div><h3>Personal information</h3><form className="withdraw-form" onSubmit={e=>{e.preventDefault();toast('Profile saved in this browser.');}}><label>Full name<input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} required/></label><label>Email address<input type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} required/></label><label>Phone number<input value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} placeholder="Add phone number"/></label><label>Preferred bank<input value={profile.bank} onChange={e=>setProfile(p=>({...p,bank:e.target.value}))} placeholder="Bank name"/></label><label>Account number<input value={profile.account} onChange={e=>setProfile(p=>({...p,account:e.target.value}))} placeholder="Account number"/></label><button className="member-primary">Save changes</button></form></section></>}
        <footer className="member-footer">© {new Date().getFullYear()} ReadEarn · Member preview <span>Free registration · Nigeria (NGN)</span></footer>
      </div>
    </main>
  </div>;
}
