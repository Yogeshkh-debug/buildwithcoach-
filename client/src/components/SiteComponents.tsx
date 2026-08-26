import { calculateCalorieTarget, calculateProteinTarget } from "@shared/fitness";
import { trpc } from "@/lib/trpc";
import { articleVisuals, programCatalog, type PublicArticle } from "@/lib/content";
import { useCart, type CartPlan } from "@/contexts/CartContext";
import { ArrowDownRight, ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, CircleUserRound, Dumbbell, Menu, Search, ShoppingCart, Sparkles, X } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";

type ToastState = { tone: "success" | "error"; text: string } | null;

function useFormToast() {
  const [notice, setNotice] = useState<ToastState>(null);
  return { notice, setNotice };
}

function Notice({ notice }: { notice: ToastState }) {
  if (!notice) return null;
  return <p className={`form-notice ${notice.tone}`} role="status">{notice.text}</p>;
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="field"><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}</label>;
}

function required(value: string, label: string) {
  return value.trim().length >= 2 ? "" : `Enter your ${label.toLowerCase()}.`;
}

function validEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value) ? "" : "Enter a valid email address.";
}

export function ScrollTop() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, []);
  return null;
}

export function SiteHeader() {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: articles } = trpc.articles.list.useQuery();

  const goTo = (target: string) => {
    setMobileOpen(false);
    if (target.startsWith("#")) {
      if (location !== "/") {
        setLocation("/");
        window.setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      } else document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setLocation(target);
  };

  const matches = (articles ?? []).filter((article) => `${article.title} ${article.excerpt}`.toLowerCase().includes(search.toLowerCase())).slice(0, 4);

  return <>
    <header className="site-header">
      <div className="header-inner">
        <button className="mobile-menu-button" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={() => goTo("/")} className={location === "/" ? "active" : ""}>Home</button>
          <button onClick={() => goTo("#start-here")}>Start here</button>
          <button onClick={() => goTo("/articles")}>Guides</button>
        </nav>
        <button className="wordmark" type="button" onClick={() => goTo("/")} aria-label="Build With Coach home">BUILD WITH <strong>COACH</strong></button>
        <div className="header-actions">
          <button type="button" className="icon-action" onClick={() => setSearchOpen(true)} aria-label="Search guides"><Search size={18} /></button>
          <button type="button" className="icon-action account-control" onClick={() => goTo("/login")} aria-label="Open account"><CircleUserRound size={18} /></button>
          <PremiumCartButton />
        </div>
      </div>
      {mobileOpen ? <nav className="mobile-nav" aria-label="Mobile navigation">
        <p>Navigate Build With Coach</p><button onClick={() => goTo("/")}>Home</button><button onClick={() => goTo("#start-here")}>Start here</button><button onClick={() => goTo("/articles")}>Guides</button><button onClick={() => goTo("/tools")}>Free tools</button><button onClick={() => goTo("#free-plan")}>Free plan</button><button onClick={() => goTo("/about")}>About</button>
      </nav> : null}
    </header>
    {searchOpen ? <div className="search-scrim" role="dialog" aria-modal="true" aria-label="Search Build With Coach guides">
      <div className="search-panel">
        <div className="search-heading"><span>Search the site</span><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={21} /></button></div>
        <label className="search-input"><Search size={18} /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try protein, home workouts, fat loss..." /></label>
        <div className="search-results">{search ? matches.length ? matches.map((article) => <button key={article.slug} type="button" onClick={() => { setSearchOpen(false); setLocation(`/articles/${article.slug}`); }}><span>{article.category}</span>{article.title}<ArrowDownRight size={16} /></button>) : <p>No guides found. Try a different search.</p> : <p>Search the no-BS guides, then take one useful action.</p>}</div>
      </div>
    </div> : null}
  </>;
}

export function PremiumCartButton() {
  const { items } = useCart();
  const [, setLocation] = useLocation();
  return <button type="button" className="premium-cart-button" onClick={() => setLocation("/cart")} aria-label={`Open cart with ${items.length} plan${items.length === 1 ? "" : "s"}`}><ShoppingCart size={18} /><span className="premium-cart-label">Cart</span><b>{items.length}</b></button>;
}

export function CartAddedToast() {
  const [plan, setPlan] = useState("");
  useEffect(() => { const onAdd = (event: Event) => { const title = (event as CustomEvent<string>).detail; setPlan(title); window.setTimeout(() => setPlan(""), 4200); }; window.addEventListener("bwc-cart-added", onAdd); return () => window.removeEventListener("bwc-cart-added", onAdd); }, []);
  if (!plan) return null;
  return <div className="cart-added-toast" role="status"><span><CheckCircle2 size={19} /></span><div><strong>Added to cart</strong><p>{plan}</p></div><Link href="/cart">Review cart <ArrowRight size={15} /></Link><button type="button" onClick={() => setPlan("")} aria-label="Dismiss cart confirmation"><X size={16} /></button></div>;
}

export function FreePlanForm({ compact = false, source = "free_plan", onSuccess, planNames = [] }: { compact?: boolean; source?: string; onSuccess?: () => void; planNames?: string[] }) {
  const mutation = trpc.captures.freePlan.useMutation();
  const cartMutation = trpc.captures.cartRequest.useMutation();
  const { notice, setNotice } = useFormToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = { name: required(name, "name"), email: validEmail(email) };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    try {
      if (planNames.length) await cartMutation.mutateAsync({ name: name.trim(), email: email.trim(), planNames });
      else await mutation.mutateAsync({ name: name.trim(), email: email.trim() });
      setNotice({ tone: "success", text: planNames.length ? `Request received, ${name.trim().split(" ")[0]}. We’ll send your selected PDFs to this inbox.` : `You’re in, ${name.trim().split(" ")[0]}. Check your inbox for the next step.` });
      setName(""); setEmail(""); onSuccess?.();
    } catch (error) { setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not save your request. Please try again." }); }
  };
  return <form className={`capture-form ${compact ? "compact" : ""}`} onSubmit={submit} noValidate data-source={source}>
    <div className="form-fields"><Field label="Name"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" aria-invalid={Boolean(errors.name)} />{errors.name ? <small className="field-error">{errors.name}</small> : null}</Field><Field label="Email"><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" type="email" aria-invalid={Boolean(errors.email)} />{errors.email ? <small className="field-error">{errors.email}</small> : null}</Field></div>
    <button className="black-button form-button" type="submit" disabled={mutation.isPending || cartMutation.isPending}>{mutation.isPending || cartMutation.isPending ? "Sending…" : planNames.length ? "Request my PDFs" : "Send me the plan"}<ArrowRight size={16} /></button>
    <Notice notice={notice} /><p className="form-privacy">No spam. Unsubscribe anytime.</p>
  </form>;
}

export function NewsletterForm({ source = "newsletter" }: { source?: string }) {
  const mutation = trpc.captures.newsletter.useMutation();
  const { notice, setNotice } = useFormToast();
  const [email, setEmail] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); const error = validEmail(email); if (error) return setNotice({ tone: "error", text: error }); try { await mutation.mutateAsync({ email: email.trim(), source }); setEmail(""); setNotice({ tone: "success", text: "You’re on the list. Useful stuff only." }); } catch { setNotice({ tone: "error", text: "Could not save your email. Please try again." }); } };
  return <form className="newsletter-form" onSubmit={submit} noValidate><label className="sr-only" htmlFor={`newsletter-${source}`}>Email address</label><input id={`newsletter-${source}`} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" type="email" /><button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving" : "Subscribe"}</button><Notice notice={notice} /></form>;
}

export function WaitlistForm() {
  const mutation = trpc.captures.waitlist.useMutation();
  const { notice, setNotice } = useFormToast();
  const [email, setEmail] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); const error = validEmail(email); if (error) return setNotice({ tone: "error", text: error }); try { await mutation.mutateAsync({ email: email.trim() }); setEmail(""); setNotice({ tone: "success", text: "You’re on the waitlist. We’ll let you know when the plan drops." }); } catch { setNotice({ tone: "error", text: "Could not join the waitlist. Please try again." }); } };
  return <form className="waitlist-inline" onSubmit={submit} noValidate><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email" type="email" aria-label="Email for paid plan waitlist" /><button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Joining…" : "Join waitlist"}</button><Notice notice={notice} /></form>;
}

export function ContactForm() {
  const mutation = trpc.captures.contact.useMutation();
  const { notice, setNotice } = useFormToast();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = async (event: FormEvent) => { event.preventDefault(); const nextErrors = { name: required(values.name, "name"), email: validEmail(values.email), message: values.message.trim().length >= 10 ? "" : "Write at least 10 characters." }; setErrors(nextErrors); if (Object.values(nextErrors).some(Boolean)) return; try { await mutation.mutateAsync({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim() }); setValues({ name: "", email: "", message: "" }); setNotice({ tone: "success", text: "Message received. We’ll get back to you soon." }); } catch { setNotice({ tone: "error", text: "Could not send your message. Please try again." }); } };
  return <form className="contact-form" onSubmit={submit} noValidate><div className="form-fields two"><Field label="Name"><input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Your name" aria-invalid={Boolean(errors.name)} />{errors.name ? <small className="field-error">{errors.name}</small> : null}</Field><Field label="Email"><input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@email.com" aria-invalid={Boolean(errors.email)} />{errors.email ? <small className="field-error">{errors.email}</small> : null}</Field></div><Field label="Message"><textarea rows={6} value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} placeholder="What do you need help with?" aria-invalid={Boolean(errors.message)} />{errors.message ? <small className="field-error">{errors.message}</small> : null}</Field><button className="black-button" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Sending…" : "Send message"}<ArrowRight size={16} /></button><Notice notice={notice} /></form>;
}

export function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestedPlans, setRequestedPlans] = useState<string[]>([]);
  const hasShown = useRef(false);
  const successMessage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sessionStorage.getItem("bwc-plan-popup-dismissed") || sessionStorage.getItem("bwc-plan-popup-shown")) return;
    const showOnce = () => {
      if (hasShown.current) return;
      hasShown.current = true;
      sessionStorage.setItem("bwc-plan-popup-shown", "true");
      setOpen(true);
    };
    const timer = window.setTimeout(showOnce, 12000);
    const handleScroll = () => { if (window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight) > 0.45) showOnce(); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", handleScroll); };
  }, []);
  useEffect(() => { const openCartRequest = (event: Event) => { setRequestedPlans((event as CustomEvent<string[]>).detail ?? []); setSubmitted(false); setOpen(true); }; window.addEventListener("bwc-open-email-popup", openCartRequest); return () => window.removeEventListener("bwc-open-email-popup", openCartRequest); }, []);
  useEffect(() => { if (submitted) successMessage.current?.focus(); }, [submitted]);
  const close = () => { sessionStorage.setItem("bwc-plan-popup-dismissed", "true"); setOpen(false); setRequestedPlans([]); };
  if (!open) return null;
  const cartRequest = requestedPlans.length > 0;
  return <div className="popup-scrim" role="dialog" aria-modal="true" aria-label={submitted ? "Thank you for subscribing" : cartRequest ? "Request your PDF plans" : "Free 7-Day Fat Loss Starter"}><div className={`popup-card ${submitted ? "success-state" : ""}`}><button className="popup-close" type="button" onClick={close} aria-label="Close popup"><X size={20} /></button>{submitted ? <div className="popup-success" ref={successMessage} tabIndex={-1} role="status"><span className="popup-success-mark"><CheckCircle2 size={38} /></span><p className="eyebrow">REQUEST RECEIVED</p><h2>Thank you.</h2><p>{cartRequest ? "Your selected PDF plans are queued. We’ll send them to your inbox soon." : "Your free starter is on its way. Watch your inbox for the first useful step, then check back for the weekly challenges that keep you building."}</p><button className="black-button" type="button" onClick={close}>Back to the work <ArrowRight size={16} /></button></div> : <><div className="popup-stamp">{cartRequest ? requestedPlans.length : "7"}</div><p className="eyebrow">{cartRequest ? "PDF REQUEST" : "FREE STARTER"}</p><h2>{cartRequest ? "Good choice.\nWe’ll send the PDFs." : <>Stop guessing.<br />Start following a plan.</>}</h2><p>{cartRequest ? "Add your name and email. Your selected plans will be queued for direct delivery." : "Get the free 7-Day Fat Loss Starter for men who want real results — no extreme diets, no BS."}</p>{cartRequest ? <ul>{requestedPlans.map((plan) => <li key={plan}><Check size={15} />{plan}</li>)}</ul> : <><p className="popup-weekly">Subscribe for weekly challenges, practical coaching, and a clear reason to keep building week by week.</p><ul><li><Check size={15} />7 days of simple workouts</li><li><Check size={15} />Clear calorie and protein targets</li><li><Check size={15} />A weekly challenge to keep you building</li></ul></>}<FreePlanForm compact source={cartRequest ? "cart_purchase" : "popup"} planNames={requestedPlans} onSuccess={() => setSubmitted(true)} /><button className="text-button" type="button" onClick={close}>No thanks, I’ll keep guessing.</button></>}</div></div>;
}

export function Marquee({ text = "BUILD STRONGER HABITS" }: { text?: string }) { return <div className="marquee" aria-label={text}><div>{Array.from({ length: 8 }, (_, index) => <span key={index}>{text} <b>✦</b></span>)}</div></div>; }

export function SectionHeading({ eyebrow, title, copy, align = "left" }: { eyebrow?: string; title: string; copy?: string; align?: "left" | "center" }) { return <div className={`section-heading ${align}`}>{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h2>{title}</h2>{copy ? <p>{copy}</p> : null}</div>; }

export function ArticleCard({ article, featured = false }: { article: PublicArticle; featured?: boolean }) { return <Link href={`/articles/${article.slug}`} className={`article-card ${featured ? "featured" : ""}`}><div className={`article-visual ${articleVisuals[article.slug] ?? "visual-swoop"}`}><span>{article.category}</span><Dumbbell aria-hidden="true" size={featured ? 58 : 38} /></div><div className="article-card-copy"><p>{article.category}</p><h3>{article.title}</h3><span>{article.excerpt}</span><strong>Read guide <ArrowDownRight size={16} /></strong></div></Link>; }

export function ProgramCarousel() {
  const strip = useRef<HTMLDivElement>(null);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const { add } = useCart();
  const move = (direction: -1 | 1) => strip.current?.scrollBy({ left: direction * strip.current.clientWidth * .82, behavior: "smooth" });
  const addToCart = (program: (typeof programCatalog)[number]) => { add({ title: program.title, price: program.price, note: program.note }); window.dispatchEvent(new CustomEvent<string>("bwc-cart-added", { detail: program.title })); };
  return <div className="program-carousel"><div className="program-strip" ref={strip} role="region" aria-label="Scroll through program PDFs" tabIndex={0}>{programCatalog.map((program, index) => <article className={`program-pdf ${program.accent} ${activePlan === program.title ? "is-pressed" : ""}`} key={program.title} onPointerDown={() => setActivePlan(program.title)} onPointerUp={() => setActivePlan(null)} onPointerCancel={() => setActivePlan(null)} onPointerLeave={() => setActivePlan(null)}><div className="program-pdf-tablet"><div className="program-pdf-cover"><img className="program-pdf-cover-image" src={program.cover} alt={`${program.title} PDF cover`} decoding="async" /></div></div><div className="program-pdf-copy"><p className="eyebrow">0{index + 1} / {programCatalog.length} · {program.tag}</p><h3>{program.title}</h3><p>{program.subtitle}</p><strong>{program.price}</strong><button className="black-button" type="button" onClick={() => addToCart(program)}>Add to cart <ShoppingCart size={16} /></button></div></article>)}</div><div className="carousel-controls"><span>SCROLL THE PDF. DO THE WORK.</span><button type="button" onClick={() => move(-1)} aria-label="Previous program"><ArrowLeft size={18} /></button><button type="button" onClick={() => move(1)} aria-label="Next program"><ArrowRight size={18} /></button></div></div>;
}

export function FaqAccordion() {
  const items = [
    ["I’m a total beginner. Can I start here?", "Yes. That is the point. You do not need to know everything before starting."],
    ["Should I train at home or in the gym?", "Both can work. Start at home if you are nervous or have no equipment; choose the gym if you want more equipment and structure."],
    ["How much protein do I need?", "Most men do well with 1.6 to 2.2 grams per kilogram of bodyweight. Use the protein calculator for a practical starting target."],
    ["Can I lose fat without starving?", "Yes. A small calorie deficit, enough protein, and consistency are much more useful than extreme restriction."],
    ["Do I need supplements?", "No. Supplements can help, but they are not the foundation. Food, training, sleep, and a realistic plan come first."],
    ["Will this work for overweight men?", "Yes. The site is specifically built for men who want to lose fat, build strength, and feel more in control without shame."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return <div className="faq-list">{items.map(([question, answer], index) => <article className={open === index ? "open" : ""} key={question}><button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span>{question}</span><ChevronDown size={19} /></button>{open === index ? <div><p>{answer}</p></div> : null}</article>)}</div>;
}

export function CalculatorPanel() {
  const [calorie, setCalorie] = useState({ age: "30", weightKg: "80", heightCm: "180", activity: "1.55", goal: "fat_loss" as "fat_loss" | "maintain" | "muscle_gain" });
  const [protein, setProtein] = useState({ weightKg: "80", goal: "fat_loss" as "fat_loss" | "maintain" | "muscle_gain" });
  const calorieOutcome = useMemo(() => { try { return { result: calculateCalorieTarget({ age: Number(calorie.age), weightKg: Number(calorie.weightKg), heightCm: Number(calorie.heightCm), activity: Number(calorie.activity), goal: calorie.goal }), error: "" }; } catch (error) { return { result: null, error: error instanceof Error ? error.message : "Check the values." }; } }, [calorie]);
  const proteinOutcome = useMemo(() => { try { return { result: calculateProteinTarget(Number(protein.weightKg), protein.goal), error: "" }; } catch (error) { return { result: null, error: error instanceof Error ? error.message : "Check the values." }; } }, [protein]);
  return <div className="tool-grid"><section className="tool-card"><p className="eyebrow">CALORIE TARGET</p><h3>Stop guessing your calories.</h3><p>Use this as a sensible starting point, then adjust based on progress.</p><div className="calculator-fields three"><Field label="Age"><input type="number" min="16" max="90" value={calorie.age} onChange={(event) => setCalorie({ ...calorie, age: event.target.value })} /></Field><Field label="Weight (kg)"><input type="number" min="35" max="300" value={calorie.weightKg} onChange={(event) => setCalorie({ ...calorie, weightKg: event.target.value })} /></Field><Field label="Height (cm)"><input type="number" min="130" max="230" value={calorie.heightCm} onChange={(event) => setCalorie({ ...calorie, heightCm: event.target.value })} /></Field></div><div className="calculator-fields two"><Field label="Activity"><select value={calorie.activity} onChange={(event) => setCalorie({ ...calorie, activity: event.target.value })}><option value="1.2">Mostly sitting</option><option value="1.375">Lightly active</option><option value="1.55">Train 3–5 times/week</option><option value="1.725">Very active</option></select></Field><Field label="Goal"><select value={calorie.goal} onChange={(event) => setCalorie({ ...calorie, goal: event.target.value as typeof calorie.goal })}><option value="fat_loss">Lose fat</option><option value="maintain">Maintain</option><option value="muscle_gain">Build muscle</option></select></Field></div>{calorieOutcome.error ? <p className="field-error">{calorieOutcome.error}</p> : calorieOutcome.result ? <div className="result-panel"><span>STARTING DAILY TARGET</span><strong>{calorieOutcome.result.target.toLocaleString()} <small>kcal</small></strong><p>Estimated maintenance: {calorieOutcome.result.maintenance.toLocaleString()} kcal</p></div> : null}</section><section className="tool-card dark-tool"><p className="eyebrow">PROTEIN TARGET</p><h3>Give your meals a job.</h3><p>Choose a clear daily protein target, then spread it across three or four meals.</p><div className="calculator-fields two"><Field label="Weight (kg)"><input type="number" min="35" max="300" value={protein.weightKg} onChange={(event) => setProtein({ ...protein, weightKg: event.target.value })} /></Field><Field label="Goal"><select value={protein.goal} onChange={(event) => setProtein({ ...protein, goal: event.target.value as typeof protein.goal })}><option value="fat_loss">Lose fat</option><option value="maintain">Maintain</option><option value="muscle_gain">Build muscle</option></select></Field></div>{proteinOutcome.error ? <p className="field-error">{proteinOutcome.error}</p> : proteinOutcome.result ? <div className="result-panel"><span>STARTING DAILY TARGET</span><strong>{proteinOutcome.result.target} <small>g protein</small></strong><p>Useful range: {proteinOutcome.result.lower}–{proteinOutcome.result.upper} g/day</p></div> : null}</section></div>;
}

export function SiteFooter() { return <footer className="site-footer"><div className="footer-top"><div><button className="footer-wordmark" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>BUILD WITH <strong>COACH</strong></button><p>Simple plans for men who want more strength, less confusion, and no shame.</p></div><div className="footer-links"><div><span>Explore</span><Link href="/articles">Articles</Link><Link href="/tools">Free tools</Link><Link href="/programs">Programs</Link></div><div><span>Support</span><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/login">Login</Link></div></div><div className="footer-news"><p className="eyebrow">Gains, minus the garbage</p><h3>Useful fitness tips, straight to your inbox.</h3><NewsletterForm source="footer" /></div></div><div className="footer-bottom"><span>© 2026 Build With Coach.</span><span>Built for the next rep, the next meal, the next day.</span><span>Instagram: @buildwithcoach</span></div><div className="footer-signature" aria-label="Build With Coach">BUILD WITH <strong>COACH</strong> <span aria-hidden="true">💪</span></div></footer>; }

export function PageHero({ kicker, title, copy, actions, visual = "generic" }: { kicker: string; title: string; copy: string; actions?: ReactNode; visual?: string }) { return <section className={`page-hero ${visual}`}><div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{copy}</p>{actions ? <div className="hero-actions">{actions}</div> : null}</div><div className="page-hero-art"><span className="hero-orb" /><Dumbbell size={92} /><span className="hero-spark"><Sparkles size={24} /></span></div></section>; }
