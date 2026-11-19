import { useState } from 'react';
import { BookOpen, ArrowRight, Mail, Lock, User, Phone, Gift } from 'lucide-react';
export default function AuthPage({mode,onMode,onBack,onDemoLogin}) {
 const reg=mode==='register'; const [f,setF]=useState({name:'',phone:'',email:'',password:'',confirm:'',ref:''}); const [error,setError]=useState(''); const [message,setMessage]=useState(''); const [loading,setLoading]=useState(false);
 const update=(k,v)=>setF(p=>({...p,[k]:v}));
 async function submit(e){
  e.preventDefault();
  setError('');
  setMessage('');
  if(reg){
   if(f.password.length < 6){setError('Password must be at least 6 characters.');return;}
   if(f.password !== f.confirm){setError('Your passwords do not match.');return;}
   const account={name:f.name.trim(),phone:f.phone.trim(),email:f.email.trim().toLowerCase(),password:f.password,ref:f.ref.trim()};
   if(!account.name || !account.email){setError('Please complete your name and email.');return;}
   localStorage.setItem('re_demo_registered_user',JSON.stringify(account));
   setMessage('Preview account created on this device. You can now log in.');
   onMode('login');
   return;
  }
  const email=f.email.trim().toLowerCase();
  if(email==='testing@gmail.com' && f.password==='testing123'){
   onDemoLogin?.({name:'Testing Member',email});
   return;
  }
  const saved=JSON.parse(localStorage.getItem('re_demo_registered_user')||'null');
  if(saved && saved.email===email && saved.password===f.password){
   onDemoLogin?.({name:saved.name,email:saved.email,phone:saved.phone});
   return;
  }
  setError('Incorrect email or password. Use your preview account or testing@gmail.com / testing123.');
 }
 return <main className='auth-page'><button className='auth-back' onClick={onBack}>← Back</button><div className='auth-wall'><div className='lamp-glow'/><div className='lamp'/><div className='brick-wall'/></div><section className='auth-card'><div className='auth-brand'><BookOpen/> <span>Read<span>Earn</span><small>READ. LEARN. GROW.</small></span></div><h1>{reg?'Create Account':'Login'}</h1><p className='auth-subtitle'>{reg?'Start reading and earning today':'Welcome back'}</p>{error&&<p className='auth-alert error'>{error}</p>}{message&&<p className='auth-alert success'>{message}</p>}<form className='auth-form' onSubmit={submit}>{reg&&<><label className='auth-field'><User/><input placeholder='Full name' value={f.name} onChange={e=>update('name',e.target.value)} required/></label><label className='auth-field'><Phone/><input placeholder='Phone number' value={f.phone} onChange={e=>update('phone',e.target.value)} required/></label></>}<label className='auth-field'><Mail/><input type='text' placeholder={reg?'Email address':'Username or email'} value={f.email} onChange={e=>update('email',e.target.value)} required/></label><label className='auth-field'><Lock/><input type='password' placeholder='Password' value={f.password} onChange={e=>update('password',e.target.value)} required/></label>{reg&&<><label className='auth-field'><Lock/><input type='password' placeholder='Confirm password' value={f.confirm} onChange={e=>update('confirm',e.target.value)} required/></label><label className='auth-field'><Gift/><input placeholder='Referral code (optional)' value={f.ref} onChange={e=>update('ref',e.target.value)}/></label></>}<button className='auth-submit' disabled={loading}>{loading?'Please wait':reg?'Create Account':'Login'} <ArrowRight/></button></form><div className='auth-switch'>{reg?'Already have an account?':"Don't have an account?"}<button onClick={()=>onMode(reg?'login':'register')}>{reg?'Login':'Register'}</button></div></section></main>;
}
