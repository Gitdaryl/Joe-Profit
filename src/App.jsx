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

// ─── CHAPTER PAGE DATA ───
const CHAPTERS = [
  {
    num: "I", slug: "roots", title: "Roots", sub: "Lake Providence, Louisiana",
    hero: IMG.cotton, audio: "/audio/chapter-1-roots.mp3",
    pullQuote: "Lake Providence didn't give me much. But it gave me everything I needed.",
    paragraphs: [
      "Joe Profit was born in Lake Providence, Louisiana — at one point called the poorest town in America. Not the poorest Black town. The poorest town, period.",
      "His family worked the cotton fields. Up before the sun, down after dark. Joe was picking cotton before he was old enough to understand what poverty meant. But he understood work. He understood that nothing was going to be handed to him.",
      "Lake Providence was a place where dreams went to die — unless you had the fire to carry them out yourself. Joe had that fire. It burned in the cotton rows, it burned through the Louisiana heat, and it never went out.",
      "Everything that came after — the football, the NFL, the business empire, the White House — all of it traces back to those fields. Every row picked, every blister earned, every morning watching his family push through exhaustion. That's where the man was forged."
    ],
    images: [
      { src: IMG.cotton, caption: "The cotton fields of Lake Providence, Louisiana." },
      { src: IMG.boots, caption: "The Brogan Boots — too poor for sneakers, these boots built 'Joe the Jet.'" },
      { src: IMG.friends, caption: "Childhood friends: Perry Thomas, Don Zimmerman, Dr. Joe Profit, and Rubin Jones — Friends and Teammates for life!" },
    ],
    nextChapter: "brogan-boots",
  },
  {
    num: "II", slug: "brogan-boots", title: "The Brogan Boots", sub: "Swayze Elementary",
    hero: IMG.swayze, audio: "/audio/chapter-2-brogan-boots.mp3",
    pullQuote: "Whatever burden you're carrying — it's not holding you back. It's training you for what's coming next.",
    paragraphs: [
      "When Joe showed up to his first football practice at Swayze Elementary, he didn't have sneakers. He didn't have cleats. He had his work boots — big, heavy brogan boots worn in the fields.",
      "The other kids laughed. But those boots became the most important piece of equipment Joe ever wore. Running in heavy boots every day built leg strength and endurance that no training program could match.",
      "When someone finally gave him a real pair of shoes, Joe didn't just run — he flew. That's how he became 'Joe the Jet.' The nickname that would follow him from the schoolyard to the NFL.",
      "By the end of that first season, nobody was laughing anymore. The kid in the work boots was the fastest player on the field. And he carried that lesson his entire life: the things that are supposed to hold you back are actually preparing you for what's coming next."
    ],
    images: [
      { src: IMG.swayze, caption: "Young Joe (#40) at Swayze Elementary in Monroe, Louisiana." },
      { src: IMG.boots, caption: "The heavy work boots Joe wore to his first football practice." },
    ],
    nextChapter: "breaking-barriers",
  },
  {
    num: "III", slug: "breaking-barriers", title: "Breaking Barriers", sub: "Northeast Louisiana University",
    hero: IMG.touchdown, audio: "/audio/chapter-3-breaking-barriers.mp3",
    pullQuote: "You don't change minds with words. You change them with what you do.",
    paragraphs: [
      "When Joe walked onto the campus of Northeast Louisiana University, he became the first Black athlete to play football in the Gulf States Conference. Every time he stepped on that field, he carried something bigger than himself.",
      "There were people in those stands who didn't want him there. He was spat on. He was called names. Opposing players hit harder than they needed to, trying to send a message. The hostility was constant and unrelenting.",
      "Then came the game that changed everything. A 95-yard kickoff return. Joe caught that ball and ran like his life depended on it — because in a way, it did. When he crossed that end zone, something shifted in the air.",
      "The crowd — the same crowd that had been hostile — erupted. 'Go Joe Go! Go Joe Go!' In that moment, a barrier didn't just crack. It shattered. Joe went on to be ranked the 7th best college football player in America, and NLU retired his #40 jersey forever."
    ],
    images: [
      { src: IMG.touchdown, caption: "Arms raised, crowd roaring — touchdown at Louisiana Monroe." },
      { src: IMG.plaque, caption: "The Hall of Fame Plaque — first Black athlete in the Gulf States Conference." },
      { src: IMG.runTD, caption: "NLU's Joe Profit runs for a TD lead by QB Steve Mansur!" },
      { src: IMG.coachDale, caption: "Coach Dale Brown and Joe Profit at their Louisiana Sports Hall of Fame induction." },
      { src: IMG.alexandriaDaily, caption: "Alexandria Daily Town Talk: ranked 7th Best College Football Player." },
    ],
    nextChapter: "the-draft",
  },
  {
    num: "IV", slug: "the-draft", title: "The Draft", sub: "Atlanta Falcons · 1971",
    hero: IMG.thePick, audio: "/audio/chapter-4-the-draft.mp3",
    pullQuote: "You don't survive Lake Providence and quit because of a knee. I came back. Because that's what I do.",
    paragraphs: [
      "Draft day, 1971. The Atlanta Falcons selected Joe Profit with the seventh overall pick in the first round. A kid from Lake Providence — from the cotton fields, from the brogan boots — standing on that stage receiving his #23 jersey from head coach Norm Van Brocklin.",
      "But Joe wasn't going to take whatever they offered. He held out — the longest holdout in Falcons history. People called him crazy. He called it knowing his worth.",
      "On the field, he proved every cent. He led the entire NFL in rushing. Set the franchise record with 169 yards and two touchdowns in a single game against the Cincinnati Bengals. He was presented the game ball for his performance in a 44–14 demolition.",
      "Then came the ACL tear. The kind of injury that ends careers. Doctors weren't sure he'd play again. But Joe came back — because that's what men from Lake Providence do. He went on to play for the New Orleans Saints, averaging 8.5 yards per carry against the San Diego Chargers, and scored the first touchdown in the World Football League for Birmingham."
    ],
    images: [
      { src: IMG.thePick, caption: "Joe receives his #23 Jersey from head coach Norm Van Brocklin as the Falcons' #1 Draft Pick." },
      { src: IMG.falcons, caption: "Joe Profit NFL Leading Roster for the Atlanta Falcons." },
      { src: IMG.gameball, caption: "The Game Ball — 44-14 win over the Cincinnati Bengals." },
      { src: IMG.kickoff, caption: "Joe Profit returns kickoff for the Atlanta Falcons." },
      { src: IMG.cutDime, caption: "Atlanta Falcons Joe Profit — cut on a dime." },
      { src: IMG.saints, caption: "8.5 yards a carry against San Diego Chargers for the New Orleans Saints." },
      { src: IMG.daveEmanuel, caption: "Joe Profit and Dave Emanuel at Falcons Training Camp Luncheon." },
    ],
    nextChapter: "empire",
  },
  {
    num: "V", slug: "empire", title: "Empire", sub: "CII · INC. 500",
    hero: IMG.cii, audio: "/audio/chapter-5-empire.mp3",
    pullQuote: "Those soldiers hadn't heard their loved ones' voices in months. And we gave that to them. That's not just business. That's purpose.",
    paragraphs: [
      "When his playing days ended, people expected Joe to disappear. That's what happens to most athletes — the spotlight moves on. But Joe wasn't done. He was just getting started.",
      "He opened a Burger King franchise — poetic justice for a man who was once denied service at a Burger Chef because of the color of his skin. Years later, he owned the restaurant.",
      "Then he built CII — Communications International Incorporated. The company grew into one of the INC. 500 fastest growing firms in America. They designed and manufactured the Muhammad Ali Telephone — Ali himself flew to Atlanta for the launch, helping raise nearly $400,000 for families of Atlanta's missing and murdered children.",
      "The crown jewel: a $50 million contract in Kuwait — the largest government contract ever awarded to a U.S. minority-owned company. CII put communication systems in the desert during Desert Storm and launched Operation Phone Home, letting soldiers call their families for free. USA Today, the Wall Street Journal, Essence Magazine — they all came calling. Joe Profit wasn't just a former athlete. He was a force."
    ],
    images: [
      { src: IMG.cii, caption: "Operation Phone Home — CII's mobile communications center outside Kuwait City." },
      { src: IMG.ali, caption: "Muhammad Ali in Atlanta for the Ali Telephone™ launch." },
      { src: IMG.uae, caption: "Meeting with Middle East Director of Operations in the UAE." },
      { src: IMG.son, caption: "Joe and son Joe Jr. with American Best and Brightest Businessman award." },
      { src: IMG.gate, caption: "Dr. Joe Profit's Atlanta Home." },
      { src: IMG.bodyBuilder, caption: "Dr. Joseph Profit — discipline in every arena." },
    ],
    nextChapter: "power-and-purpose",
  },
  {
    num: "VI", slug: "power-and-purpose", title: "Power & Purpose", sub: "The White House · Ministry · YUP",
    hero: IMG.reagan, audio: "/audio/chapter-6-power-purpose.mp3",
    pullQuote: "They can break your body. But they can never break your spirit. That's the one thing you own outright.",
    paragraphs: [
      "Joe has sat in the Oval Office. He's shaken hands with presidents. He helped convince leaders in the Civil Rights movement to support the legislation that made the Martin Luther King Jr. Holiday a federal law. He ran for the United States Congress.",
      "He's stood alongside Muhammad Ali at press conferences with Atlanta's Mayor Maynard Jackson. He's worked with Ambassador Andrew Young, broken bread with Atlanta Falcons owner Arthur Blank, and counseled with the U.S. Surgeon General on health and wellness initiatives.",
      "In 2015, Joe was ordained to serve — becoming Reverend Joseph Profit. But his ministry had started long before that, through the Youth United for Prosperity Foundation. YUP takes young people and shows them their story matters. The Legends & Kids Young Authors Program turns students into published authors — their books available on Amazon before they finish school.",
      "Every morning, the sun rises again. That's not optimism — that's a fact. Joe's whole life has been about getting back up. From the cotton fields. From the boots. From the injury. From every door slammed in his face. Never Broken."
    ],
    images: [
      { src: IMG.reagan, caption: "President Ronald Reagan welcomes Dr. Joe Profit to the White House." },
      { src: IMG.aliPress, caption: "Press conference with Mayor Maynard Jackson, Muhammad Ali, and others." },
      { src: IMG.ambassador, caption: "Dr. Joe Profit with Ambassador Andrew Young." },
      { src: IMG.reverend, caption: "Dr. Joseph Profit, Ordained to Serve, 2015." },
      { src: IMG.yup, caption: "Legends & Kids Young Authors Program graduates at their book reveal." },
      { src: IMG.dakota, caption: "YUP 'Kid of the Year' Dakota Young." },
      { src: IMG.artBlank, caption: "With wife Wanda and Atlanta Falcons owner Arthur Blank." },
      { src: IMG.satcher, caption: "With U.S. Surgeon General Doctor David Satcher." },
      { src: IMG.signing, caption: "Signing his first book, Fields of Success." },
    ],
    nextChapter: null,
  },
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
          <span style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.muted, letterSpacing: "0.3em", textTransform: "uppercase" }}>Never Broken</span>
        </a>
        <div className="dnav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.muted, textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.3s" }}
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
          <p style={{ fontFamily: FONT.body, fontSize: "clamp(1rem, 1.6vw, 1.15rem)", color: C.mutedLight, maxWidth: 520, marginTop: 24, lineHeight: 1.7, opacity: loaded ? 0.85 : 0, transition: "opacity 1.5s ease 0.4s" }}>
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
        <span style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>{txt}{"  ◆  "}{txt}</span>
      </div>
    </div>
  );
}

// ─── STORY CHAPTERS ───
function StorySection({ onOpenChapter }) {
  const [ref, vis] = useScrollReveal(0.1);
  const chapters = CHAPTERS.map(c => ({ img: c.hero, num: c.num, title: c.title, sub: c.sub, slug: c.slug, text: c.paragraphs[0] }));
  return (
    <section id="story" style={{ padding: "clamp(60px, 10vw, 120px) 0", background: C.black }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
        <div style={{ marginBottom: 60, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Chapters</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3.2rem)", color: C.cream, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>A Life in <span style={{ fontStyle: "italic", color: C.gold }}>Six Acts</span></h2>
        </div>
        <div className="chgrid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
          {chapters.map((ch, i) => <ChapterCard key={i} ch={ch} i={i} onClick={() => onOpenChapter(ch.slug)} />)}
        </div>
      </div>
    </section>
  );
}

function ChapterCard({ ch, i, onClick }) {
  const [ref, vis] = useScrollReveal(0.15);
  const [hover, setHover] = useState(false);
  return (
    <div ref={ref} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", cursor: "pointer", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(40px)", transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 0.1}s` }}>
      <div style={{ position: "absolute", inset: 0, background: `url(${ch.img}) center/cover`, transform: hover ? "scale(1.08)" : "scale(1)", transition: "transform 0.8s cubic-bezier(0.23,1,0.32,1)", filter: "brightness(0.5) contrast(1.05)" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 30%, rgba(10,9,8,0.9) 100%)` }} />
      <div style={{ position: "absolute", top: 16, left: 16, fontFamily: FONT.display, fontSize: "0.7rem", color: C.gold, fontStyle: "italic", opacity: 0.7 }}>{ch.num}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px", transform: hover ? "translateY(0)" : "translateY(8px)", transition: "transform 0.5s ease" }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{ch.sub}</div>
        <h3 style={{ fontFamily: FONT.display, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: C.cream, fontWeight: 600, margin: "0 0 8px 0", lineHeight: 1.2 }}>{ch.title}</h3>
        <p style={{ fontFamily: FONT.body, fontSize: "0.9rem", color: C.mutedLight, lineHeight: 1.6, margin: 0, opacity: hover ? 1 : 0, maxHeight: hover ? 100 : 0, transition: "all 0.5s ease" }}>{ch.text}</p>
        <div style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8, opacity: hover ? 0.8 : 0, transition: "opacity 0.4s ease 0.1s" }}>Read Chapter →</div>
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
        <div style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.gold, letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 24 }}>— {attribution}</div>
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
          <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Archive</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.cream, fontWeight: 600, margin: "0 0 8px 0" }}>A Legacy <span style={{ fontStyle: "italic", color: C.gold }}>Reclaimed</span></h2>
          <p style={{ fontFamily: FONT.body, fontSize: "0.95rem", color: C.muted, maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
            A house fire nearly erased decades of history. This archive exists because someone refused to let that story disappear.
          </p>
        </div>
        {/* Category Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32, opacity: vis ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}>
          {GALLERY_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              style={{ fontFamily: FONT.body, fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 18px", border: `1px solid ${activeCat === cat ? C.gold : C.lineBright}`, background: activeCat === cat ? C.gold : "transparent", color: activeCat === cat ? C.black : C.muted, cursor: "pointer", transition: "all 0.3s", fontWeight: activeCat === cat ? 700 : 400 }}>
              {cat}
            </button>
          ))}
        </div>
        {/* Masonry Grid */}
        <div style={{ columns: "clamp(1, 20vw, 4)", columnCount: window.innerWidth < 600 ? 2 : window.innerWidth < 900 ? 3 : 4, columnGap: 6 }}>
          {filtered.map((item, i) => <GalleryCard key={`${activeCat}-${i}`} item={item} i={i} onClick={() => setLightbox(item)} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 32, fontFamily: FONT.body, fontSize: "0.8rem", color: C.muted, letterSpacing: "0.15em" }}>
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
            <div style={{ fontFamily: FONT.body, fontSize: "0.9rem", color: C.muted, lineHeight: 1.6 }}>{lightbox.caption}</div>
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
        <div style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>{item.cat}</div>
        <div style={{ fontFamily: FONT.display, fontSize: "0.95rem", color: C.cream, fontWeight: 600 }}>{item.title}</div>
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
    { year: "2020", title: "Never Broken", text: "The book. The story. The legacy preserved." },
  ];
  return (
    <section id="timeline" style={{ padding: "clamp(60px, 10vw, 120px) 0", background: C.black }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
        <div style={{ textAlign: "center", marginBottom: 60, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Journey</div>
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
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.gold, fontStyle: "italic", marginBottom: 4 }}>{ev.year}</div>
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.cream, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
        <div style={{ fontFamily: FONT.body, fontSize: "0.9rem", color: C.muted, lineHeight: 1.6 }}>{ev.text}</div>
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
            <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>Giving Back</div>
            <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: C.cream, fontWeight: 600, margin: "0 0 20px 0", lineHeight: 1.15 }}>Youth United for <span style={{ fontStyle: "italic", color: C.gold }}>Prosperity</span></h2>
            <p style={{ fontFamily: FONT.body, fontSize: "1.05rem", color: C.mutedLight, lineHeight: 1.8, marginBottom: 16 }}>
              The YUP Foundation empowers the next generation through literacy, entrepreneurship, and mentorship. From the Legends & Kids Young Authors Program — where students become published authors — to community service initiatives across Atlanta, Joe's mission is clear: lift as you climb.
            </p>
            <p style={{ fontFamily: FONT.body, fontSize: "1.05rem", color: C.mutedLight, lineHeight: 1.8, marginBottom: 28 }}>
              Every dollar donated goes directly to programming that puts books in hands, confidence in hearts, and futures within reach.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contact" style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.black, background: C.gold, padding: "12px 28px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
                onMouseEnter={e => e.target.style.background = C.goldLight}
                onMouseLeave={e => e.target.style.background = C.gold}>
                Donate Now
              </a>
              <a href="https://youthunitedpro.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.gold, border: `1px solid ${C.gold}`, padding: "12px 28px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", transition: "all 0.3s" }}
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
                <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.15em" }}>YUP "Kid of the Year" Dakota Young</div>
              </div>
            </div>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img src={IMG.nextGenAuthors} alt="Next Gen Authors" style={{ width: "100%", display: "block", filter: "brightness(0.85) contrast(1.05)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 14px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.15em" }}>Words That Change Worlds</div>
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
        <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>Coming Soon</div>
        <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: C.cream, fontWeight: 600, margin: "0 0 16px 0" }}>The Book <span style={{ fontStyle: "italic", color: C.gold }}>Trailer</span></h2>
        <p style={{ fontFamily: FONT.body, fontSize: "0.95rem", color: C.muted, lineHeight: 1.7, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
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
            <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 16 }}>Watch Trailer</div>
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
            <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Book</div>
            <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.cream, fontWeight: 600, margin: "0 0 20px 0", lineHeight: 1.1 }}>Never <span style={{ fontStyle: "italic", color: C.gold }}>Broken</span></h2>
            <p style={{ fontFamily: FONT.body, fontSize: "1.05rem", color: C.mutedLight, lineHeight: 1.8, marginBottom: 12 }}>
              From the cotton fields of Louisiana to the NFL draft stage. From the Oval Office to the battlefields of Kuwait. This is the story of a man who was told no a thousand times and answered yes every single time.
            </p>
            <p style={{ fontFamily: FONT.body, fontSize: "1.05rem", color: C.mutedLight, lineHeight: 1.8, marginBottom: 28 }}>
              "Never Broken" is more than a memoir — it's a blueprint for resilience, written by a man who lived every word.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contact" style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.black, background: C.gold, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
                onMouseEnter={e => e.target.style.background = C.goldLight}
                onMouseLeave={e => e.target.style.background = C.gold}>
                Order Now
              </a>
              <a href="#contact" style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.gold, border: `1px solid ${C.gold}`, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", transition: "all 0.3s" }}
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
        <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>Get in Touch</div>
        <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: C.cream, fontWeight: 600, margin: "0 0 16px 0" }}>Continue the <span style={{ fontStyle: "italic", color: C.gold }}>Conversation</span></h2>
        <p style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>
          For book orders, speaking engagements, charitable donations, or media inquiries.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="mailto:contact@joeprofit.com" style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.black, background: C.gold, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
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
              <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.muted }}>{item.desc}</div>
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
      <div style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.muted, letterSpacing: "0.15em" }}>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>
      <div style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: "rgba(154,142,127,0.3)", letterSpacing: "0.3em", textTransform: "uppercase" }}>A Legends Series Production</div>
    </footer>
  );
}

// ─── AUDIO WAVEFORM PLAYER ───
function AudioPlayer({ src, title }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurTime] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => {}); }
    setPlaying(!playing);
  };

  const fmt = (s) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? "0" : ""}${sec}`; };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => { setCurTime(a.currentTime); setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0); };
    const onMeta = () => setDuration(a.duration);
    const onEnd = () => { setPlaying(false); setProgress(0); setCurTime(0); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("loadedmetadata", onMeta); a.removeEventListener("ended", onEnd); };
  }, []);

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) { audioRef.current.currentTime = pct * audioRef.current.duration; }
  };

  // Generate fake waveform bars
  const bars = useMemo(() => Array.from({ length: 60 }, () => 0.15 + Math.random() * 0.85), []);

  return (
    <div style={{ background: "rgba(212,162,78,0.06)", border: `1px solid ${C.lineBright}`, padding: "20px 24px", marginBottom: 32 }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${C.gold}`, background: playing ? C.goldDim : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", flexShrink: 0 }}>
          {playing ? (
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 3, height: 14, background: C.gold }} />
              <div style={{ width: 3, height: 14, background: C.gold }} />
            </div>
          ) : (
            <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: `14px solid ${C.gold}`, marginLeft: 3 }} />
          )}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Listen to Joe Tell This Story</div>
          <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.cream, fontStyle: "italic" }}>{title}</div>
        </div>
        <div style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.muted, fontVariantNumeric: "tabular-nums" }}>
          {fmt(currentTime)} / {fmt(duration || 0)}
        </div>
      </div>
      {/* Waveform */}
      <div onClick={seek} style={{ display: "flex", alignItems: "center", gap: 1.5, height: 40, cursor: "pointer", padding: "4px 0" }}>
        {bars.map((h, i) => {
          const pct = (i / bars.length) * 100;
          const isPlayed = pct <= progress;
          return (
            <div key={i} style={{ flex: 1, height: `${h * 100}%`, background: isPlayed ? C.gold : "rgba(154,142,127,0.25)", borderRadius: 1, transition: "background 0.1s", minWidth: 2 }} />
          );
        })}
      </div>
    </div>
  );
}

// ─── CHAPTER PAGE ───
function ChapterPage({ chapter, onBack, onNavigate }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); setTimeout(() => setLoaded(true), 100); }, [chapter.slug]);

  const nextCh = chapter.nextChapter ? CHAPTERS.find(c => c.slug === chapter.nextChapter) : null;
  const prevIdx = CHAPTERS.findIndex(c => c.slug === chapter.slug) - 1;
  const prevCh = prevIdx >= 0 ? CHAPTERS[prevIdx] : null;

  return (
    <div style={{ minHeight: "100vh", background: C.black }}>
      {/* Back button */}
      <div style={{ position: "fixed", top: 16, left: 20, zIndex: 150 }}>
        <button onClick={onBack} style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.gold, background: "rgba(10,9,8,0.8)", border: `1px solid ${C.lineBright}`, padding: "10px 20px", cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase", backdropFilter: "blur(10px)", transition: "all 0.3s" }}
          onMouseEnter={e => e.target.style.background = C.goldDim}
          onMouseLeave={e => e.target.style.background = "rgba(10,9,8,0.8)"}>
          ← Back to Story
        </button>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", height: "70vh", minHeight: 400, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `url(${chapter.hero}) center/cover`, filter: "brightness(0.3) contrast(1.1) saturate(0.7)", transform: loaded ? "scale(1)" : "scale(1.1)", transition: "transform 1.5s ease" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(10,9,8,0.4) 0%, rgba(10,9,8,0.2) 40%, ${C.black} 100%)` }} />
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(24px, 8vw, 120px)", paddingBottom: "clamp(40px, 8vh, 80px)", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)", transition: "all 1s ease 0.3s" }}>
          <div style={{ fontFamily: FONT.display, fontSize: "clamp(3rem, 8vw, 6rem)", color: "rgba(212,162,78,0.08)", fontWeight: 700, position: "absolute", top: "20%", right: "5%", lineHeight: 0.8 }}>{chapter.num}</div>
          <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>Chapter {chapter.num} · {chapter.sub}</div>
          <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: C.cream, fontWeight: 700, margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>{chapter.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px)" }}>
        {/* Audio Player */}
        <AudioPlayer src={chapter.audio} title={`Chapter ${chapter.num}: ${chapter.title}`} />

        {/* Pull Quote */}
        <blockquote style={{ fontFamily: FONT.display, fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)", color: C.gold, fontStyle: "italic", lineHeight: 1.5, margin: "0 0 40px 0", padding: "24px 0 24px 24px", borderLeft: `2px solid ${C.gold}`, opacity: 0.9 }}>
          "{chapter.pullQuote}"
        </blockquote>

        {/* Story Text */}
        {chapter.paragraphs.map((p, i) => (
          <ChapterParagraph key={i} text={p} delay={i * 0.1} />
        ))}

        {/* Chapter Images */}
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 24 }}>
          {chapter.images.map((img, i) => (
            <ChapterImage key={i} img={img} i={i} />
          ))}
        </div>

        {/* Chapter Navigation */}
        <div style={{ marginTop: 60, paddingTop: 40, borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          {prevCh ? (
            <button onClick={() => onNavigate(prevCh.slug)} style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.muted, background: "none", border: `1px solid ${C.line}`, padding: "12px 24px", cursor: "pointer", letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.3s" }}
              onMouseEnter={e => { e.target.style.color = C.gold; e.target.style.borderColor = C.gold; }}
              onMouseLeave={e => { e.target.style.color = C.muted; e.target.style.borderColor = C.line; }}>
              ← {prevCh.title}
            </button>
          ) : <div />}
          {nextCh ? (
            <button onClick={() => onNavigate(nextCh.slug)} style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.black, background: C.gold, border: "none", padding: "12px 24px", cursor: "pointer", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
              onMouseEnter={e => e.target.style.background = C.goldLight}
              onMouseLeave={e => e.target.style.background = C.gold}>
              {nextCh.title} →
            </button>
          ) : (
            <button onClick={onBack} style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.black, background: C.gold, border: "none", padding: "12px 24px", cursor: "pointer", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
              onMouseEnter={e => e.target.style.background = C.goldLight}
              onMouseLeave={e => e.target.style.background = C.gold}>
              Return Home →
            </button>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function ChapterParagraph({ text, delay }) {
  const [ref, vis] = useScrollReveal(0.2);
  return (
    <p ref={ref} style={{ fontFamily: FONT.body, fontSize: "clamp(1.05rem, 1.5vw, 1.2rem)", color: C.creamSoft, lineHeight: 1.9, margin: "0 0 24px 0", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(15px)", transition: `all 0.7s ease ${delay}s` }}>
      {text}
    </p>
  );
}

function ChapterImage({ img, i }) {
  const [ref, vis] = useScrollReveal(0.15);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(25px)", transition: `all 0.8s ease ${i * 0.1}s` }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={img.src} alt={img.caption} style={{ width: "100%", display: "block", filter: "brightness(0.9) contrast(1.05)" }} />
      </div>
      <div style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.muted, marginTop: 8, lineHeight: 1.5, fontStyle: "italic" }}>{img.caption}</div>
    </div>
  );
}

// ─── APP ───
export default function App() {
  const [activeChapter, setActiveChapter] = useState(null);

  const openChapter = (slug) => {
    const ch = CHAPTERS.find(c => c.slug === slug);
    if (ch) setActiveChapter(ch);
  };

  const closeChapter = () => {
    setActiveChapter(null);
    setTimeout(() => {
      const el = document.getElementById("story");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  if (activeChapter) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
          *{margin:0;padding:0;box-sizing:border-box}
          html{scroll-behavior:smooth}
          body{background:${C.black};overflow-x:hidden}
          @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          ::selection{background:${C.gold};color:${C.black}}
          img{-webkit-user-drag:none}
        `}</style>
        <Grain />
        <ChapterPage chapter={activeChapter} onBack={closeChapter} onNavigate={openChapter} />
      </>
    );
  }

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
      <StorySection onOpenChapter={openChapter} />
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
