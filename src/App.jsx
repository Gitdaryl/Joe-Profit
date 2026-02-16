import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── DESIGN TOKENS ───
const C = {
  gold: "#D4A24E", goldLight: "#E8C87A", goldDim: "rgba(212,162,78,0.12)",
  goldGlow: "rgba(212,162,78,0.25)",
  black: "#0A0908", dark: "#141210", dark2: "#1A1714", dark3: "#0F0D0B",
  cream: "#F5EDE0", creamSoft: "rgba(245,237,224,0.85)", muted: "#9A8E7F",
  mutedLight: "#B8AFA3",
  line: "rgba(212,162,78,0.06)", lineBright: "rgba(212,162,78,0.2)",
  red: "#8B2020", redSoft: "rgba(139,32,32,0.3)",
};

const FONT = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
};

// ─── IMAGE PATHS (relative for deployment) ───
const IMG = {
  hero: "/images/sunset.jpg",
  cotton: "/images/Cotton_fields.jpg",
  swayze: "/images/Swayze_elemtary.jpg",
  touchdown: "/images/Joe_touchdown_LMU.jpg",
  falcons: "/images/Joe_23_NFL_atlanta.jpg",
  cii: "/images/CII_tent.jpg",
  yup: "/images/YUP_kids.jpg",
  book: "/images/Book_on_coffee_table.jpg",
  reagan: "/images/Joe_Reagan_handshake.jpg",
  ali: "/images/Joe_Ali.jpg",
  boots: "/images/Shoes_-_joe.jpg",
  plaque: "/images/Joe_Plaque.jpg",
  gameball: "/images/Joe_Game_ball.jpg",
  wanda: "/images/Joe___Wanda.jpg",
  wandaDinner: "/images/Joe_Wanda_Dinner.jpg",
  son: "/images/Joe_and_Son.jpg",
  friends: "/images/Joe_Childhood_Friends.jpg",
  reverend: "/images/Reverend_Joe_Profit.jpg",
  ambassador: "/images/Ambassador_Andrew_Young.jpg",
  artBlank: "/images/Arthur_Blank.jpg",
  bodyBuilder: "/images/Joe_Body_Builder.jpg",
  gate: "/images/Joes_Gate.jpg",
  coachDale: "/images/Coach_Dale_Brown.jpg",
  holyfield: "/images/Evander_Holyfield.jpg",
  shack: "/images/James__Shack__Harris_HOF.jpg",
  satcher: "/images/Joe___Dr_Satcher.jpg",
  katrina: "/images/Hurricain_Katrina_Rescue.jpg",
  dakota: "/images/Joe_and_Dakota.jpg",
  signing: "/images/Signing_first_book.jpg",
  aliPress: "/images/Ali_Press_conference.jpg",
  thePick: "/images/Profits_the_pick.jpg",
  kickoff: "/images/Returns_Kickoff_Atlanta_Falcons.jpg",
  cutDime: "/images/Joe_Profit_cut_on_a_dime.jpg",
  runTD: "/images/run_for_TD.jpg",
  saints: "/images/Joe_New_Orleans_Saints.jpg",
  allAmerican: "/images/Joe_all_american.jpg",
  brunno: "/images/ULM_pres_Dr_Nick_Bruno.jpg",
  ulmInterview: "/images/Joe_ULM_interview.jpg",
  speaks: "/images/Joe_Profit_Speaks.jpg",
  uae: "/images/Joe_and_UAE.jpg",
  nextGenAuthors: "/images/Next_Gen_of_Authors.jpg",
  pi: "/images/Pulikkottil_Ittymany_Joy_.jpg",
  // Press/articles
  essenceArticle: "/images/essence_magazine_article.jpg",
  ciiArticle: "/images/CII_article.jpg",
  minorityBiz: "/images/Minority_Business_development.jpg",
  wallStreet: "/images/Wall_street_Journal.jpg",
  usaToday: "/images/USA_Today.jpg",
  sba: "/images/SBA_newspaper.jpg",
  millionaire: "/images/Newspaper_millionaire.jpg",
  gwinnett: "/images/Gwinnett_Business_Article.jpg",
  nluArticle: "/images/NLU_article.jpg",
  multimediaArticle: "/images/Multimedia_Article.jpg",
  multiMillionContract: "/images/Multimillion_dollar_contract.jpg",
  kuwaitArticle: "/images/Kuwait_contract_article.jpg",
  newsStar: "/images/News_Star.jpg",
  noOrdinaryJoe: "/images/No_ordinary_Joe.jpg",
  alexandriaDaily: "/images/Alexandria_Daily.jpg",
  hofArticle: "/images/HOF_induction_ceremony_article.jpg",
  retired40: "/images/40_Retired_article.jpg",
  galeSayers: "/images/Gale_Sayers.jpg",
  buckhead: "/images/Brockhead_club.jpg",
  daveEmanuel: "/images/Dave_Emmanuel_.jpg",
  wandaGift: "/images/Wanda.jpg",
};

// ─── GALLERY DATA (all 61+ images organized by category) ───
const GALLERY_CATEGORIES = ["All", "Athletics", "Business", "Leadership", "Service", "Family", "Press", "Legacy"];

const GALLERY_ITEMS = [
  // ATHLETICS
  { src: IMG.thePick, cat: "Athletics", title: "The #1 Draft Pick", caption: "Joe Profit receives his No. 23 Jersey, presented by head coach Norm Van Brocklin of the Atlanta Falcons." },
  { src: IMG.falcons, cat: "Athletics", title: "Leading the Roster", caption: "Joe Profit NFL Leading Roster for the Atlanta Falcons." },
  { src: IMG.touchdown, cat: "Athletics", title: "Touchdown!", caption: "Arms raised, crowd roaring — touchdown at Louisiana Monroe. The scoreboard tells the story." },
  { src: IMG.kickoff, cat: "Athletics", title: "Kickoff Return", caption: "Joe Profit returns kickoff for the Atlanta Falcons." },
  { src: IMG.cutDime, cat: "Athletics", title: "Cut on a Dime", caption: "Atlanta Falcons Joe Profit cut on a dime." },
  { src: IMG.gameball, cat: "Athletics", title: "The Game Ball", caption: "Joe Profit presented the Atlanta Falcons Game Ball for his performance during 44–14 win over the Cincinnati Bengals." },
  { src: IMG.runTD, cat: "Athletics", title: "Running for the TD", caption: "NLU's Joe Profit runs for a TD lead by QB Steve Mansur!" },
  { src: IMG.saints, cat: "Athletics", title: "New Orleans Saints", caption: "Joe Profit gain 8.5 yards a carry against San Diego Chargers, for the New Orleans Saints." },
  { src: IMG.allAmerican, cat: "Athletics", title: "World Football League", caption: "Joe Profit scores the first touchdown in the World Football league for Birmingham." },
  { src: IMG.swayze, cat: "Athletics", title: "Swayze Elementary #40", caption: "Young Joe at Swayze Elementary — where the legend first took shape." },
  { src: IMG.plaque, cat: "Athletics", title: "Hall of Fame Plaque", caption: "The first black athlete in the Gulf States Conference. The first and only first-round NFL Draft pick from NLU." },
  { src: IMG.coachDale, cat: "Athletics", title: "Coach Dale Brown", caption: "Legendary Coach Dale Brown and Joe Profit at their induction into the Louisiana Sports Hall of Fame." },
  { src: IMG.shack, cat: "Athletics", title: "Shack Harris", caption: "James 'Shack' Harris (Pro-Bowl MVP) and Joe Profit at the Black Football HOF Event." },
  { src: IMG.pi, cat: "Athletics", title: "Black College Football HOF", caption: "PI and Dr. Joe Profit at the Black College Football Hall of Fame Induction Ceremony." },
  { src: IMG.daveEmanuel, cat: "Athletics", title: "Falcons Training Camp", caption: "Joe Profit and Dave Emanuel, VIP guest at Falcons Training Camp Luncheon." },
  { src: IMG.boots, cat: "Athletics", title: "The Brogan Boots", caption: "The heavy work boots Joe wore to his first football practice. Too poor for sneakers — these boots built 'Joe the Jet.'" },
  // BUSINESS
  { src: IMG.cii, cat: "Business", title: "Operation Phone Home", caption: "CII's mobile communications center during Desert Storm, outside Kuwait City. The $50M contract — largest ever awarded to a U.S. minority-owned company." },
  { src: IMG.ali, cat: "Business", title: "The Ali Telephone", caption: "Dr. Profit brings Muhammad Ali to Atlanta to present the Muhammad Ali Telephone™ designed and manufactured by Profit's Company." },
  { src: IMG.uae, cat: "Business", title: "UAE Operations", caption: "Profit meets with his Middle East Director of Operations in the United Arab Emirates." },
  { src: IMG.bodyBuilder, cat: "Business", title: "The Body Builder", caption: "Dr. Joseph Profit, the body builder — discipline in every arena." },
  // LEADERSHIP
  { src: IMG.reagan, cat: "Leadership", title: "With President Reagan", caption: "President Ronald Reagan welcomes Dr. Joe Profit to the White House." },
  { src: IMG.aliPress, cat: "Leadership", title: "Press Conference", caption: "Dr. Joe Profit with Atlanta's Mayor Maynard Jackson, Muhammad Ali, and others." },
  { src: IMG.ambassador, cat: "Leadership", title: "Ambassador Young", caption: "Dr. Joe Profit with Ambassador Andrew Young." },
  { src: IMG.artBlank, cat: "Leadership", title: "Arthur Blank", caption: "Dr. Joe Profit, wife Wanda, and Atlanta Falcons owner Arthur Blank at an Atlanta charity event." },
  { src: IMG.satcher, cat: "Leadership", title: "Surgeon General", caption: "Dr. Joe Profit with Doctor David Satcher, U.S. Surgeon General, after a health and wellness meeting." },
  { src: IMG.speaks, cat: "Leadership", title: "ULM Economics Class", caption: "Dr. Joe Profit delivers his business strategy to an economic class on ULM campus." },
  { src: IMG.ulmInterview, cat: "Leadership", title: "ULM Pursuit Event", caption: "Dr. Joe Profit press interview after delivering ULM annual Pursuit event." },
  { src: IMG.buckhead, cat: "Leadership", title: "Buckhead Convention", caption: "Dr. Joe Profit speaks at Atlanta's Buckhead Community Convention Center." },
  { src: IMG.brunno, cat: "Leadership", title: "ULM President", caption: "Dr. Joe Profit and ULM President Dr. Nick Bruno share a laugh at an Alumni event." },
  // SERVICE
  { src: IMG.yup, cat: "Service", title: "Young Authors Program", caption: "Building the next generation of storytellers. Legends & Kids Young Authors Program graduates at their book reveal." },
  { src: IMG.dakota, cat: "Service", title: "YUP Kid of the Year", caption: "Dr. Joe Profit with YUP 'Kid of the Year' Dakota Young after a special ceremony in Atlanta." },
  { src: IMG.nextGenAuthors, cat: "Service", title: "Words That Change Worlds", caption: "Celebrating the Next Generation of Authors — the glow of self-accomplishment on her face." },
  { src: IMG.katrina, cat: "Service", title: "Hurricane Katrina Rescue", caption: "Ranger Jones, The Honorable Joe R. Reeder, Under Secretary Army, Louis Bulter and Dr. Joe Profit." },
  { src: IMG.reverend, cat: "Service", title: "Ordained to Serve", caption: "Dr. Joseph Profit, Ordained to Serve, 2015." },
  { src: IMG.holyfield, cat: "Service", title: "Charity Golf", caption: "Joe Profit hosts golf tournament and invites the world heavyweight Boxing champion Evander Holyfield." },
  { src: IMG.galeSayers, cat: "Service", title: "Fighting Sickle Cell", caption: "Gale Sayers and Joe Profit join in the fight against Sickle Cell Anemia." },
  // FAMILY
  { src: IMG.wanda, cat: "Family", title: "Joe & Wanda", caption: "Dr. Joe Profit and his wife Wanda." },
  { src: IMG.wandaDinner, cat: "Family", title: "Foundation Fundraiser", caption: "Dr. Joe Profit and his wife Wanda at one of their Foundation Fundraising Events." },
  { src: IMG.son, cat: "Family", title: "Father & Son", caption: "Dr. Joe Profit and son Joe Jr. poses with American Best and Brightest Businessman award." },
  { src: IMG.friends, cat: "Family", title: "Friends for Life", caption: "Childhood friends: Perry Thomas, Don Zimmerman, Dr. Joe Profit, and Rubin Jones — Friends and Teammates for life!" },
  { src: IMG.wandaGift, cat: "Family", title: "Wanda's Birthday", caption: "Wanda Profit, show-off new birthday gift." },
  { src: IMG.gate, cat: "Family", title: "Atlanta Home", caption: "Dr. Joe Profit Atlanta Home." },
  // PRESS
  { src: IMG.essenceArticle, cat: "Press", title: "Essence Magazine", caption: "Dr. Joe Profit inspires a decade of business leaders in Essence magazine." },
  { src: IMG.wallStreet, cat: "Press", title: "Wall Street Journal", caption: "Quoted as a national advocate to expand access for small minority-owned firms." },
  { src: IMG.usaToday, cat: "Press", title: "USA Today", caption: "Joe Profit, CEO runs his company like a winning Football Team." },
  { src: IMG.gwinnett, cat: "Press", title: "Gwinnett Business", caption: "Ex-Falcon Joe Profit Lives Up to His Name With Successful Firm." },
  { src: IMG.kuwaitArticle, cat: "Press", title: "Kuwait Contract", caption: "Dr. Joe Profit's company wins a $50 million contract in Kuwait." },
  { src: IMG.alexandriaDaily, cat: "Press", title: "7th Best in the Nation", caption: "Alexandria Daily Town Talk: Joe Profit is ranked 7th Best College Football Player." },
  { src: IMG.noOrdinaryJoe, cat: "Press", title: "No Ordinary Joe", caption: "He is no ordinary Joe." },
  { src: IMG.millionaire, cat: "Press", title: "American Success Story", caption: "A true American Success Story — Is both Inspirational and Informative." },
  { src: IMG.sba, cat: "Press", title: "SBA Rally", caption: "Joe Profit leads rally to save SBA from budget cutbacks." },
  { src: IMG.nluArticle, cat: "Press", title: "NLU Commencement", caption: "Dr. Joe Profit delivers commencement address to NLU graduates." },
  { src: IMG.multimediaArticle, cat: "Press", title: "Multimedia Firm", caption: "Founder and CEO of an Atlanta-based multimedia firm, runs his company like a well coached football team." },
  { src: IMG.multiMillionContract, cat: "Press", title: "Multimillion Dollar", caption: "Dr. Joe Profit interviews on Multimillion dollar contract." },
  { src: IMG.ciiArticle, cat: "Press", title: "CII Success", caption: "Dr. Joe Profit finds success in the communications and multimedia business." },
  { src: IMG.minorityBiz, cat: "Press", title: "Minority Business", caption: "Shares panel on Minority Business Development Agency for opportunities in D.C." },
  { src: IMG.newsStar, cat: "Press", title: "News Star", caption: "Joe Profit toils off the field to become a top business man." },
  { src: IMG.hofArticle, cat: "Press", title: "HOF Induction", caption: "Joe Profit Hall of Fame Inductions ceremony." },
  { src: IMG.retired40, cat: "Press", title: "#40 Retired", caption: "ULM retires Joe Profit Number 40." },
  // LEGACY
  { src: IMG.book, cat: "Legacy", title: "Never Broken", caption: "The book that tells it all — Never Broken." },
  { src: IMG.signing, cat: "Legacy", title: "Fields of Success", caption: "Dr. Joe Profit signs a copy of his first book FIELDS OF SUCCESS on a book tour." },
  { src: IMG.cotton, cat: "Legacy", title: "The Cotton Fields", caption: "Lake Providence, Louisiana — where it all began." },
];

// ─── SCROLL ANIMATION HOOK ───
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── PARALLAX HOOK ───
function useParallax(speed = 0.3) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const center = rect.top + rect.height / 2 - windowH / 2;
      setOffset(center * speed);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [speed]);
  return [ref, offset];
}

// ─── FILM GRAIN ───
function Grain() {
  return <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", opacity: 0.04, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px" }} />;
}

// ─── NAVIGATION ───
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { label: "Story", href: "#story" }, { label: "Archive", href: "#archive" },
    { label: "Timeline", href: "#timeline" }, { label: "Charity", href: "#charity" },
    { label: "Book", href: "#book" }, { label: "Contact", href: "#contact" },
  ];
  const navBg = scrolled ? "rgba(10,9,8,0.92)" : "transparent";
  const navBorder = scrolled ? C.lineBright : "transparent";
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.5s ease", background: navBg, borderBottom: `1px solid ${navBorder}`, backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? 56 : 72, transition: "height 0.5s ease" }}>
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: FONT.display, fontSize: "1.1rem", fontWeight: 700, color: C.gold, letterSpacing: "0.04em" }}>JOE PROFIT</span>
          <span style={{ fontFamily: FONT.body, fontSize: "0.55rem", color: C.muted, letterSpacing: "0.3em", textTransform: "uppercase" }}>Never Broken</span>
        </a>
        <div className="dnav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.muted, textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.3s" }}
              onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.muted}>{l.label}</a>
          ))}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-nav-btn" style={{ display: "none", background: "none", border: "none", color: C.gold, fontSize: "1.5rem", cursor: "pointer" }}>☰</button>
      </div>
      {mobileOpen && (
        <div style={{ background: C.black, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16, borderTop: `1px solid ${C.line}` }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.cream, textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase" }}>{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HERO WITH PARALLAX ───
function HeroSection() {
  const [pRef, pOffset] = useParallax(0.4);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);
  return (
    <section ref={pRef} style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${pOffset}px) scale(1.15)`, transition: "transform 0.05s linear", background: `url(${IMG.hero}) center/cover no-repeat`, filter: "brightness(0.35) contrast(1.1) saturate(0.8)" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(10,9,8,0.3) 0%, rgba(10,9,8,0.1) 40%, rgba(10,9,8,0.7) 75%, ${C.black} 100%)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: `linear-gradient(to top, ${C.black}, transparent)` }} />
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(24px, 6vw, 120px)", paddingBottom: "clamp(60px, 12vh, 140px)" }}>
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 1.2s cubic-bezier(0.23,1,0.32,1)" }}>
          <div style={{ fontFamily: FONT.body, fontSize: "clamp(0.6rem, 1vw, 0.75rem)", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16, opacity: 0.9 }}>
            NFL Draft Pick · Business Pioneer · Servant Leader
          </div>
          <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 700, color: C.cream, lineHeight: 0.92, margin: 0, letterSpacing: "-0.02em" }}>
            Never<br /><span style={{ fontStyle: "italic", color: C.gold }}>Broken</span>
          </h1>
          <p style={{ fontFamily: FONT.body, fontSize: "clamp(0.85rem, 1.4vw, 1.05rem)", color: C.mutedLight, maxWidth: 520, marginTop: 24, lineHeight: 1.7, opacity: loaded ? 0.85 : 0, transition: "opacity 1.5s ease 0.4s" }}>
            From cotton fields to the NFL. From the White House to the boardroom. The story of Dr. Joe Profit — a man who refused to stay down.
          </p>
        </div>
        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 2s ease 1s", marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="#story" style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.black, background: C.gold, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s", borderRadius: 0 }}
            onMouseEnter={e => { e.target.style.background = C.goldLight; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = C.gold; e.target.style.transform = "translateY(0)"; }}>
            Enter the Story
          </a>
          <a href="#book" style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.gold, border: `1px solid ${C.gold}`, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.background = C.goldDim; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; }}>
            Get the Book
          </a>
        </div>
      </div>
      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: loaded ? 0.4 : 0, transition: "opacity 2s ease 1.5s" }}>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${C.gold})`, animation: "pulse 2s ease infinite" }} />
      </div>
    </section>
  );
}

// ─── MARQUEE TICKER ───
function Marquee() {
  const items = ["7th Pick Overall · 1971 NFL Draft", "169 Yards & 2 TDs — Single Game Record", "$50 Million Kuwait Contract", "INC. 500 Fastest Growing Companies", "Louisiana Sports Hall of Fame", "Black College Football Hall of Fame", "Muhammad Ali Telephone™", "Operation Phone Home — Desert Storm", "Youth United for Prosperity Foundation", "Martin Luther King Jr. Holiday Act"];
  const txt = items.join("  ◆  ");
  return (
    <div style={{ background: C.dark3, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", animation: "marquee 60s linear infinite" }}>
        <span style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>{txt}{"  ◆  "}{txt}</span>
      </div>
    </div>
  );
}

// ─── STORY CHAPTERS ───
function StorySection() {
  const [ref, vis] = useScrollReveal(0.1);
  const chapters = [
    { img: IMG.cotton, num: "I", title: "Roots", sub: "Lake Providence, Louisiana", text: "Before there were football fields, there were cotton fields — where a young boy learned that hard work wasn't optional, it was survival." },
    { img: IMG.swayze, num: "II", title: "The Brogan Boots", sub: "Swayze Elementary", text: "Too poor for sneakers, Joe showed up to football in work boots. They laughed. By the end of the season, nobody was laughing." },
    { img: IMG.touchdown, num: "III", title: "Breaking Barriers", sub: "Northeast Louisiana University", text: "The first Black athlete in the Gulf States Conference. Spat on by opponents, silenced by segregation — then a 95-yard kickoff return turned a hostile crowd into believers." },
    { img: IMG.thePick, num: "IV", title: "The Draft", sub: "Atlanta Falcons · 1971", text: "7th pick overall. The longest holdout in Falcons history. Then an ACL tear that would have ended most careers. Joe came back stronger." },
    { img: IMG.cii, num: "V", title: "Empire", sub: "CII · INC. 500", text: "From Burger King franchises (poetic justice for a man once denied service at Burger Chef) to the largest government contract ever awarded to a minority-owned firm — $50 million in Kuwait." },
    { img: IMG.reagan, num: "VI", title: "Power & Purpose", sub: "The White House", text: "Advising presidents. Helping make the MLK Holiday law. Operation Phone Home during Desert Storm. Power used for purpose." },
  ];
  return (
    <section id="story" style={{ padding: "clamp(60px, 10vw, 120px) 0", background: C.black }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
        <div style={{ marginBottom: 60, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Chapters</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3.2rem)", color: C.cream, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>A Life in <span style={{ fontStyle: "italic", color: C.gold }}>Six Acts</span></h2>
        </div>
        <div className="chgrid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
          {chapters.map((ch, i) => <ChapterCard key={i} ch={ch} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function ChapterCard({ ch, i }) {
  const [ref, vis] = useScrollReveal(0.15);
  const [hover, setHover] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", cursor: "pointer", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(40px)", transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 0.1}s` }}>
      <div style={{ position: "absolute", inset: 0, background: `url(${ch.img}) center/cover`, transform: hover ? "scale(1.08)" : "scale(1)", transition: "transform 0.8s cubic-bezier(0.23,1,0.32,1)", filter: "brightness(0.5) contrast(1.05)" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 30%, rgba(10,9,8,0.9) 100%)` }} />
      <div style={{ position: "absolute", top: 16, left: 16, fontFamily: FONT.display, fontSize: "0.7rem", color: C.gold, fontStyle: "italic", opacity: 0.7 }}>{ch.num}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px", transform: hover ? "translateY(0)" : "translateY(8px)", transition: "transform 0.5s ease" }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.55rem", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{ch.sub}</div>
        <h3 style={{ fontFamily: FONT.display, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: C.cream, fontWeight: 600, margin: "0 0 8px 0", lineHeight: 1.2 }}>{ch.title}</h3>
        <p style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.mutedLight, lineHeight: 1.6, margin: 0, opacity: hover ? 1 : 0, maxHeight: hover ? 100 : 0, transition: "all 0.5s ease" }}>{ch.text}</p>
      </div>
    </div>
  );
}

// ─── PARALLAX QUOTE BREAK ───
function ParallaxQuote({ quote, attribution }) {
  const [pRef, pOffset] = useParallax(0.2);
  const [ref, vis] = useScrollReveal(0.3);
  return (
    <section ref={pRef} style={{ position: "relative", padding: "clamp(80px, 15vw, 180px) 0", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: C.dark3 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, ${-50 + pOffset * 0.5}%) scale(${1 + Math.abs(pOffset) * 0.001})`, fontFamily: FONT.display, fontSize: "clamp(12rem, 30vw, 28rem)", color: "rgba(212,162,78,0.03)", fontWeight: 700, lineHeight: 0.8, whiteSpace: "nowrap", pointerEvents: "none" }}>40</div>
      <div ref={ref} style={{ position: "relative", zIndex: 2, maxWidth: 800, margin: "0 auto", padding: "0 clamp(24px, 6vw, 60px)", textAlign: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 1s ease" }}>
        <div style={{ width: 40, height: 1, background: C.gold, margin: "0 auto 30px", opacity: 0.5 }} />
        <blockquote style={{ fontFamily: FONT.display, fontSize: "clamp(1.3rem, 3vw, 2.2rem)", color: C.cream, fontStyle: "italic", lineHeight: 1.5, margin: 0, fontWeight: 400 }}>"{quote}"</blockquote>
        <div style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.gold, letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 24 }}>— {attribution}</div>
        <div style={{ width: 40, height: 1, background: C.gold, margin: "30px auto 0", opacity: 0.5 }} />
      </div>
    </section>
  );
}

// ─── ARCHIVE / GALLERY ───
function ArchiveSection() {
  const [ref, vis] = useScrollReveal(0.05);
  const [activeCat, setActiveCat] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [zoom, setZoom] = useState(1);

  const filtered = useMemo(() => activeCat === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.cat === activeCat), [activeCat]);

  const closeLightbox = () => { setLightbox(null); setZoom(1); };

  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") closeLightbox(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <section id="archive" style={{ padding: "clamp(60px, 10vw, 120px) 0", background: C.dark }}>
      <div ref={ref} style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 3vw, 40px)" }}>
        {/* Header */}
        <div style={{ marginBottom: 20, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Archive</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.cream, fontWeight: 600, margin: "0 0 8px 0" }}>A Legacy <span style={{ fontStyle: "italic", color: C.gold }}>Reclaimed</span></h2>
          <p style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.muted, maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
            A house fire nearly erased decades of history. This archive exists because someone refused to let that story disappear.
          </p>
        </div>
        {/* Category Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32, opacity: vis ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}>
          {GALLERY_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              style={{ fontFamily: FONT.body, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 18px", border: `1px solid ${activeCat === cat ? C.gold : C.lineBright}`, background: activeCat === cat ? C.gold : "transparent", color: activeCat === cat ? C.black : C.muted, cursor: "pointer", transition: "all 0.3s", fontWeight: activeCat === cat ? 700 : 400 }}>
              {cat}
            </button>
          ))}
        </div>
        {/* Masonry Grid */}
        <div style={{ columns: "clamp(1, 20vw, 4)", columnCount: window.innerWidth < 600 ? 2 : window.innerWidth < 900 ? 3 : 4, columnGap: 6 }}>
          {filtered.map((item, i) => <GalleryCard key={`${activeCat}-${i}`} item={item} i={i} onClick={() => setLightbox(item)} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 32, fontFamily: FONT.body, fontSize: "0.65rem", color: C.muted, letterSpacing: "0.15em" }}>
          Showing {filtered.length} of {GALLERY_ITEMS.length} items
        </div>
      </div>
      {/* Lightbox */}
      {lightbox && (
        <div onClick={closeLightbox} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.3s ease", cursor: "zoom-out" }}>
          <div style={{ position: "absolute", top: 16, right: 20, display: "flex", gap: 12 }}>
            <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.5, 3)); }} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "1.2rem", width: 36, height: 36, cursor: "pointer", borderRadius: 4 }}>+</button>
            <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.5, 0.5)); }} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "1.2rem", width: 36, height: 36, cursor: "pointer", borderRadius: 4 }}>−</button>
            <button onClick={closeLightbox} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "1.2rem", width: 36, height: 36, cursor: "pointer", borderRadius: 4 }}>✕</button>
          </div>
          <img src={lightbox.src} alt={lightbox.title} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", transform: `scale(${zoom})`, transition: "transform 0.3s ease", cursor: zoom > 1 ? "grab" : "zoom-in" }} />
          <div style={{ marginTop: 20, textAlign: "center", maxWidth: 600 }}>
            <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.cream, marginBottom: 4 }}>{lightbox.title}</div>
            <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.muted, lineHeight: 1.6 }}>{lightbox.caption}</div>
          </div>
        </div>
      )}
    </section>
  );
}

function GalleryCard({ item, i, onClick }) {
  const [ref, vis] = useScrollReveal(0.1);
  const [hover, setHover] = useState(false);
  return (
    <div ref={ref} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ breakInside: "avoid", marginBottom: 6, position: "relative", overflow: "hidden", cursor: "pointer", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all 0.6s ease ${(i % 8) * 0.05}s` }}>
      <img src={item.src} alt={item.title} style={{ width: "100%", display: "block", transform: hover ? "scale(1.04)" : "scale(1)", transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)", filter: hover ? "brightness(0.7)" : "brightness(0.85)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "30px 12px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)", opacity: hover ? 1 : 0, transform: hover ? "translateY(0)" : "translateY(8px)", transition: "all 0.4s ease" }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.5rem", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>{item.cat}</div>
        <div style={{ fontFamily: FONT.display, fontSize: "0.8rem", color: C.cream, fontWeight: 600 }}>{item.title}</div>
      </div>
    </div>
  );
}

// ─── TIMELINE ───
function TimelineSection() {
  const [ref, vis] = useScrollReveal(0.1);
  const events = [
    { year: "1948", title: "Born in Louisiana", text: "Lake Providence — one of the poorest towns in America." },
    { year: "1962", title: "Swayze Elementary", text: "Young Joe discovers football in heavy work boots." },
    { year: "1967", title: "First Black Athlete", text: "Breaks the color barrier at Northeast Louisiana University." },
    { year: "1971", title: "NFL Draft Day", text: "7th pick overall, 1st round — Atlanta Falcons." },
    { year: "1972", title: "NFL Rushing Leader", text: "169 yards and 2 TDs in a single game. Franchise record." },
    { year: "1976", title: "Business Begins", text: "Burger King franchise — poetic justice for a man denied service." },
    { year: "1981", title: "The White House", text: "Advising President Reagan. Helping pass the MLK Holiday." },
    { year: "1982", title: "Ali Telephone™", text: "CII manufactures the Muhammad Ali Telephone. Ali becomes a friend." },
    { year: "1991", title: "Operation Phone Home", text: "$50M Kuwait contract. Troops call home for free." },
    { year: "1993", title: "INC. 500", text: "CII named one of America's fastest growing companies." },
    { year: "1999", title: "Hall of Fame", text: "Inducted into the Louisiana Sports Hall of Fame. #40 retired." },
    { year: "2015", title: "Ordained to Serve", text: "Dr. Joseph Profit becomes Reverend Joseph Profit." },
    { year: "2026", title: "Never Broken", text: "The book. The story. The legacy preserved." },
  ];
  return (
    <section id="timeline" style={{ padding: "clamp(60px, 10vw, 120px) 0", background: C.black }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
        <div style={{ textAlign: "center", marginBottom: 60, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Journey</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.cream, fontWeight: 600, margin: 0 }}>Seven <span style={{ fontStyle: "italic", color: C.gold }}>Decades</span></h2>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${C.gold}, ${C.gold}, transparent)`, opacity: 0.2 }} />
          {events.map((ev, i) => <TimelineItem key={i} ev={ev} i={i} isLeft={i % 2 === 0} />)}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ ev, i, isLeft }) {
  const [ref, vis] = useScrollReveal(0.2);
  return (
    <div ref={ref} style={{ display: "flex", justifyContent: isLeft ? "flex-end" : "flex-start", paddingLeft: isLeft ? 0 : "52%", paddingRight: isLeft ? "52%" : 0, marginBottom: 40, position: "relative", opacity: vis ? 1 : 0, transform: vis ? "none" : `translateX(${isLeft ? -30 : 30}px)`, transition: `all 0.7s ease ${i * 0.05}s` }}>
      <div style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", width: 10, height: 10, borderRadius: "50%", background: vis ? C.gold : C.dark, border: `2px solid ${C.gold}`, transition: "background 0.5s ease", zIndex: 2 }} />
      <div style={{ textAlign: isLeft ? "right" : "left" }}>
        <div style={{ fontFamily: FONT.display, fontSize: "0.85rem", color: C.gold, fontStyle: "italic", marginBottom: 4 }}>{ev.year}</div>
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.cream, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
        <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.muted, lineHeight: 1.6 }}>{ev.text}</div>
      </div>
    </div>
  );
}

// ─── CHARITY / YUP SECTION ───
function CharitySection() {
  const [ref, vis] = useScrollReveal(0.1);
  const [pRef, pOffset] = useParallax(0.15);
  return (
    <section id="charity" ref={pRef} style={{ position: "relative", padding: "clamp(80px, 12vw, 140px) 0", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `url(${IMG.yup}) center/cover`, filter: "brightness(0.2) saturate(0.6)", transform: `translateY(${pOffset}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(10,9,8,0.95) 0%, rgba(10,9,8,0.7) 50%, rgba(10,9,8,0.95) 100%)` }} />
      <div ref={ref} style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="chgrid">
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-30px)", transition: "all 0.8s ease" }}>
            <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>Giving Back</div>
            <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: C.cream, fontWeight: 600, margin: "0 0 20px 0", lineHeight: 1.15 }}>Youth United for <span style={{ fontStyle: "italic", color: C.gold }}>Prosperity</span></h2>
            <p style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.mutedLight, lineHeight: 1.8, marginBottom: 16 }}>
              The YUP Foundation empowers the next generation through literacy, entrepreneurship, and mentorship. From the Legends & Kids Young Authors Program — where students become published authors — to community service initiatives across Atlanta, Joe's mission is clear: lift as you climb.
            </p>
            <p style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.mutedLight, lineHeight: 1.8, marginBottom: 28 }}>
              Every dollar donated goes directly to programming that puts books in hands, confidence in hearts, and futures within reach.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contact" style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.black, background: C.gold, padding: "12px 28px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
                onMouseEnter={e => e.target.style.background = C.goldLight}
                onMouseLeave={e => e.target.style.background = C.gold}>
                Donate Now
              </a>
              <a href="https://youthunitedpro.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.gold, border: `1px solid ${C.gold}`, padding: "12px 28px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", transition: "all 0.3s" }}
                onMouseEnter={e => e.target.style.background = C.goldDim}
                onMouseLeave={e => e.target.style.background = "transparent"}>
                Visit YUP Foundation
              </a>
            </div>
          </div>
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(30px)", transition: "all 0.8s ease 0.2s", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img src={IMG.dakota} alt="YUP Kid of the Year" style={{ width: "100%", display: "block", filter: "brightness(0.85) contrast(1.05)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 14px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.15em" }}>YUP "Kid of the Year" Dakota Young</div>
              </div>
            </div>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img src={IMG.nextGenAuthors} alt="Next Gen Authors" style={{ width: "100%", display: "block", filter: "brightness(0.85) contrast(1.05)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 14px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.15em" }}>Words That Change Worlds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BOOK TRAILER SECTION ───
function BookTrailerSection() {
  const [ref, vis] = useScrollReveal(0.15);
  return (
    <section style={{ padding: "clamp(60px, 10vw, 100px) 0", background: C.dark3 }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)", textAlign: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>Coming Soon</div>
        <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: C.cream, fontWeight: 600, margin: "0 0 16px 0" }}>The Book <span style={{ fontStyle: "italic", color: C.gold }}>Trailer</span></h2>
        <p style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.muted, lineHeight: 1.7, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          A cinematic journey through Joe's extraordinary life — coming soon.
        </p>
        {/* Video embed placeholder — replace data-video-id with actual YouTube/Vimeo ID */}
        <div style={{ position: "relative", aspectRatio: "16/9", background: C.dark, border: `1px solid ${C.lineBright}`, overflow: "hidden" }} data-video-id="BOOK_TRAILER_ID">
          <div style={{ position: "absolute", inset: 0, background: `url(${IMG.hero}) center/cover`, filter: "brightness(0.3) blur(2px)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(212,162,78,0.1)", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(212,162,78,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(212,162,78,0.1)"}>
              <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `22px solid ${C.gold}`, marginLeft: 4 }} />
            </div>
            <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 16 }}>Watch Trailer</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BOOK / PURCHASE SECTION ───
function BookSection() {
  const [ref, vis] = useScrollReveal(0.15);
  return (
    <section id="book" style={{ padding: "clamp(60px, 10vw, 120px) 0", background: C.black }}>
      <div ref={ref} style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
        <div className="bkgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "center" }}>
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px) rotate(-2deg)", transition: "all 0.8s ease" }}>
            <div style={{ position: "relative", boxShadow: "24px 24px 60px rgba(0,0,0,0.5), -4px -4px 20px rgba(212,162,78,0.05)" }}>
              <img src={IMG.book} alt="Never Broken" style={{ width: "100%", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 40px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease 0.2s" }}>
            <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Book</div>
            <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.cream, fontWeight: 600, margin: "0 0 20px 0", lineHeight: 1.1 }}>Never <span style={{ fontStyle: "italic", color: C.gold }}>Broken</span></h2>
            <p style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.mutedLight, lineHeight: 1.8, marginBottom: 12 }}>
              From the cotton fields of Louisiana to the NFL draft stage. From the Oval Office to the battlefields of Kuwait. This is the story of a man who was told no a thousand times and answered yes every single time.
            </p>
            <p style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.mutedLight, lineHeight: 1.8, marginBottom: 28 }}>
              "Never Broken" is more than a memoir — it's a blueprint for resilience, written by a man who lived every word.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contact" style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.black, background: C.gold, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
                onMouseEnter={e => e.target.style.background = C.goldLight}
                onMouseLeave={e => e.target.style.background = C.gold}>
                Order Now
              </a>
              <a href="#contact" style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.gold, border: `1px solid ${C.gold}`, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", transition: "all 0.3s" }}
                onMouseEnter={e => e.target.style.background = C.goldDim}
                onMouseLeave={e => e.target.style.background = "transparent"}>
                Book a Speaking Engagement
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ───
function ContactSection() {
  const [ref, vis] = useScrollReveal(0.15);
  return (
    <section id="contact" style={{ padding: "clamp(60px, 10vw, 100px) 0", background: C.dark, borderTop: `1px solid ${C.line}` }}>
      <div ref={ref} style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)", textAlign: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>Get in Touch</div>
        <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: C.cream, fontWeight: 600, margin: "0 0 16px 0" }}>Continue the <span style={{ fontStyle: "italic", color: C.gold }}>Conversation</span></h2>
        <p style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>
          For book orders, speaking engagements, charitable donations, or media inquiries.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="mailto:contact@joeprofit.com" style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.black, background: C.gold, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
            onMouseEnter={e => e.target.style.background = C.goldLight}
            onMouseLeave={e => e.target.style.background = C.gold}>
            Email Us
          </a>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Order the Book", desc: "Hardcover & digital editions", icon: "📖" },
            { label: "Donate to YUP", desc: "Support youth literacy", icon: "🎓" },
            { label: "Book Joe to Speak", desc: "Keynotes & events", icon: "🎤" },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center", padding: 20, border: `1px solid ${C.line}`, flex: "1 1 160px", maxWidth: 200, transition: "all 0.3s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.line}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.cream, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontFamily: FONT.body, fontSize: "0.6rem", color: C.muted }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───
function Footer() {
  return (
    <footer style={{ padding: "30px 24px", background: C.black, borderTop: `1px solid ${C.line}`, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ fontFamily: FONT.display, fontSize: "0.8rem", color: C.gold, letterSpacing: "0.06em" }}>Dr. Joe Profit</div>
      <div style={{ fontFamily: FONT.body, fontSize: "0.55rem", color: C.muted, letterSpacing: "0.15em" }}>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>
      <div style={{ fontFamily: FONT.body, fontSize: "0.5rem", color: "rgba(154,142,127,0.3)", letterSpacing: "0.3em", textTransform: "uppercase" }}>A Legends Series Production</div>
    </footer>
  );
}

// ─── APP ───
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:${C.black};overflow-x:hidden}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scaleY(1)}50%{opacity:0.25;transform:scaleY(0.5)}}
        a:hover{opacity:0.85}
        ::selection{background:${C.gold};color:${C.black}}
        img{-webkit-user-drag:none}
        @media(max-width:820px){
          .dnav{display:none!important}
          .mobile-nav-btn{display:block!important}
          .chgrid{grid-template-columns:1fr!important;direction:ltr!important}
          .bkgrid{grid-template-columns:1fr!important}
        }
      `}</style>
      <Grain />
      <Nav />
      <HeroSection />
      <Marquee />
      <StorySection />
      <ParallaxQuote quote="They can break your body, but they can never break your spirit. That's the one thing you own outright." attribution="Dr. Joe Profit" />
      <ArchiveSection />
      <TimelineSection />
      <ParallaxQuote quote="Every morning the sun rises again. No matter what happened yesterday, you get another chance. That's not optimism — that's a fact." attribution="Dr. Joe Profit" />
      <CharitySection />
      <BookTrailerSection />
      <BookSection />
      <ContactSection />
      <Footer />
    </>
  );
}
