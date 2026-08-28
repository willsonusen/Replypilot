"use client";
import { useState, useEffect } from "react"
import { 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  Users, 
  ArrowRight,
  Check,
  Instagram,
  Play,
  X,
  AlertTriangle,
  Flame,
  PenLine,
  Mail,
  AtSign,
  Briefcase,
  Loader2,
  CheckCircle2,
  Inbox
} from "lucide-react"

type Signup = {
  email: string
  handle: string
  type: string
  date: string
}

export default function Page() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [bottomEmail, setBottomEmail] = useState("")
  const [showDemo, setShowDemo] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [form, setForm] = useState({ email: "", handle: "", type: "Creator" })
  const [errors, setErrors] = useState<{email?: string, handle?: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [signups, setSignups] = useState<Signup[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : ''
    if (search.includes('admin')) setIsAdmin(true)
    try {
      const raw = localStorage.getItem('replypilot_signups')
      if (raw) {
        const parsed = JSON.parse(raw) as Signup[]
        setSignups(parsed)
      }
    } catch {}
  }, [])

  const openSignup = (prefillEmail?: string) => {
    if (prefillEmail) setForm(f => ({ ...f, email: prefillEmail }))
    setShowSignup(true)
    setIsSuccess(false)
    setErrors({})
  }

  const validate = () => {
    const e: typeof errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      e.email = "Enter a valid email address"
    }
    if (!form.handle.trim()) {
      e.handle = "Instagram handle is required"
    } else if (!form.handle.trim().startsWith("@")) {
      e.handle = "Must start with @ (e.g. @yourhandle)"
    } else if (form.handle.trim().length < 3) {
      e.handle = "Handle too short"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1300))
    try {
      const newEntry: Signup = {
        email: form.email.trim().toLowerCase(),
        handle: form.handle.trim(),
        type: form.type,
        date: new Date().toISOString()
      }
      const existingRaw = localStorage.getItem('replypilot_signups')
      const existing: Signup[] = existingRaw ? JSON.parse(existingRaw) : []
      const updated = [newEntry, ...existing]
      localStorage.setItem('replypilot_signups', JSON.stringify(updated))
      setSignups(updated)
      setIsSuccess(true)
      // TODO: Replace with Supabase - see README
    } catch (err) {
      setErrors({ email: "Could not save locally. Try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black antialiased overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        * { font-family: 'Geist', -apple-system, sans-serif; }
        .mono { font-family: 'Geist Mono', monospace; }
        @keyframes success-pop { 0% { transform: scale(0.8); opacity:0 } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity:1 } }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(120,119,198,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_20%,rgba(255,255,255,0.04),transparent)]" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {isAdmin && (
        <div className="relative z-[80] border-b border-amber-500/20 bg-amber-500/[0.06] backdrop-blur-xl">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-black flex items-center justify-center"><Inbox className="w-4 h-4" /></div>
                <h3 className="text-[14px] font-semibold tracking-tight">Admin — ReplyPilot Signups ({signups.length})</h3>
                <span className="text-[11px] mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/20">?admin mode</span>
              </div>
            </div>
            <div className="overflow-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-left text-[13px]">
                <thead className="mono text-[11px] uppercase tracking-widest text-zinc-500 border-b border-white/10">
                  <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Handle</th><th className="px-4 py-3">Type</th></tr>
                </thead>
                <tbody>{signups.map((s,i)=><tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]"><td className="px-4 py-3 mono text-zinc-400">{new Date(s.date).toLocaleString()}</td><td className="px-4 py-3">{s.email}</td><td className="px-4 py-3">{s.handle}</td><td className="px-4 py-3">{s.type}</td></tr>)}</tbody>
              </table>
              {signups.length===0 && <div className="p-8 text-center text-zinc-500 text-[13px]">No signups yet — try the form</div>}
            </div>
          </div>
        </div>
      )}

      <header className="relative z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#0a0a0a]/70 sticky top-0">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-white text-black flex items-center justify-center font-bold text-[13px] tracking-tight">R</div>
            <span className="text-[16px] font-semibold tracking-tight">ReplyPilot</span>
            <span className="hidden md:inline-flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10.5px] mono tracking-widest uppercase text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13px] text-zinc-400">
            <a className="hover:text-white transition">Features</a><a className="hover:text-white transition">Pricing</a>
            <button onClick={()=>openSignup()} className="h-8 px-4 rounded-full bg-white text-black font-medium hover:bg-zinc-100 transition">Start free</button>
          </div>
          <button onClick={()=>setMobileMenu(!mobileMenu)} className="md:hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">{mobileMenu?<X className="w-4 h-4" />:<span className="text-[12px]">≡</span>}</button>
        </div>
      </header>

      <main className="relative">
        <section className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-14 lg:pt-20 pb-16">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] mono text-zinc-300 mb-5"><Sparkles className="w-3.5 h-3.5" /> Built for creators who mean business</div>
              <h1 className="text-[40px] lg:text-[56px] font-[600] tracking-[-0.03em] leading-[0.95]">Your AI Co-Pilot<br/>for Comments<br/><span className="text-zinc-500">That Convert.</span></h1>
              <p className="mt-5 text-[16px] leading-[1.6] text-zinc-400 max-w-[48ch]">We hide 90% spam, surface leads & superfans, and reply in your exact voice. Like the screenshot you have — 31 spam hidden, @sarah.codes asking real questions.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={()=>openSignup()} className="h-[44px] px-6 rounded-full bg-white text-black text-[14px] font-medium inline-flex items-center gap-2 hover:bg-zinc-100">Launch ReplyPilot — Free <ArrowRight className="w-4 h-4" /></button>
                <button onClick={()=>setShowDemo(true)} className="h-[44px] px-6 rounded-full bg-white/[0.08] border border-white/[0.12] text-[14px] inline-flex items-center gap-2 hover:bg-white/[0.12]"><Play className="w-4 h-4" /> View demo dashboard</button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-[520px]">
                {[{k:"31", l:"spam hidden today"}, {k:"94%", l:"voice match"}, {k:"<2s", l:"reply draft"}].map((s)=><div key={s.k} className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-4"><div className="text-[22px] font-semibold tracking-tight">{s.k}</div><div className="text-[11px] mono uppercase tracking-widest text-zinc-500 mt-1">{s.l}</div></div>)}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#121212] overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
              <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between bg-[#0f0f0f]"><span className="mono text-[11px] uppercase tracking-widest text-zinc-500">replypilot.vercel.app/inbox</span><div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/20" /><div className="w-2.5 h-2.5 rounded-full bg-white/20" /><div className="w-2.5 h-2.5 rounded-full bg-white/20" /></div></div>
              <div className="p-4 space-y-3 bg-[#0a0a0a]">
                <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-3 flex items-center justify-between"><span className="text-[12px] mono">All Replies</span><span className="text-[12px] px-2 py-0.5 rounded-full bg-white text-black font-medium">6</span></div>
                <div className="text-[13px] text-zinc-400 px-1 flex items-center justify-between"><span>Questions</span><span className="text-amber-400">?</span></div>
                <div className="text-[13px] text-zinc-400 px-1 flex items-center gap-2"><span>Leads / Collabs</span><span>💰</span></div>
                <div className="rounded-[14px] bg-[#1a1a1a] border border-white/[0.06] p-4 mt-2"><div className="text-[12px] font-medium">Bouncer Today</div><div className="text-[28px] font-semibold mt-1">31</div><div className="text-[11px] mono text-zinc-500">spam hidden automatically</div><div className="text-[10.5px] mono text-zinc-600 mt-2">Top words: crypto, DM promo, OnlyFans</div></div>
                <div className="rounded-[14px] bg-[#1a1a1a] border border-white/[0.06] p-4"><div className="text-[13px] font-medium">Superfan Radar</div><div className="mt-2 space-y-1 text-[12px] mono text-zinc-400"><div>@sarah.codes — 12 replies</div><div>@design_mike — 9 replies</div><div>@abuja_creator — 7 replies</div></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 lg:px-8 pb-20 grid md:grid-cols-3 gap-4">
          {[
            {icon: ShieldCheck, title:"Bouncer", desc:"Auto-hides crypto, DM promo, OnlyFans spam. 31 hidden today in your screenshot.", badge:"31 hidden"},
            {icon: Flame, title:"Superfan Radar", desc:"Ranks your top fans by replies. @sarah.codes 12x engaged — reply first.", badge:"3 superfans"},
            {icon: PenLine, title:"AI Drafts — 94% Voice Match", desc:"Witty or Helpful drafts trained on your past 100 replies. OpenAI powered.", badge:"94% match"},
          ].map((f)=><div key={f.title} className="rounded-[20px] bg-white/[0.04] border border-white/[0.08] p-6"><div className="w-9 h-9 rounded-[12px] bg-white text-black flex items-center justify-center mb-4"><f.icon className="w-5 h-5" /></div><div className="flex items-center gap-2 mb-2"><h3 className="text-[14px] font-semibold">{f.title}</h3><span className="text-[10px] mono px-2 py-0.5 rounded-full bg-white/10 border border-white/10">{f.badge}</span></div><p className="text-[13px] leading-[1.5] text-zinc-400">{f.desc}</p></div>)}
        </section>

        <section className="border-t border-white/[0.06] bg-white/[0.02]">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14">
            <h2 className="text-[28px] font-semibold tracking-tight text-center">Simple pricing for creators</h2>
            <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-[900px] mx-auto">
              {[
                {name:"Free", price:"$0", feat:["50 comments/mo","Bouncer basic","1 Instagram"]},
                {name:"Creator", price:"$19", popular:true, feat:["5k comments/mo","AI Drafts voice clone","Superfan Radar","Leads inbox"]},
                {name:"Pro", price:"$49", feat:["Unlimited","Team + 5 accounts","API + Webhooks"]},
              ].map((p)=><div key={p.name} className={`rounded-[20px] border p-6 ${p.popular ? "bg-white text-black border-white shadow-[0_20px_50px_-20px_rgba(255,255,255,0.5)]" : "bg-white/[0.04] border-white/[0.08]"}`}><div className="flex items-center justify-between"><span className="text-[13px] font-medium mono uppercase tracking-widest">{p.name}</span>{p.popular && <span className="text-[10px] px-2 py-1 rounded-full bg-black text-white mono">MOST POPULAR</span>}</div><div className="mt-4 text-[32px] font-semibold tracking-tight">{p.price}<span className={`text-[14px] font-normal ${p.popular?"text-zinc-600":"text-zinc-500"}`}>/mo</span></div><ul className="mt-5 space-y-2">{p.feat.map((f)=><li key={f} className={`flex gap-2 text-[13px] ${p.popular?"text-zinc-700":"text-zinc-400"}`}><Check className="w-4 h-4 mt-0.5 shrink-0" />{f}</li>)}</ul><button onClick={()=>openSignup()} className={`mt-6 w-full h-10 rounded-full text-[13px] font-medium ${p.popular?"bg-black text-white":"bg-white text-black"}`}>Start free</button></div>)}
            </div>
          </div>
        </section>
      </main>

      {showSignup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[16px]" onClick={()=>setShowSignup(false)} />
          <div className="relative w-full max-w-[460px] rounded-[24px] border border-white/10 bg-[#121212] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
            <div className="h-[56px] border-b border-white/10 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-[10px] bg-white text-black flex items-center justify-center font-bold text-[12px]">R</div><span className="text-[14px] font-semibold">Join ReplyPilot</span><span className="text-[10px] mono px-2 py-0.5 rounded-full bg-white/10 border border-white/10">{signups.length} joined</span></div>
              <button onClick={()=>setShowSignup(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-7">
              {!isSuccess ? (
                <>
                  <h3 className="text-[20px] font-semibold tracking-tight">Launch ReplyPilot — Free</h3>
                  <p className="text-[13px] text-zinc-400 mt-1">Save your spot. We’ll email your magic link.</p>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div><div className={`group flex items-center h-[52px] rounded-[14px] border bg-white/[0.04] px-3 transition ${focused==='email'?"border-white/30 bg-white/[0.07]":"border-white/[0.08]"} ${errors.email?"!border-red-500/60 !bg-red-500/10":""}`}><Mail className="w-4 h-4 text-zinc-500" /><input value={form.email} onFocus={()=>setFocused('email')} onBlur={()=>setFocused(null)} onChange={e=>setForm({...form, email:e.target.value})} placeholder="you@domain.com" className="flex-1 bg-transparent px-3 text-[14px] outline-none placeholder:text-zinc-600" /></div>{errors.email && <div className="mt-1.5 text-[11px] text-red-400 mono">{errors.email}</div>}</div>
                    <div><div className={`group flex items-center h-[52px] rounded-[14px] border bg-white/[0.04] px-3 transition ${focused==='handle'?"border-white/30 bg-white/[0.07]":"border-white/[0.08]"} ${errors.handle?"!border-red-500/60 !bg-red-500/10":""}`}><AtSign className="w-4 h-4 text-zinc-500" /><input value={form.handle} onFocus={()=>setFocused('handle')} onBlur={()=>setFocused(null)} onChange={e=>setForm({...form, handle:e.target.value})} placeholder="@yourhandle" className="flex-1 bg-transparent px-3 text-[14px] outline-none placeholder:text-zinc-600" /></div>{errors.handle && <div className="mt-1.5 text-[11px] text-red-400 mono">{errors.handle}</div>}</div>
                    <div className="flex items-center h-[52px] rounded-[14px] border border-white/[0.08] bg-white/[0.04] px-3"><Briefcase className="w-4 h-4 text-zinc-500" /><select value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="flex-1 bg-transparent px-3 text-[14px] outline-none"><option className="bg-[#121212]" value="Creator">Creator</option><option className="bg-[#121212]" value="Brand">Brand</option><option className="bg-[#121212]" value="Agency">Agency</option></select></div>
                    <button type="submit" disabled={isSubmitting} className="w-full h-[48px] rounded-[12px] bg-white text-black text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-60">{isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Launching...</> : <>Join waitlist — Start free <ArrowRight className="w-4 h-4" /></>}</button>
                  </form>
                </>
              ) : (
                <div className="py-4 text-center"><div className="w-16 h-16 rounded-[18px] bg-white text-black mx-auto flex items-center justify-center mb-5"><CheckCircle2 className="w-8 h-8" /></div><h3 className="text-[22px] font-semibold">You're in!</h3><p className="text-[13.5px] text-zinc-400 mt-2">We saved {form.handle || '@you'} — you're #{signups.length} on the list.</p><button onClick={()=>setShowSignup(false)} className="mt-6 w-full h-10 rounded-full bg-white text-black text-[13px] font-medium">Back to site</button></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
