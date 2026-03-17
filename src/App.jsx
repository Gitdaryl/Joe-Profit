import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  joeJoe: "/images/Joe_Joe.png",
  portrait40: "/images/joe_portrait.png",
  // Book preview pages
  preview: [
    "/images/preview_01.png",
    "/images/preview_02.png",
    "/images/preview_03.png",
    "/images/preview_04.png",
    "/images/preview_05.png",
    "/images/preview_06.png",
  ],
  // Press logos
  logoWSJ: "/images/wsj_logo.png",
  logoUSAToday: "/images/usa_today_logo.png",
  logoEssence: "/images/essence_logo.png",
  logoINC500: "/images/inc500_logo.png",
};

// ─── GALLERY DATA (all 61+ images organized by category) ───
const GALLERY_CATEGORIES = ["All", "Athletics", "Business", "Leadership", "Service", "Family", "Press", "Legacy"];

const GALLERY_ITEMS = [
  // ATHLETICS
  { src: IMG.thePick, cat: "Athletics", title: "The #1 Draft Pick", caption: "Joe Profit receives his No. 23 Jersey, presented by head coach Norm Van Brocklin of the Atlanta Falcons." },
  { src: IMG.falcons, cat: "Athletics", title: "NFL Leading Rusher", caption: "Joe Profit NFL Leading Rusher for the Atlanta Falcons." },
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
  { src: IMG.bodyBuilder, cat: "Business", title: "The Body Builder", caption: "Joe Profit, Finalist International Bodybuilding Competition Masters Division." },
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
  { src: IMG.galeSayers, cat: "Service", title: "Gale Sayers & Joe Profit - Fighting Sickle Cell", caption: "Gale Sayers and Joe Profit join in the fight against Sickle Cell Anemia." },
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
    { label: "Story", href: "/#story" }, { label: "Archive", href: "/#archive" },
    { label: "Timeline", href: "/#timeline" }, { label: "Youth United for Prosperity", href: "/#charity" },
    { label: "Shop", href: "/shop" }, { label: "Speaking", href: "/speaking" }, { label: "Contact", href: "/#contact" },
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
            <a key={l.label} href={l.href} style={{ fontFamily: FONT.body, fontSize: "0.9rem", color: C.muted, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.3s" }}
              onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.muted}>{l.label}
            </a>
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
    <section ref={pRef} style={{ position: "relative", height: "88vh", minHeight: 560, overflow: "hidden" }}>
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
          <div className="hero-book-row" style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
            <img src={IMG.book} alt="Never Broken — the book" style={{ width: 120, height: "auto", flexShrink: 0, boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(212,162,78,0.15)", borderRadius: 2, opacity: loaded ? 0.95 : 0, transition: "opacity 1.5s ease 0.4s" }} />
            <p style={{ fontFamily: FONT.body, fontSize: "clamp(1rem, 1.6vw, 1.15rem)", color: C.mutedLight, maxWidth: 440, margin: 0, lineHeight: 1.7, opacity: loaded ? 0.85 : 0, transition: "opacity 1.5s ease 0.4s" }}>
              From cotton fields to the NFL football field. From the boardroom to the White House. The story of Dr. Joe Profit — a man who refused to break under pressure.
            </p>
          </div>
        </div>
        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 2s ease 1s", marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href="#story" style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.black, background: C.gold, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s", borderRadius: 0 }}
            onMouseEnter={e => { e.target.style.background = C.goldLight; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = C.gold; e.target.style.transform = "translateY(0)"; }}>
            Enter the Story
          </a>
          <a href="/shop" style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.gold, border: `1px solid ${C.gold}`, padding: "14px 32px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.background = C.goldDim; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; }}>
            Get the Book
          </a>
        </div>
      </div>
      {/* Joe portrait — right side */}
      <div className="hero-portrait" style={{ position: "absolute", bottom: 0, right: 0, width: "clamp(260px, 38vw, 560px)", height: "92%", zIndex: 1, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", opacity: loaded ? 1 : 0, transition: "opacity 1.8s ease 0.6s" }}>
        <img src={IMG.joeJoe} alt="Dr. Joe Profit" style={{ height: "100%", width: "auto", objectFit: "contain", objectPosition: "bottom center", maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 18%, black 38%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 18%, black 38%)", filter: "drop-shadow(-24px 0 48px rgba(212,162,78,0.12))" }} />
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

// ─── PRESS LOGO WALL ───
function PressLogoWall() {
  const [ref, vis] = useScrollReveal(0.2);
  const logos = [
    { src: IMG.logoWSJ,     alt: "The Wall Street Journal" },
    { src: IMG.logoUSAToday, alt: "USA Today" },
    { src: IMG.logoEssence,  alt: "Essence Magazine" },
    { src: IMG.logoINC500,   alt: "INC. 500" },
  ];
  return (
    <section style={{ background: C.dark3, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: "clamp(28px, 4vw, 44px) 0" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)", transition: "all 0.8s ease" }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.muted, letterSpacing: "0.4em", textTransform: "uppercase", textAlign: "center", marginBottom: 28, opacity: 0.5 }}>
          As Featured In
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(28px, 6vw, 72px)", flexWrap: "wrap" }}>
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: "clamp(22px, 3vw, 34px)",
                width: "auto",
                display: "block",
                filter: "brightness(0) invert(1)",
                opacity: 1,
                transition: "filter 0.4s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(0) invert(1) brightness(1.4)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(0) invert(1)"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HERO AUDIO HOOK ───
function HeroAudioHook() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ref, vis] = useScrollReveal(0.2);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => {}); }
    setPlaying(!playing);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => setPlaying(false);
    a.addEventListener("ended", onEnd);
    return () => a.removeEventListener("ended", onEnd);
  }, []);

  return (
    <section style={{ background: C.dark3, borderBottom: `1px solid ${C.line}`, padding: "clamp(36px, 5vw, 56px) 0" }}>
      <audio ref={audioRef} src="/audio/joe-intro.mp3" preload="metadata" />
      <div ref={ref} style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)", display: "flex", alignItems: "center", gap: "clamp(20px, 4vw, 40px)", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "all 0.9s ease" }}>
        {/* Play button */}
        <button onClick={toggle} style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", border: `1.5px solid ${C.gold}`, background: playing ? C.goldDim : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", position: "relative" }}
          onMouseEnter={e => e.currentTarget.style.background = C.goldDim}
          onMouseLeave={e => { if (!playing) e.currentTarget.style.background = "transparent"; }}>
          {playing ? (
            <>
              <div style={{ display: "flex", gap: 5 }}>
                <div style={{ width: 3, height: 18, background: C.gold, borderRadius: 2, animation: "pulse 0.8s ease infinite" }} />
                <div style={{ width: 3, height: 18, background: C.gold, borderRadius: 2, animation: "pulse 0.8s ease infinite 0.15s" }} />
                <div style={{ width: 3, height: 18, background: C.gold, borderRadius: 2, animation: "pulse 0.8s ease infinite 0.3s" }} />
              </div>
              {/* Pulsing ring */}
              <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `1px solid ${C.gold}`, opacity: 0.3, animation: "pulse 1.5s ease infinite" }} />
            </>
          ) : (
            <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: `18px solid ${C.gold}`, marginLeft: 4 }} />
          )}
        </button>
        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.gold, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 6 }}>
            {playing ? "Now Playing" : "Hear Joe's Story"}
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: C.cream, fontStyle: "italic", lineHeight: 1.3 }}>
            In His Own Words
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.muted, marginTop: 4, lineHeight: 1.5 }}>
            {playing ? "Dr. Joe Profit — Never Broken" : "A 30-second declaration from Dr. Joe Profit himself."}
          </div>
        </div>
        {/* Decorative divider */}
        <div style={{ flexShrink: 0, width: 1, height: 52, background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`, opacity: 0.2 }} />
      </div>
    </section>
  );
}

// ─── STORY CHAPTERS ───
function StorySection({ onOpenChapter }) {
  const [ref, vis] = useScrollReveal(0.1);
  const chapters = CHAPTERS.map(c => ({ img: c.hero, num: c.num, title: c.title, sub: c.sub, slug: c.slug, text: c.paragraphs[0] }));
  return (
    <section id="story" style={{ padding: "clamp(40px, 6vw, 80px) 0", background: C.black }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
        <div style={{ marginBottom: 60, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ fontFamily: FONT.body, fontSize: "1rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Book Snippets</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)", color: C.cream, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>A Life of <span style={{ fontStyle: "italic", color: C.gold }}>Challenges. And Successes</span></h2>
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
    <section ref={pRef} style={{ position: "relative", padding: "clamp(40px, 6vw, 80px) 0", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: C.dark3 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, ${-50 + pOffset * 0.5}%) scale(${1 + Math.abs(pOffset) * 0.001})`, fontFamily: FONT.display, fontSize: "clamp(12rem, 30vw, 28rem)", color: "rgba(212,162,78,0.03)", fontWeight: 700, lineHeight: 0.8, whiteSpace: "nowrap", pointerEvents: "none" }}>40</div>
      <div ref={ref} style={{ position: "relative", zIndex: 2, maxWidth: 800, margin: "0 auto", padding: "0 clamp(24px, 6vw, 60px)", textAlign: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 1s ease" }}>
        <div style={{ width: 40, height: 1, background: C.gold, margin: "0 auto 30px", opacity: 0.5 }} />
        <blockquote style={{ fontFamily: FONT.display, fontSize: "clamp(1.1rem, 2.5vw, 1.9rem)", color: C.cream, fontStyle: "italic", lineHeight: 1.6, margin: 0, fontWeight: 400 }}>"{quote}"</blockquote>
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
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.cream, fontWeight: 600, margin: "0 0 8px 0" }}>An <span style={{ fontStyle: "italic", color: C.gold }}>Ongoing Legacy</span></h2>
          <p style={{ fontFamily: FONT.body, fontSize: "0.95rem", color: C.muted, maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
            The archive highlights key moments from Joe's journey and his successes along the way.
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
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ breakInside: "avoid", marginBottom: 6, position: "relative", overflow: "hidden", cursor: "pointer" }}>
      <img src={item.src} alt={item.title} style={{ width: "100%", display: "block", transform: hover ? "scale(1.04)" : "scale(1)", transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)", filter: hover ? "brightness(0.7)" : "brightness(0.85)" }} />
      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 3, fontFamily: FONT.body, fontSize: "1rem", color: C.gold, opacity: hover ? 0.9 : 0.35, transition: "opacity 0.4s ease", lineHeight: 1, userSelect: "none" }}>⊕</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "30px 12px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)", opacity: hover ? 1 : 0, transform: hover ? "translateY(0)" : "translateY(8px)", transition: "all 0.4s ease" }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>{item.cat}</div>
        <div style={{ fontFamily: FONT.display, fontSize: "0.95rem", color: C.cream, fontWeight: 600 }}>{item.title}</div>
        <div style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.goldDim, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6 }}>View ↗</div>
      </div>
    </div>
  );
}

// ─── TIMELINE ───
function TimelineSection() {
  const [ref, vis] = useScrollReveal(0.1);
  const events = [
    { year: "1949", title: "Born in Louisiana", text: "Lake Providence — one of the poorest towns in America." },
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
    <section id="timeline" style={{ padding: "clamp(40px, 6vw, 80px) 0", background: C.black }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
        <div style={{ textAlign: "center", marginBottom: 60, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>The Journey</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.cream, fontWeight: 600, margin: 0 }}>Seven <span style={{ fontStyle: "italic", color: C.gold }}>Decades</span></h2>
        </div>
        <div style={{ position: "relative" }}>
          <div className="tl-center-line" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${C.gold}, ${C.gold}, transparent)`, opacity: 0.2 }} />
          {events.map((ev, i) => <TimelineItem key={i} ev={ev} i={i} isLeft={i % 2 === 0} />)}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ ev, i, isLeft }) {
  const [ref, vis] = useScrollReveal(0.2);
  return (
    <div className="tl-item" ref={ref} style={{ display: "flex", justifyContent: isLeft ? "flex-end" : "flex-start", paddingLeft: isLeft ? 0 : "52%", paddingRight: isLeft ? "52%" : 0, marginBottom: 40, position: "relative", opacity: vis ? 1 : 0, transform: vis ? "none" : `translateX(${isLeft ? -30 : 30}px)`, transition: `all 0.7s ease ${i * 0.05}s` }}>
      <div className="tl-dot" style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", width: 10, height: 10, borderRadius: "50%", background: vis ? C.gold : C.dark, border: `2px solid ${C.gold}`, transition: "background 0.5s ease", zIndex: 2 }} />
      <div className="tl-item-text" style={{ textAlign: isLeft ? "right" : "left" }}>
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
    <section id="charity" ref={pRef} style={{ position: "relative", padding: "clamp(40px, 6vw, 80px) 0", overflow: "hidden" }}>
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
              <a href="https://youthunitedpro.com/donate.php" target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.black, background: C.gold, padding: "12px 28px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
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
const MOSAIC = [
  { src: IMG.reagan,             alt: "Joe Profit with President Reagan" },
  { src: IMG.ali,                alt: "Joe Profit with Muhammad Ali" },
  { src: IMG.runTD,              alt: "Joe Profit scoring in the NFL" },
  { src: IMG.multiMillionContract, alt: "Multimillion dollar Kuwait contract" },
  { src: IMG.yup,                alt: "YUP Foundation — Youth United for Prosperity" },
  { src: IMG.signing,            alt: "Dr. Joe Profit signing Never Broken" },
];

// ─── BOOK PREVIEW MODAL ───
function BookPreviewModal({ onClose }) {
  const [page, setPage] = useState(0);
  const pages = IMG.preview;
  const isFirst = page === 0;
  const isLast = page === pages.length - 1;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && !isLast) setPage(p => p + 1);
      if (e.key === "ArrowLeft" && !isFirst) setPage(p => p - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, isFirst, isLast]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.96)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.3s ease", padding: "clamp(16px, 3vw, 40px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.7 }}>A Glimpse Inside</div>
            <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.cream, fontStyle: "italic" }}>Never Broken</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.muted, letterSpacing: "0.1em" }}>
              {page + 1} <span style={{ opacity: 0.4 }}>of</span> {pages.length}
            </div>
            <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.lineBright}`, color: C.muted, width: 32, height: 32, cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.lineBright; e.currentTarget.style.color = C.muted; }}>✕</button>
          </div>
        </div>

        {/* Page image */}
        <div style={{ border: `1px solid ${C.lineBright}`, background: C.dark, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}>
          <img src={pages[page]} alt={`Page ${page + 1}`} style={{ width: "100%", display: "block", maxHeight: "70vh", objectFit: "contain" }} />
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
          <button onClick={() => setPage(p => p - 1)} disabled={isFirst}
            style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: isFirst ? "rgba(154,142,127,0.3)" : C.muted, background: "none", border: `1px solid ${isFirst ? "rgba(212,162,78,0.06)" : C.lineBright}`, padding: "10px 20px", cursor: isFirst ? "default" : "pointer", letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.3s" }}
            onMouseEnter={e => { if (!isFirst) { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.gold; }}}
            onMouseLeave={e => { if (!isFirst) { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.lineBright; }}}>
            ← Prev
          </button>

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: 6 }}>
            {pages.map((_, i) => (
              <button key={i} onClick={() => setPage(i)} style={{ width: i === page ? 20 : 6, height: 6, borderRadius: 3, background: i === page ? C.gold : "rgba(212,162,78,0.25)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>

          {isLast ? (
            <a href="/shop" style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.black, background: C.gold, padding: "10px 24px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "background 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.goldLight}
              onMouseLeave={e => e.currentTarget.style.background = C.gold}>
              Order the Book →
            </a>
          ) : (
            <button onClick={() => setPage(p => p + 1)}
              style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.black, background: C.gold, border: "none", padding: "10px 24px", cursor: "pointer", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "background 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.goldLight}
              onMouseLeave={e => e.currentTarget.style.background = C.gold}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BookSection({ onOpenPreview }) {
  const [ref, vis] = useScrollReveal(0.1);
  return (
    <section id="book" style={{ background: C.dark, padding: "clamp(60px, 8vw, 100px) 0", borderTop: `1px solid ${C.line}` }}>
      <div ref={ref} style={{
        maxWidth: 860, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 40px)",
        display: "grid", gridTemplateColumns: "auto 1fr",
        gap: "clamp(36px, 6vw, 64px)", alignItems: "center",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
        transition: "all 0.9s cubic-bezier(0.23,1,0.32,1)",
      }} className="bkgrid">

        {/* Book cover — large */}
        <div style={{ width: "clamp(180px, 24vw, 280px)", flexShrink: 0 }}>
          <div style={{ position: "relative", boxShadow: "20px 20px 56px rgba(0,0,0,0.7), -2px -2px 14px rgba(212,162,78,0.08)", transform: "rotate(-1.5deg)" }}>
            <img src={IMG.book} alt="Never Broken by Dr. Joe Profit" style={{ width: "100%", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, boxShadow: "inset 4px 0 14px rgba(0,0,0,0.45)" }} />
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={{ fontFamily: FONT.body, fontSize: "0.72rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 14 }}>The Book</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", color: C.cream, fontWeight: 400, margin: "0 0 16px", lineHeight: 1.1 }}>
            Never <em style={{ color: C.gold }}>Broken</em>
          </h2>
          <p style={{ fontFamily: FONT.body, fontSize: "clamp(1rem, 1.6vw, 1.1rem)", color: C.muted, lineHeight: 1.8, marginBottom: 10, fontWeight: 300 }}>
            The complete story of Dr. Joe Profit — from cotton fields to the NFL, from the Oval Office to Kuwait.
          </p>
          <p style={{ fontFamily: FONT.body, fontSize: "0.88rem", color: C.gold, marginBottom: 28, opacity: 0.85 }}>
            Available in hardcover, paperback, Kindle &amp; audiobook
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "10px 16px", border: `1px solid ${C.goldDim}`, background: "rgba(212,162,78,0.04)" }}>
            <span style={{ fontFamily: FONT.body, fontSize: "0.8rem", color: C.gold, lineHeight: 1.5 }}>
              🎓 <strong>100% of proceeds</strong> support the YUP Foundation
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a href="/shop" style={{ display: "inline-block", fontFamily: FONT.body, fontSize: "0.78rem", color: C.black, background: C.gold, padding: "14px 36px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.goldLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = "none"; }}>
              Visit the Shop →
            </a>
            <button onClick={onOpenPreview} style={{ fontFamily: FONT.body, fontSize: "0.78rem", color: C.gold, background: "transparent", border: `1px solid ${C.gold}`, padding: "14px 28px", cursor: "pointer", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, transition: "all 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.goldDim}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Read a Few Pages
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ───
const TESTIMONIALS = [
  {
    quote: "Joe Profit's life is proof that with determination, humility, and vision, even the greatest challenges can become the foundation for extraordinary achievement.",
    name: "Dave Emanuel",
    title: "",
  },
  {
    quote: "Joe Profit's story is one of grit, grace, and triumph. His perseverance—through challenges both seen and unseen—reveals a strength of character few ever develop.",
    name: "Joe R. Reeder",
    title: "Managing Shareholder, Greenberg Traurig LLP · Former Under Secretary of the U.S. Army",
  },
  {
    quote: "Even as a young boy, Joe had the mind of an entrepreneur and the heart of a champion. His story is long overdue—and deeply inspiring.",
    name: "Don Zimmerman",
    title: "Former NFL Wide Receiver, Philadelphia Eagles · Childhood Friend",
  },
  {
    quote: "Joe could not be outrun, outworked by anybody on the team. His emotional and spiritual strength continues to inspire generations through his Youth United for Prosperity Foundation.",
    name: "Van Lambert",
    title: "NLU/ULM College Teammate",
  },
  {
    quote: "Joe Profit has one of the most insightful business minds I've ever advised. This book will reignite your belief in what is possible.",
    name: "James Blackwell",
    title: "Financial Advisor, Merrill Lynch & UBS",
  },
  {
    quote: "Dr. Joe Profit had an extraordinary ability to unite our staff into one focused, high-performing team. His leadership and no-quit attitude positioned us to compete for and win major multimedia contracts around the world.",
    name: "Abbas Jezghani",
    title: "Chief Engineer, Communications International, Inc.",
  },
];

function TestimonialsSection() {
  const [ref, vis] = useScrollReveal(0.1);
  return (
    <section style={{ background: C.dark3, padding: "clamp(60px, 8vw, 100px) 0", borderTop: `1px solid ${C.line}` }}>
      <div ref={ref} style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.9s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12, opacity: 0.8 }}>Those Who Know</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: C.cream, fontWeight: 600, margin: 0 }}>
            What They <span style={{ fontStyle: "italic", color: C.gold }}>Say</span>
          </h2>
        </div>
        <div className="testimgrid" style={{ display: "grid", gridTemplateColumns: `repeat(${TESTIMONIALS.length === 1 ? 1 : TESTIMONIALS.length === 2 ? 2 : 3}, 1fr)`, gap: 24, maxWidth: TESTIMONIALS.length === 1 ? 680 : "100%", margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, i }) {
  const [ref, vis] = useScrollReveal(0.15);
  return (
    <div ref={ref} style={{ padding: "clamp(28px, 4vw, 40px)", border: `1px solid ${C.lineBright}`, background: "rgba(212,162,78,0.02)", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: `all 0.8s ease ${i * 0.15}s`, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Opening mark */}
      <div style={{ fontFamily: FONT.display, fontSize: "3.5rem", color: C.gold, lineHeight: 0.7, opacity: 0.35, userSelect: "none" }}>"</div>
      <blockquote style={{ fontFamily: FONT.display, fontSize: "clamp(1rem, 1.6vw, 1.15rem)", color: C.creamSoft, fontStyle: "italic", lineHeight: 1.75, margin: 0, flex: 1 }}>
        {t.quote}
      </blockquote>
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 20 }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.cream, fontWeight: 600, letterSpacing: "0.04em" }}>{t.name}</div>
        {t.title && <div style={{ fontFamily: FONT.body, fontSize: "0.78rem", color: C.gold, marginTop: 4, opacity: 0.8 }}>{t.title}</div>}
      </div>
    </div>
  );
}

// ─── PORTRAIT ───
function PortraitSection() {
  const [ref, vis] = useScrollReveal(0.08);
  return (
    <section style={{ padding: "clamp(60px,8vw,100px) 0", background: C.dark3, borderTop: `1px solid ${C.line}` }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.9s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: FONT.body, fontSize: "0.72rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>A Commissioned Work</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: C.cream, fontWeight: 600, margin: 0 }}>
            The Man at <span style={{ fontStyle: "italic", color: C.gold }}>Forty</span>
          </h2>
        </div>
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <img src={IMG.portrait40} alt="Oil portrait of Dr. Joe Profit at 40" style={{ width: "100%", display: "block", border: `1px solid ${C.lineBright}`, boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }} />
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p style={{ fontFamily: FONT.display, fontSize: "clamp(0.9rem,1.3vw,1.05rem)", color: C.muted, fontStyle: "italic", lineHeight: 1.7 }}>
              An oil painting commissioned by Joe's staff to mark his 40th year — a milestone portrait of a man who had already lived several lifetimes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── LEGENDS COMMISSION ───
// ─── CONTACT ───
function ContactSection() {
  const [ref, vis] = useScrollReveal(0.15);
  return (
    <section id="contact" style={{ padding: "clamp(60px, 10vw, 100px) 0", background: C.dark, borderTop: `1px solid ${C.line}` }}>
      <div ref={ref} style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)", textAlign: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
        <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>Reach Out</div>
        <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: C.cream, fontWeight: 600, margin: "0 0 16px 0" }}>Every Great Story Begins<br /><span style={{ fontStyle: "italic", color: C.gold }}>With a Conversation</span></h2>
        <p style={{ fontFamily: FONT.body, fontSize: "0.88rem", color: C.muted, lineHeight: 1.75, marginBottom: 32 }}>
          For the book, speaking engagements, the YUP Foundation, or media inquiries — we're here.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="mailto:info@joeprofitneverbroken.com" style={{ fontFamily: FONT.body, fontSize: "0.78rem", color: C.black, background: C.gold, padding: "14px 36px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.background = C.goldLight; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.background = C.gold; e.target.style.transform = "none"; }}>
            Get in Touch
          </a>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Order the Book", desc: "Hardcover, softcover & digital", href: "/shop" },
            { label: "Support the Foundation", desc: "Youth literacy & mentorship", href: "https://youthunitedpro.com/donate.php" },
            { label: "Book Joe to Speak", desc: "Keynotes & live events", href: "/speaking" },
          ].map(item => {
            const Tag = item.href ? "a" : "div";
            return (
              <Tag key={item.label} href={item.href || undefined} target={item.href && item.href.startsWith('http') ? "_blank" : undefined} rel={item.href && item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                style={{ textAlign: "center", padding: 20, border: `1px solid ${C.line}`, flex: "1 1 160px", maxWidth: 200, transition: "all 0.3s", cursor: "pointer", textDecoration: "none", display: "block" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.line}>
                <div style={{ width: 24, height: 1, background: C.gold, opacity: 0.4, margin: "0 auto 16px" }} />
                <div style={{ fontFamily: FONT.display, fontSize: "0.95rem", color: C.cream, fontWeight: 600, marginBottom: 6, fontStyle: "italic" }}>{item.label}</div>
                <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.muted, letterSpacing: "0.04em" }}>{item.desc}</div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── BACK TO TOP ───
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 999,
        background: "rgba(10,9,8,0.85)", border: `1px solid ${C.goldDim}`,
        color: C.gold, fontFamily: FONT.body, fontSize: "0.65rem",
        letterSpacing: "0.18em", textTransform: "uppercase",
        padding: "10px 14px", cursor: "pointer",
        opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.4s ease", backdropFilter: "blur(6px)",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = "rgba(212,162,78,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.goldDim; e.currentTarget.style.background = "rgba(10,9,8,0.85)"; }}
    >
      ↑ Top
    </button>
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
      <a href="https://yeti-signature-films.vercel.app" target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT.body, fontSize: "0.72rem", color: C.gold, letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", opacity: 0.65, transition: "opacity 0.3s" }}
        onMouseEnter={e => e.currentTarget.style.opacity = "1"}
        onMouseLeave={e => e.currentTarget.style.opacity = "0.65"}>
        A Legends Commission Production
      </a>
      <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
        <a href="/privacy" style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: "rgba(154,142,127,0.4)", letterSpacing: "0.1em", textDecoration: "none" }}>Privacy Policy</a>
        <a href="/terms" style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: "rgba(154,142,127,0.4)", letterSpacing: "0.1em", textDecoration: "none" }}>Terms of Service</a>
        <a href="/support" style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: "rgba(154,142,127,0.4)", letterSpacing: "0.1em", textDecoration: "none" }}>Support</a>
      </div>
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
          <div style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Listen to Joe's adaptability, in his own words</div>
          <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.cream, fontStyle: "italic" }}>A 30-second declaration …</div>
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
        <div style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.muted, marginTop: -16, marginBottom: 32, fontStyle: "italic" }}>Read more in Chapter {chapter.num}.</div>

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

        {/* Book CTA */}
        <div style={{ marginTop: 60, padding: "32px", background: "rgba(212,162,78,0.04)", border: `1px solid ${C.goldDim}`, display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <img src={IMG.book} alt="Never Broken" style={{ width: "clamp(100px, 28vw, 200px)", height: "auto", flexShrink: 0, boxShadow: "12px 12px 40px rgba(0,0,0,0.5), -2px -2px 12px rgba(212,162,78,0.08)", borderRadius: 2 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: FONT.body, fontSize: "0.7rem", color: C.gold, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 10 }}>The Complete Story</div>
            <p style={{ fontFamily: FONT.display, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", color: C.cream, lineHeight: 1.3, margin: "0 0 8px 0", fontWeight: 600 }}>
              This is just one chapter.<br /><span style={{ fontStyle: "italic", color: C.gold }}>The full story is waiting.</span>
            </p>
            <p style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.muted, lineHeight: 1.6, margin: "0 0 20px 0" }}>
              Every chapter. Every setback. Every comeback. Available now in hardcover, softcover & digital.
            </p>
            <a href="/shop"
              style={{ display: "inline-block", fontFamily: FONT.body, fontSize: "0.75rem", color: C.black, background: C.gold, padding: "12px 28px", textDecoration: "none", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
              onMouseEnter={e => e.target.style.background = C.goldLight}
              onMouseLeave={e => e.target.style.background = C.gold}>
              Order Never Broken →
            </a>
            <div style={{ fontFamily: FONT.body, fontSize: "0.85rem", color: C.gold, marginTop: 10, letterSpacing: "0.05em" }}>
              🎓 All proceeds support the YUP Foundation
            </div>
          </div>
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
function VideoShowcase({ videoId }) {
  const [ref, vis] = useScrollReveal(0.1);
  return (
    <section ref={ref} style={{
      position: "relative", background: C.black,
      height: "500px", overflow: "hidden",
      opacity: vis ? 1 : 0, transition: "opacity 1.2s ease",
    }}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&muted=1&background=1`}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        allow="autoplay; fullscreen"
        title="Video Showcase"
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60px", background: `linear-gradient(180deg, ${C.black} 0%, transparent 100%)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: `linear-gradient(0deg, ${C.black} 0%, transparent 100%)`, zIndex: 2, pointerEvents: "none" }} />
    </section>
  );
}
function HologramSection() {
  const [ref, vis] = useScrollReveal(0.05);
  const [muted, setMuted] = useState(true);
  return (
    <section ref={ref} style={{
      position: "relative", background: "#050508",
      padding: "20px 0", overflow: "hidden",
      opacity: vis ? 1 : 0, transition: "opacity 1.5s ease",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: "500px", height: "500px",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(30,80,180,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 600, margin: "0 auto", zIndex: 1 }}>
        <div style={{ position: "relative", paddingTop: "100%", width: "100%" }}>
          <iframe
            key={`holo-${muted}`}
            src={`https://player.vimeo.com/video/1169383000?autoplay=1&loop=1&muted=${muted ? 1 : 0}&background=${muted ? 1 : 0}`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            allow="autoplay; fullscreen"
            title="Dr. Joe Profit — Hologram"
          />
        </div>
        <button
          onClick={() => setMuted(!muted)}
          style={{
            position: "absolute", bottom: 16, right: 16, zIndex: 10,
            background: "rgba(10,9,8,0.7)", border: `1px solid ${C.goldDim}`,
            borderRadius: "50%", width: 44, height: 44,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.3s",
            fontSize: "1.1rem",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,162,78,0.15)"; e.currentTarget.style.borderColor = C.gold; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,9,8,0.7)"; e.currentTarget.style.borderColor = C.goldDim; }}
        >
          {muted ? "🔇" : "🔊"}
        </button>
        <div style={{ position: "absolute", bottom: -22, right: 0, fontFamily: FONT.body, fontSize: "0.65rem", color: C.goldDim, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", pointerEvents: "none" }}>Click for sound</div>
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(180deg, #050508 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(0deg, #050508 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
    </section>
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

// ─── SHOP PAGE ───
function ShopPage() {
  const [orderStates, setOrderStates] = useState({ hardcover: 'idle', paperback: 'idle', audiobook: 'idle' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [headRef, headVis] = useScrollReveal(0.1);
  const [productsRef, productsVis] = useScrollReveal(0.08);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.search.includes('order=success')) {
      setOrderSuccess(true);
      window.history.replaceState({}, '', '/shop');
    }
  }, []);

  const handleOrder = async (edition) => {
    setOrderStates(s => ({ ...s, [edition]: 'loading' }));
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edition }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error();
    } catch {
      setOrderStates(s => ({ ...s, [edition]: 'error' }));
    }
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{background:${C.black};overflow-x:hidden}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    a:hover{opacity:0.85}
    ::selection{background:${C.gold};color:${C.black}}
    img{-webkit-user-drag:none}
    @media(max-width:820px){
      .dnav{display:none!important}
      .mobile-nav-btn{display:block!important}
      .shopgrid{grid-template-columns:1fr 1fr!important}
    }
    @media(max-width:560px){
      .shopgrid{grid-template-columns:1fr!important}
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <Grain />
      <Nav />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: C.black, paddingTop: 80 }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)',
        }}>
          {MOSAIC.map((img, i) => (
            <div key={i} style={{ backgroundImage: `url(${img.src})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(0.28)' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.black} 0%, rgba(10,9,8,0.5) 30%, rgba(10,9,8,0.5) 70%, ${C.black} 100%)` }} />
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.3 }} />

        <div ref={headRef} style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: 'clamp(60px, 8vw, 100px) 24px clamp(50px, 7vw, 80px)',
          opacity: headVis ? 1 : 0, transform: headVis ? 'none' : 'translateY(24px)',
          transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <div style={{ fontFamily: FONT.body, fontSize: '0.7rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 16 }}>The Shop</div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', color: C.cream, fontWeight: 400, margin: '0 0 20px', lineHeight: 1.05 }}>
            Never <em style={{ color: C.gold }}>Broken</em>
          </h1>
          <p style={{ fontFamily: FONT.body, fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)', color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.8, fontWeight: 300 }}>
            The complete story of Dr. Joe Profit. Choose your format below.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 28, padding: '10px 18px', border: `1px solid ${C.goldDim}`, background: 'rgba(212,162,78,0.05)' }}>
            <span style={{ fontFamily: FONT.body, fontSize: '0.8rem', color: C.gold }}>🎓 <strong>100% of proceeds</strong> go to the YUP Foundation</span>
          </div>
        </div>
      </section>

      {/* ── Order success banner ── */}
      {orderSuccess && (
        <div style={{ background: 'rgba(212,162,78,0.1)', borderBottom: `1px solid ${C.gold}`, padding: '18px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: FONT.body, fontSize: '0.95rem', color: C.gold, margin: 0 }}>
            <strong>Order received — thank you.</strong> Your book ships within 3–5 business days. 100% goes to the YUP Foundation.
          </p>
        </div>
      )}

      {/* ── Products grid ── */}
      <section style={{ background: C.black, padding: 'clamp(60px, 8vw, 100px) 0' }}>
        <div ref={productsRef} style={{
          maxWidth: 1000, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)',
          opacity: productsVis ? 1 : 0, transform: productsVis ? 'none' : 'translateY(30px)',
          transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1)',
        }}>

          {/* Physical books */}
          <div style={{ fontFamily: FONT.body, fontSize: '0.68rem', color: C.muted, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${C.line}` }}>
            Print Editions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }} className="shopgrid">
            {[
              { key: 'hardcover', label: 'Hardcover', price: '$31.95', desc: 'Premium hardcover binding. A keepsake edition worthy of the story inside.' },
              { key: 'paperback', label: 'Paperback', price: '$19.95', desc: 'Classic paperback. The full story, every chapter, at an accessible price.' },
            ].map(({ key, label, price, desc }) => (
              <div key={key} style={{ background: C.dark, border: `1px solid ${C.lineBright}`, padding: 'clamp(28px, 4vw, 40px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: 24, textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', position: 'relative', boxShadow: '12px 12px 40px rgba(0,0,0,0.6)', transform: 'rotate(-1deg)' }}>
                    <img src={IMG.book} alt={`Never Broken — ${label}`} style={{ width: 'clamp(200px, 28vw, 324px)', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 3px 0 10px rgba(0,0,0,0.4)' }} />
                  </div>
                </div>
                <div style={{ fontFamily: FONT.body, fontSize: '0.68rem', color: C.gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: FONT.display, fontSize: '1.6rem', color: C.gold, fontStyle: 'italic', marginBottom: 12 }}>{price}</div>
                <p style={{ fontFamily: FONT.body, fontSize: '0.9rem', color: C.muted, lineHeight: 1.7, marginBottom: 24, flex: 1 }}>{desc}</p>
                <button
                  onClick={() => handleOrder(key)}
                  disabled={orderStates[key] === 'loading'}
                  style={{
                    fontFamily: FONT.body, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: C.black, background: orderStates[key] === 'loading' ? C.muted : C.gold,
                    border: 'none', padding: '14px 24px', cursor: orderStates[key] === 'loading' ? 'not-allowed' : 'pointer',
                    fontWeight: 700, transition: 'all 0.3s', width: '100%',
                  }}
                  onMouseEnter={e => { if (orderStates[key] !== 'loading') e.currentTarget.style.background = C.goldLight; }}
                  onMouseLeave={e => { if (orderStates[key] !== 'loading') e.currentTarget.style.background = C.gold; }}
                >
                  {orderStates[key] === 'loading' ? 'Preparing Checkout…' : `Order ${label}`}
                </button>
                {orderStates[key] === 'error' && (
                  <p style={{ fontFamily: FONT.body, fontSize: '0.8rem', color: '#c0392b', marginTop: 8, fontStyle: 'italic' }}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CashApp alternative */}
          <div style={{ textAlign: 'center', padding: '28px 0 40px', borderTop: `1px solid ${C.line}` }}>
            <p style={{ fontFamily: FONT.body, fontSize: '0.7rem', color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
              Prefer to pay with CashApp?
            </p>
            <a
              href="https://cash.app/$YUPKIDS"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: FONT.body, fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: C.gold, border: `1px solid ${C.gold}`, padding: '12px 28px',
                textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.goldDim; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '1.1rem' }}>$</span> Send via CashApp · $YUPKIDS
            </a>
            <p style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.muted, opacity: 0.5, marginTop: 12, fontStyle: 'italic' }}>
              Include your shipping address in the CashApp note.
            </p>
          </div>

          {/* Digital editions */}
          <div style={{ fontFamily: FONT.body, fontSize: '0.68rem', color: C.muted, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${C.line}` }}>
            Digital Editions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 64 }} className="shopgrid">

            {/* Audiobook — LIVE */}
            <div style={{ background: C.dark, border: `1px solid ${C.lineBright}`, padding: 'clamp(28px, 4vw, 40px)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: 20 }}>🎧</div>
              <div style={{ fontFamily: FONT.body, fontSize: '0.68rem', color: C.gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>Audiobook</div>
              <div style={{ fontFamily: FONT.display, fontSize: '1.6rem', color: C.gold, fontStyle: 'italic', marginBottom: 12 }}>$9.99</div>
              <p style={{ fontFamily: FONT.body, fontSize: '0.9rem', color: C.muted, lineHeight: 1.7, marginBottom: 8, flex: 1 }}>
                18 chapters. Joe's full story in his own voice — a voice preservation project unlike any other.
              </p>
              <p style={{ fontFamily: FONT.body, fontSize: '0.78rem', color: C.gold, opacity: 0.6, fontStyle: 'italic', marginBottom: 20 }}>21 tracks · Narrated in Joe's voice</p>
              <button
                onClick={() => handleOrder('audiobook')}
                disabled={orderStates.audiobook === 'loading'}
                style={{
                  fontFamily: FONT.body, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: C.black, background: orderStates.audiobook === 'loading' ? C.muted : C.gold,
                  border: 'none', padding: '14px 24px', cursor: orderStates.audiobook === 'loading' ? 'not-allowed' : 'pointer',
                  fontWeight: 700, transition: 'all 0.3s', width: '100%',
                }}
                onMouseEnter={e => { if (orderStates.audiobook !== 'loading') e.currentTarget.style.background = C.goldLight; }}
                onMouseLeave={e => { if (orderStates.audiobook !== 'loading') e.currentTarget.style.background = C.gold; }}
              >
                {orderStates.audiobook === 'loading' ? 'Preparing Checkout…' : 'Buy Audiobook'}
              </button>
              {orderStates.audiobook === 'error' && (
                <p style={{ fontFamily: FONT.body, fontSize: '0.8rem', color: '#c0392b', marginTop: 8, fontStyle: 'italic' }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </div>

            {/* eBook — Coming Soon */}
            <div style={{ background: C.dark2, border: `1px solid ${C.line}`, padding: 'clamp(28px, 4vw, 40px)', opacity: 0.65, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: FONT.body, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'rgba(212,162,78,0.1)', padding: '4px 10px', border: `1px solid ${C.goldDim}` }}>
                Coming Soon
              </div>
              <div style={{ fontSize: '2.4rem', marginBottom: 20 }}>📖</div>
              <div style={{ fontFamily: FONT.body, fontSize: '0.68rem', color: C.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>eBook</div>
              <p style={{ fontFamily: FONT.body, fontSize: '0.9rem', color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>Read anywhere on any device. The complete book in digital format.</p>
              <p style={{ fontFamily: FONT.body, fontSize: '0.78rem', color: C.gold, opacity: 0.6, fontStyle: 'italic' }}>PDF &amp; EPUB</p>
              <div style={{ marginTop: 24, height: 46, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>Notify Me</span>
              </div>
            </div>

          </div>

          {/* More coming */}
          <div style={{ textAlign: 'center', padding: '40px 0', borderTop: `1px solid ${C.line}` }}>
            <p style={{ fontFamily: FONT.display, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: C.muted, fontStyle: 'italic', marginBottom: 8, opacity: 0.6 }}>
              More from Dr. Joe Profit — coming soon.
            </p>
            <p style={{ fontFamily: FONT.body, fontSize: '0.8rem', color: C.muted, opacity: 0.4 }}>
              Speaking resources, foundation merchandise, and more.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}

// ─── AUDIOBOOK TRACK MANIFEST ───
const AUDIOBOOK_TRACKS = [
  { file: '01_acknowledgments.mp3', title: 'Acknowledgments', num: 0 },
  { file: '02_forward with dave emanual.mp3', title: 'Foreword — Dave Emanuel', num: 0 },
  { file: '03_introduction.mp3', title: 'Introduction', num: 0 },
  { file: '04_chapter_01.mp3', title: 'Chapter 1 — Roots', num: 1 },
  { file: '05_chapter_02.mp3', title: 'Chapter 2 — The Brogan Boots', num: 2 },
  { file: '06_chapter_03.mp3', title: 'Chapter 3 — Breaking Barriers', num: 3 },
  { file: '07_chapter_04.mp3', title: 'Chapter 4 — The Draft', num: 4 },
  { file: '08_chapter_05.mp3', title: 'Chapter 5 — Empire', num: 5 },
  { file: '09_chapter_06.mp3', title: 'Chapter 6 — Power & Purpose', num: 6 },
  { file: '10_chapter_07.mp3', title: 'Chapter 7', num: 7 },
  { file: '11_chapter_08.mp3', title: 'Chapter 8', num: 8 },
  { file: '12_chapter_09.mp3', title: 'Chapter 9', num: 9 },
  { file: '13_chapter_10.mp3', title: 'Chapter 10', num: 10 },
  { file: '14_chapter_11.mp3', title: 'Chapter 11', num: 11 },
  { file: '15_chapter_12.mp3', title: 'Chapter 12', num: 12 },
  { file: '16_chapter_13.mp3', title: 'Chapter 13', num: 13 },
  { file: '17_chapter_14.mp3', title: 'Chapter 14', num: 14 },
  { file: '18_chapter_15.mp3', title: 'Chapter 15', num: 15 },
  { file: '19_chapter_16.mp3', title: 'Chapter 16', num: 16 },
  { file: '20_chapter_17.mp3', title: 'Chapter 17', num: 17 },
  { file: '21_chapter_18.mp3', title: 'Chapter 18', num: 18 },
];

const AUDIOBOOK_BASE = '/audio/never_broken_audiobook/';

// ─── AUDIOBOOK PLAYER COMPONENT ───
function AudiobookPlayer({ trackIndex, tracks, onTrackChange }) {
  const audioRef = useRef(null);
  const saveTimerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurTime] = useState(0);
  const [speed, setSpeed] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem('jp_audiobook_progress')); return s?.playbackSpeed || 1; } catch { return 1; }
  });
  const [loaded, setLoaded] = useState(false);

  const track = tracks[trackIndex];
  const fmt = (s) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' : ''}${sec}`; };
  const bars = useMemo(() => Array.from({ length: 80 }, () => 0.15 + Math.random() * 0.85), []);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    if (!audioRef.current) return;
    try {
      const existing = JSON.parse(localStorage.getItem('jp_audiobook_progress') || '{}');
      const chapterProgress = existing.chapterProgress || {};
      chapterProgress[track.file] = { time: audioRef.current.currentTime, completed: false };
      localStorage.setItem('jp_audiobook_progress', JSON.stringify({
        currentTrackIndex: trackIndex,
        currentTime: audioRef.current.currentTime,
        playbackSpeed: speed,
        chapterProgress,
        lastUpdated: new Date().toISOString(),
      }));
    } catch { /* localStorage full or unavailable */ }
  }, [trackIndex, track.file, speed]);

  // Mark chapter completed
  const markCompleted = useCallback(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('jp_audiobook_progress') || '{}');
      const chapterProgress = existing.chapterProgress || {};
      chapterProgress[track.file] = { time: 0, completed: true };
      localStorage.setItem('jp_audiobook_progress', JSON.stringify({ ...existing, chapterProgress }));
    } catch { /* */ }
  }, [track.file]);

  // Audio event handlers
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onTime = () => {
      setCurTime(a.currentTime);
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    };
    const onMeta = () => {
      setDuration(a.duration);
      setLoaded(true);
      // Restore position for this track
      try {
        const saved = JSON.parse(localStorage.getItem('jp_audiobook_progress') || '{}');
        if (saved.currentTrackIndex === trackIndex && saved.currentTime > 0) {
          a.currentTime = saved.currentTime;
        } else if (saved.chapterProgress?.[track.file]?.time > 0 && !saved.chapterProgress[track.file].completed) {
          a.currentTime = saved.chapterProgress[track.file].time;
        }
      } catch { /* */ }
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(100);
      markCompleted();
      // Auto-advance
      if (trackIndex < tracks.length - 1) {
        setTimeout(() => onTrackChange(trackIndex + 1), 800);
      }
    };
    const onPause = () => saveProgress();

    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnd);
    a.addEventListener('pause', onPause);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('pause', onPause);
    };
  }, [trackIndex, track.file, tracks.length, onTrackChange, saveProgress, markCompleted]);

  // Debounced save every 5 seconds during playback
  useEffect(() => {
    if (playing) {
      saveTimerRef.current = setInterval(saveProgress, 5000);
    } else {
      clearInterval(saveTimerRef.current);
    }
    return () => clearInterval(saveTimerRef.current);
  }, [playing, saveProgress]);

  // Save on tab close / visibility change
  useEffect(() => {
    const onBeforeUnload = () => saveProgress();
    const onVisChange = () => { if (document.hidden) saveProgress(); };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('visibilitychange', onVisChange);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, [saveProgress]);

  // Playback speed
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed, trackIndex]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => {}); }
    setPlaying(!playing);
  };

  const skip = (sec) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + sec));
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = pct * audioRef.current.duration;
    }
  };

  const speeds = [0.75, 1, 1.25, 1.5];

  // Reset play state when track changes
  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setCurTime(0);
    setDuration(0);
    setLoaded(false);
  }, [trackIndex]);

  return (
    <div style={{ background: C.dark, border: `1px solid ${C.lineBright}`, padding: 'clamp(20px, 3vw, 32px)' }}>
      <audio ref={audioRef} src={`${AUDIOBOOK_BASE}${encodeURIComponent(track.file)}`} preload="metadata" />

      {/* Track info */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6 }}>
          Track {trackIndex + 1} of {tracks.length}
        </div>
        <div style={{ fontFamily: FONT.display, fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: C.cream, fontWeight: 400 }}>
          {track.title}
        </div>
      </div>

      {/* Waveform */}
      <div onClick={seek} style={{ display: 'flex', alignItems: 'center', gap: 1.5, height: 48, cursor: 'pointer', padding: '4px 0', marginBottom: 12 }}>
        {bars.map((h, i) => {
          const pct = (i / bars.length) * 100;
          const isPlayed = pct <= progress;
          return (
            <div key={i} style={{ flex: 1, height: `${h * 100}%`, background: isPlayed ? C.gold : 'rgba(154,142,127,0.2)', borderRadius: 1, transition: 'background 0.1s', minWidth: 2 }} />
          );
        })}
      </div>

      {/* Time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontFamily: FONT.body, fontSize: '0.78rem', color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{fmt(currentTime)}</span>
        <span style={{ fontFamily: FONT.body, fontSize: '0.78rem', color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{loaded ? fmt(duration) : '—:——'}</span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 3vw, 24px)', marginBottom: 20 }}>
        {/* Prev track */}
        <button onClick={() => trackIndex > 0 && onTrackChange(trackIndex - 1)} disabled={trackIndex === 0}
          style={{ background: 'none', border: 'none', color: trackIndex === 0 ? C.line : C.muted, cursor: trackIndex === 0 ? 'default' : 'pointer', fontSize: '1.2rem', padding: 8 }}
          title="Previous track">⏮</button>

        {/* Skip back 15s */}
        <button onClick={() => skip(-15)}
          style={{ background: 'none', border: `1px solid ${C.lineBright}`, color: C.muted, cursor: 'pointer', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.body, fontSize: '0.6rem', fontWeight: 700, transition: 'all 0.2s' }}
          title="Back 15 seconds">-15</button>

        {/* Play/Pause */}
        <button onClick={toggle}
          style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${C.gold}`, background: playing ? C.goldDim : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0 }}>
          {playing ? (
            <div style={{ display: 'flex', gap: 5 }}>
              <div style={{ width: 4, height: 18, background: C.gold }} />
              <div style={{ width: 4, height: 18, background: C.gold }} />
            </div>
          ) : (
            <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: `18px solid ${C.gold}`, marginLeft: 4 }} />
          )}
        </button>

        {/* Skip forward 15s */}
        <button onClick={() => skip(15)}
          style={{ background: 'none', border: `1px solid ${C.lineBright}`, color: C.muted, cursor: 'pointer', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.body, fontSize: '0.6rem', fontWeight: 700, transition: 'all 0.2s' }}
          title="Forward 15 seconds">+15</button>

        {/* Next track */}
        <button onClick={() => trackIndex < tracks.length - 1 && onTrackChange(trackIndex + 1)} disabled={trackIndex === tracks.length - 1}
          style={{ background: 'none', border: 'none', color: trackIndex === tracks.length - 1 ? C.line : C.muted, cursor: trackIndex === tracks.length - 1 ? 'default' : 'pointer', fontSize: '1.2rem', padding: 8 }}
          title="Next track">⏭</button>
      </div>

      {/* Speed selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.muted, letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: 4 }}>Speed</span>
        {speeds.map(s => (
          <button key={s} onClick={() => setSpeed(s)}
            style={{
              fontFamily: FONT.body, fontSize: '0.72rem', fontWeight: speed === s ? 700 : 400,
              color: speed === s ? C.gold : C.muted,
              background: speed === s ? C.goldDim : 'transparent',
              border: `1px solid ${speed === s ? C.gold : C.line}`,
              padding: '4px 10px', cursor: 'pointer', transition: 'all 0.2s',
            }}>
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── AUDIOBOOK PAGE ───
function AudiobookPage() {
  const [access, setAccess] = useState(null); // null = checking, true = granted, false = denied
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showTracklist, setShowTracklist] = useState(true);
  const [resumeInfo, setResumeInfo] = useState(null);

  // Check purchase access
  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      // Validate purchase with API
      fetch('/api/validate-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            localStorage.setItem('jp_audiobook_access', JSON.stringify({
              sessionId, email: data.email, product: data.product, timestamp: new Date().toISOString(),
            }));
            setAccess(true);
          } else {
            setAccess(false);
          }
        })
        .catch(() => setAccess(false));
      // Clean URL
      window.history.replaceState({}, '', '/audiobook');
    } else {
      // Check localStorage
      const stored = localStorage.getItem('jp_audiobook_access');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.sessionId) { setAccess(true); return; }
        } catch { /* */ }
      }
      setAccess(false);
    }
  }, []);

  // Load saved progress for resume banner
  useEffect(() => {
    if (access !== true) return;
    try {
      const saved = JSON.parse(localStorage.getItem('jp_audiobook_progress') || 'null');
      if (saved && saved.currentTrackIndex != null && saved.currentTime > 1) {
        const t = AUDIOBOOK_TRACKS[saved.currentTrackIndex];
        if (t) {
          setResumeInfo({ trackIndex: saved.currentTrackIndex, time: saved.currentTime, title: t.title });
        }
      }
    } catch { /* */ }
  }, [access]);

  const handleResume = () => {
    if (resumeInfo) {
      setCurrentTrack(resumeInfo.trackIndex);
    }
    setResumeInfo(null);
  };

  const handleStartOver = () => {
    localStorage.removeItem('jp_audiobook_progress');
    setCurrentTrack(0);
    setResumeInfo(null);
  };

  const handleTrackChange = useCallback((idx) => {
    setCurrentTrack(idx);
    setResumeInfo(null);
  }, []);

  const fmt = (s) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' : ''}${sec}`; };

  // Get chapter progress for tracklist
  const getChapterState = (file) => {
    try {
      const saved = JSON.parse(localStorage.getItem('jp_audiobook_progress') || '{}');
      return saved.chapterProgress?.[file] || {};
    } catch { return {}; }
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{background:${C.black};overflow-x:hidden}
    ::selection{background:${C.gold};color:${C.black}}
    @media(max-width:820px){
      .ab-layout{flex-direction:column!important}
      .ab-sidebar{max-height:280px!important;position:relative!important;top:auto!important}
    }
  `;

  // Loading state
  if (access === null) {
    return (
      <>
        <style>{globalStyles}</style>
        <div style={{ minHeight: '100vh', background: C.black, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONT.body, fontSize: '0.9rem', color: C.muted }}>Verifying your purchase…</div>
        </div>
      </>
    );
  }

  // Purchase required
  if (access === false) {
    return (
      <>
        <style>{globalStyles}</style>
        <Grain />
        <Nav />
        <section style={{ minHeight: '100vh', background: C.black, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 500 }}>
            <div style={{ fontSize: '3rem', marginBottom: 24 }}>🎧</div>
            <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: C.cream, fontWeight: 400, marginBottom: 16 }}>
              Audiobook Access
            </h1>
            <p style={{ fontFamily: FONT.body, fontSize: '1rem', color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
              Purchase the audiobook to unlock all 18 chapters of <em style={{ color: C.cream }}>Never Broken</em> — narrated in Joe's own voice.
            </p>
            <a href="/shop" style={{
              display: 'inline-block', fontFamily: FONT.body, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.black, background: C.gold, padding: '14px 36px', textDecoration: 'none', fontWeight: 700, transition: 'all 0.3s',
            }}>
              Go to Shop
            </a>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // ── Audiobook player (access granted) ──
  return (
    <>
      <style>{globalStyles}</style>
      <Grain />
      <Nav />

      {/* Header */}
      <section style={{ background: C.black, paddingTop: 100, paddingBottom: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)', textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12 }}>
            Audiobook
          </div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: C.cream, fontWeight: 400, margin: '0 0 8px', lineHeight: 1.1 }}>
            Never <em style={{ color: C.gold }}>Broken</em>
          </h1>
          <p style={{ fontFamily: FONT.body, fontSize: '0.85rem', color: C.muted, fontWeight: 300 }}>
            Dr. Joe Profit &middot; 21 tracks
          </p>
        </div>
      </section>

      {/* Resume banner */}
      {resumeInfo && (
        <div style={{ background: 'rgba(212,162,78,0.08)', borderTop: `1px solid ${C.goldDim}`, borderBottom: `1px solid ${C.goldDim}`, padding: '14px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <p style={{ fontFamily: FONT.body, fontSize: '0.85rem', color: C.cream, margin: 0 }}>
              Resume <strong style={{ color: C.gold }}>{resumeInfo.title}</strong> at {fmt(resumeInfo.time)}?
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleResume} style={{
                fontFamily: FONT.body, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: C.black, background: C.gold, border: 'none', padding: '8px 20px', cursor: 'pointer', fontWeight: 700,
              }}>Resume</button>
              <button onClick={handleStartOver} style={{
                fontFamily: FONT.body, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: C.muted, background: 'transparent', border: `1px solid ${C.line}`, padding: '8px 20px', cursor: 'pointer',
              }}>Start Over</button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout: sidebar + player */}
      <section style={{ background: C.black, padding: 'clamp(24px, 4vw, 48px) 0 80px' }}>
        <div className="ab-layout" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px)', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Tracklist sidebar */}
          <div className="ab-sidebar" style={{ width: 320, flexShrink: 0, position: 'sticky', top: 100, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
            <button onClick={() => setShowTracklist(!showTracklist)} style={{
              display: 'none', width: '100%', fontFamily: FONT.body, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: C.gold, background: 'transparent', border: `1px solid ${C.lineBright}`, padding: '10px 16px', cursor: 'pointer', marginBottom: 12,
            }} className="ab-toggle-btn">
              {showTracklist ? 'Hide' : 'Show'} Tracklist
            </button>

            <div style={{ fontFamily: FONT.body, fontSize: '0.62rem', color: C.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.line}` }}>
              Chapters
            </div>

            {AUDIOBOOK_TRACKS.map((t, i) => {
              const isActive = i === currentTrack;
              const state = getChapterState(t.file);
              return (
                <button key={t.file} onClick={() => handleTrackChange(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  background: isActive ? 'rgba(212,162,78,0.08)' : 'transparent',
                  border: 'none', borderLeft: `2px solid ${isActive ? C.gold : 'transparent'}`,
                  padding: '10px 12px', cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  <span style={{ fontFamily: FONT.body, fontSize: '0.68rem', color: state.completed ? C.gold : (isActive ? C.cream : C.muted), fontVariantNumeric: 'tabular-nums', width: 20, flexShrink: 0, textAlign: 'center' }}>
                    {state.completed ? '✓' : (i + 1)}
                  </span>
                  <span style={{ fontFamily: FONT.body, fontSize: '0.82rem', color: isActive ? C.cream : C.muted, fontWeight: isActive ? 500 : 400, lineHeight: 1.4 }}>
                    {t.title}
                  </span>
                  {isActive && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: C.gold }}>♪</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Player */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <AudiobookPlayer trackIndex={currentTrack} tracks={AUDIOBOOK_TRACKS} onTrackChange={handleTrackChange} />

            {/* 100% proceeds notice */}
            <div style={{ marginTop: 24, textAlign: 'center', padding: '16px', border: `1px solid ${C.goldDim}`, background: 'rgba(212,162,78,0.03)' }}>
              <span style={{ fontFamily: FONT.body, fontSize: '0.78rem', color: C.gold }}>
                🎓 <strong>100% of proceeds</strong> go to the YUP Foundation
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}

// ─── HOME PAGE ───
function HomePage() {
  const [activeChapter, setActiveChapter] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

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
          .testimgrid{grid-template-columns:1fr 1fr!important}
          .hero-portrait{width:clamp(120px,25vw,220px)!important}
          .hero-book-row{flex-wrap:wrap!important}
          .lcgrid{grid-template-columns:1fr!important}
          .lcfull{grid-template-columns:1fr!important}
        }
        @media(max-width:600px){
          .testimgrid{grid-template-columns:1fr!important}
          .hero-portrait{display:none!important}
          .tl-center-line{left:16px!important}
          .tl-dot{left:16px!important}
          .tl-item{padding-left:40px!important;padding-right:0!important;justify-content:flex-start!important}
          .tl-item-text{text-align:left!important}
        }
      `}</style>
      <Grain />
      <Nav />
      <HeroSection />
      <Marquee />
      <PressLogoWall />
      <HeroAudioHook />
      <StorySection onOpenChapter={openChapter} />
      <HologramSection />
      <ParallaxQuote quote="They can break your body, but they can never break your spirit. That's the one thing you own outright." attribution="Dr. Joe Profit" />
      <VideoShowcase videoId="1169383220" />
      <ArchiveSection />
      <TimelineSection />
      <ParallaxQuote quote="Every morning the sun rises again. No matter what happened yesterday, you get another chance. That's not optimism — that's a fact." attribution="Dr. Joe Profit" />
      <CharitySection />
      <VideoShowcase videoId="1169381642" />
      <BookSection onOpenPreview={() => setPreviewOpen(true)} />
      {previewOpen && <BookPreviewModal onClose={() => setPreviewOpen(false)} />}
      {/* <BookTrailerSection /> — restore when trailer Vimeo ID is ready */}
      <TestimonialsSection />
      <PortraitSection />
      <ContactSection />
      <Footer />
      <BackToTop />
    </>
  );
}

// ─── LEGAL PAGE SHELL ───
function LegalPage({ title, children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:${C.black};overflow-x:hidden}
        ::selection{background:${C.gold};color:${C.black}}
      `}</style>
      <Grain />
      <div style={{ minHeight: "100vh", background: C.black, color: C.cream, fontFamily: FONT.body, padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <a href="/" style={{ display: "inline-block", marginBottom: 40, fontFamily: FONT.body, fontSize: "0.8rem", color: C.gold, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", opacity: 0.7 }}>← Back</a>
          <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(2rem, 5vw, 3rem)", color: C.gold, marginBottom: 8, fontWeight: 700 }}>{title}</h1>
          <p style={{ fontSize: "0.8rem", color: C.muted, marginBottom: 48, opacity: 0.6 }}>Last updated: March 2026</p>
          <div style={{ lineHeight: 1.8, fontSize: "1rem", color: "rgba(245,237,224,0.85)" }}>
            {children}
          </div>
        </div>
        <div style={{ maxWidth: 780, margin: "48px auto 0", borderTop: `1px solid ${C.line}`, paddingTop: 24, display: "flex", gap: 20 }}>
          <a href="/privacy" style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.muted, textDecoration: "none", opacity: 0.5 }}>Privacy Policy</a>
          <a href="/terms" style={{ fontFamily: FONT.body, fontSize: "0.75rem", color: C.muted, textDecoration: "none", opacity: 0.5 }}>Terms of Service</a>
        </div>
      </div>
    </>
  );
}

const LS = {
  h2: { fontFamily: FONT.display, fontSize: "1.3rem", color: C.gold, marginTop: 40, marginBottom: 12, fontWeight: 600 },
  p: { marginBottom: 16 },
  ul: { paddingLeft: 20, marginBottom: 16 },
  li: { marginBottom: 8 },
  a: { color: C.gold, textDecoration: "none" },
};

// ─── PRIVACY POLICY PAGE ───
function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p style={LS.p}>This Privacy Policy describes how Yeti Groove Media LLC ("we," "us," or "our") collects, uses, and protects information when you visit <strong>joe-profit.com</strong> (the "Site") or make a purchase.</p>

      <h2 style={LS.h2}>Information We Collect</h2>
      <p style={LS.p}>We collect information you provide directly when you:</p>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Place an order</strong> — name, email address, shipping address, and payment information (processed securely by Stripe, PayPal, or Cash App — we do not store your payment card details).</li>
        <li style={LS.li}><strong>Contact us</strong> — name, email, and message content.</li>
      </ul>
      <p style={LS.p}>We also automatically collect standard technical data when you visit the Site, including your IP address, browser type, pages viewed, and referring URLs. This is standard server/analytics logging.</p>

      <h2 style={LS.h2}>How We Use Your Information</h2>
      <ul style={LS.ul}>
        <li style={LS.li}>To process and fulfill your orders and send order confirmations.</li>
        <li style={LS.li}>To respond to your inquiries and customer service requests.</li>
        <li style={LS.li}>To improve and maintain the Site.</li>
        <li style={LS.li}>To comply with legal obligations.</li>
      </ul>
      <p style={LS.p}>We do not sell, rent, or trade your personal information to third parties.</p>

      <h2 style={LS.h2}>Payment Processing</h2>
      <p style={LS.p}>All payments are processed by third-party providers — Stripe, PayPal, and Cash App. Your payment information is transmitted directly to these processors and is subject to their privacy policies. We do not store full credit card numbers or financial account details on our servers.</p>

      <h2 style={LS.h2}>Cookies</h2>
      <p style={LS.p}>The Site may use essential cookies required for navigation and security. We do not use tracking cookies for advertising purposes.</p>

      <h2 style={LS.h2}>Data Retention</h2>
      <p style={LS.p}>We retain order and contact information for as long as necessary to fulfill orders, handle disputes, and meet legal requirements. You may request deletion of your personal data at any time by contacting us.</p>

      <h2 style={LS.h2}>Your Rights</h2>
      <p style={LS.p}>You have the right to request access to, correction of, or deletion of personal data we hold about you. To exercise these rights, contact us at the email below.</p>

      <h2 style={LS.h2}>Children's Privacy</h2>
      <p style={LS.p}>This Site is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>

      <h2 style={LS.h2}>Changes to This Policy</h2>
      <p style={LS.p}>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>

      <h2 style={LS.h2}>Contact</h2>
      <p style={LS.p}>Questions about this policy? Contact us at: <a href="mailto:jprofit23@gmail.com" style={LS.a}>jprofit23@gmail.com</a></p>
      <p style={LS.p}>Yeti Groove Media LLC · Adrian, Michigan</p>
    </LegalPage>
  );
}

// ─── TERMS OF SERVICE PAGE ───
function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p style={LS.p}>These Terms of Service ("Terms") govern your use of <strong>joe-profit.com</strong> (the "Site") operated by Yeti Groove Media LLC ("we," "us," or "our"). By accessing or using the Site, you agree to these Terms.</p>

      <h2 style={LS.h2}>Use of the Site</h2>
      <p style={LS.p}>You may use the Site for lawful purposes only. You agree not to:</p>
      <ul style={LS.ul}>
        <li style={LS.li}>Use the Site in any way that violates applicable laws or regulations.</li>
        <li style={LS.li}>Reproduce, distribute, or commercially exploit any Site content without written permission.</li>
        <li style={LS.li}>Attempt to gain unauthorized access to any portion of the Site or its related systems.</li>
      </ul>

      <h2 style={LS.h2}>Products and Orders</h2>
      <p style={LS.p}>All product descriptions and prices are subject to change without notice. We reserve the right to refuse or cancel any order. If a charge has already been made and we cancel the order, we will issue a full refund.</p>

      <h2 style={LS.h2}>Payments</h2>
      <p style={LS.p}>We accept payment via Stripe (credit/debit card), PayPal, and Cash App. By providing payment information, you represent that you are authorized to use the payment method. All transactions are subject to the terms and conditions of the respective payment processor.</p>

      <h2 style={LS.h2}>Shipping and Delivery</h2>
      <p style={LS.p}>Physical products (books) are shipped to the address you provide at checkout. Estimated delivery times are provided at checkout and are not guaranteed. We are not responsible for delays caused by shipping carriers or customs.</p>

      <h2 style={LS.h2}>Returns and Refunds</h2>
      <p style={LS.p}>If you receive a damaged or defective product, contact us within 14 days of delivery at <a href="mailto:jprofit23@gmail.com" style={LS.a}>jprofit23@gmail.com</a> and we will arrange a replacement or full refund. Digital products (audiobooks, downloads) are non-refundable once accessed.</p>

      <h2 style={LS.h2}>Intellectual Property</h2>
      <p style={LS.p}>All content on this Site — including text, images, audio, video, and design — is owned by Yeti Groove Media LLC or Dr. Joe Profit and is protected by copyright and other intellectual property laws. No content may be reproduced without express written consent.</p>

      <h2 style={LS.h2}>Disclaimer of Warranties</h2>
      <p style={LS.p}>The Site and its content are provided "as is" without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of harmful components.</p>

      <h2 style={LS.h2}>Limitation of Liability</h2>
      <p style={LS.p}>To the fullest extent permitted by law, Yeti Groove Media LLC and Dr. Joe Profit shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or products purchased through it.</p>

      <h2 style={LS.h2}>Governing Law</h2>
      <p style={LS.p}>These Terms are governed by the laws of the State of Michigan, without regard to its conflict of law provisions.</p>

      <h2 style={LS.h2}>Changes to These Terms</h2>
      <p style={LS.p}>We reserve the right to modify these Terms at any time. Continued use of the Site after changes constitutes acceptance of the updated Terms.</p>

      <h2 style={LS.h2}>Contact</h2>
      <p style={LS.p}>Questions? Contact us at: <a href="mailto:jprofit23@gmail.com" style={LS.a}>jprofit23@gmail.com</a></p>
      <p style={LS.p}>Yeti Groove Media LLC · Adrian, Michigan</p>
    </LegalPage>
  );
}

// ─── SUPPORT PAGE ───
function SupportPage() {
  return (
    <LegalPage title="Customer Support">
      <p style={LS.p}>We're here to help. Whether you have a question about your order, received a damaged book, or need assistance with anything related to your purchase — reach out and we'll make it right.</p>

      <h2 style={LS.h2}>Contact Us</h2>
      <p style={LS.p}>Email us at: <a href="mailto:jprofit23@gmail.com" style={LS.a}>jprofit23@gmail.com</a></p>
      <p style={LS.p}>We respond within 1–2 business days.</p>

      <h2 style={LS.h2}>Order Issues</h2>
      <p style={LS.p}>If your order hasn't arrived, arrived damaged, or you received the wrong item, email us with your order confirmation number and a brief description. We'll resolve it promptly.</p>

      <h2 style={LS.h2}>Returns & Refunds</h2>
      <p style={LS.p}>Damaged or defective physical books qualify for a full refund or replacement within 14 days of delivery. Digital products are non-refundable once accessed. See our <a href="/terms" style={LS.a}>Terms of Service</a> for full details.</p>

      <h2 style={LS.h2}>Speaking & Booking Inquiries</h2>
      <p style={LS.p}>For speaking engagement requests or media inquiries, email us at: <a href="mailto:jprofit23@gmail.com" style={LS.a}>jprofit23@gmail.com</a></p>

      <h2 style={LS.h2}>General Questions</h2>
      <p style={LS.p}>For anything else — foundation partnerships, media, or general questions about Dr. Joe Profit's story and work — we'd love to hear from you.</p>
    </LegalPage>
  );
}

// ─── SPEAKING PAGE ───
const TALKS = [
  {
    type: "Signature Keynote",
    title: "Never Broken",
    purpose: "Joe's flagship talk — built around his life story and the Never Broken philosophy.",
    lengths: ["30 minutes", "45 minutes", "60 minutes"],
    focus: ["Turning adversity into strength", "Responsibility over victimhood", "Discipline under pressure", "Choosing growth instead of bitterness"],
    audience: ["Schools", "Leadership events", "Conferences", "Youth programs"],
    outcome: "Attendees leave with a new perspective on hardship and a sense of personal ownership over their story.",
    addons: [],
  },
  {
    type: "Youth Impact",
    title: "Youth Assembly Talk",
    purpose: "Adapted version of the keynote specifically for students.",
    lengths: ["30–45 minutes"],
    focus: ["Peer pressure", "Choices matter", "You are not defined by your past", "Character over popularity"],
    audience: ["Schools", "Youth programs", "Student assemblies"],
    outcome: "A new perspective on hardship and personal ownership over their story.",
    addons: ["Student Q&A session"],
  },
  {
    type: "Leadership",
    title: "Leadership Under Pressure",
    purpose: "For professionals and leaders facing stress, responsibility, and decision-making challenges.",
    lengths: ["30–45 minutes"],
    focus: ["Accountability in leadership", "Responding to adversity", "Mental resilience", "Leading without excuses"],
    audience: ["Corporate events", "Leadership retreats", "Professional groups"],
    outcome: "Leaders leave with sharper clarity on accountability and resilience that they can apply immediately.",
    addons: [],
  },
  {
    type: "Athletic Program",
    title: "Athletic Program Talk",
    purpose: "For sports teams and athletic programs — from a man who lived it.",
    lengths: ["30–45 minutes"],
    focus: ["Mental toughness", "Discipline", "Life beyond sports", "Handling wins, losses, and setbacks"],
    audience: ["Sports teams", "Athletic programs", "Coaches and athletes"],
    outcome: "Teams gain a framework for discipline and resilience on and off the field.",
    addons: ["Live audience Q&A", "Meet & greet", "Book signing", "Small group breakout session", "Photo opportunity"],
  },
];

function SpeakingPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', organization: '', city: '',
    eventType: '', audienceSize: '', dateRange: '', budget: '', message: '',
  });
  const [formState, setFormState] = useState('idle'); // idle | loading | success | error
  const [heroRef, heroVis] = useScrollReveal(0.1);
  const [talksRef, talksVis] = useScrollReveal(0.06);
  const [credRef, credVis] = useScrollReveal(0.1);
  const [formRef, formVis] = useScrollReveal(0.08);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');
    try {
      const res = await fetch('/api/speaking-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.lineBright}`,
    color: C.cream, fontFamily: FONT.body, fontSize: '1rem', padding: '14px 16px',
    outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontFamily: FONT.body, fontSize: '0.72rem', color: C.muted,
    letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8,
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{background:${C.black};overflow-x:hidden}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    a:hover{opacity:0.85}
    ::selection{background:${C.gold};color:${C.black}}
    img{-webkit-user-drag:none}
    .spk-input:focus{border-color:${C.gold}!important}
    select.spk-input option{background:${C.dark2};color:${C.cream}}
    @media(max-width:820px){
      .dnav{display:none!important}
      .mobile-nav-btn{display:block!important}
      .spkhero{flex-direction:column!important}
      .spkgrid{grid-template-columns:1fr!important}
      .spkformrow{flex-direction:column!important}
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <Grain />
      <Nav />

      {/* ── HERO ── */}
      <section style={{ paddingTop: 100, paddingBottom: 80, background: `linear-gradient(180deg, ${C.dark3} 0%, ${C.dark} 100%)`, borderBottom: `1px solid ${C.line}` }}>
        <div ref={heroRef} className="spkhero" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', display: 'flex', gap: 60, alignItems: 'center', opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(30px)', transition: 'all 0.9s ease' }}>
          {/* Image */}
          <div style={{ flexShrink: 0, width: 'clamp(200px,28vw,320px)' }}>
            <img src={IMG.joeJoe} alt="Dr. Joe Profit" style={{ width: '100%', display: 'block', filter: 'drop-shadow(0 8px 40px rgba(0,0,0,0.7))' }} />
          </div>
          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 16 }}>Speaking & Engagements</div>
            <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(2rem,4vw,3.2rem)', color: C.cream, fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>
              A Story That <span style={{ fontStyle: 'italic', color: C.gold }}>Changes</span> How You See Yours
            </h1>
            <blockquote style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: 20, marginBottom: 28 }}>
              <p style={{ fontFamily: FONT.body, fontSize: 'clamp(1rem,1.5vw,1.15rem)', color: C.creamSoft, fontStyle: 'italic', lineHeight: 1.7 }}>
                "Joe delivers real-life perspective on resilience, responsibility, and turning adversity into strength."
              </p>
            </blockquote>
            <p style={{ fontFamily: FONT.body, fontSize: 'clamp(0.95rem,1.2vw,1.05rem)', color: C.muted, lineHeight: 1.8, marginBottom: 32, maxWidth: 560 }}>
              Joe Profit is a former elite athlete, leader, and mentor whose life story is a testament to resilience and responsibility.
              Rising from early hardship that could have shaped a life of bitterness, Joe chose discipline, growth, and purpose instead.
              Through speaking and his book <em style={{ color: C.cream }}>Never Broken</em>, he challenges people of all ages to take ownership of their story and turn adversity into strength.
            </p>
            <a href="#booking-form" style={{ display: 'inline-block', fontFamily: FONT.body, fontSize: '0.8rem', color: C.black, background: C.gold, padding: '16px 36px', textDecoration: 'none', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = C.goldLight}
              onMouseLeave={e => e.currentTarget.style.background = C.gold}>
              Book Joe to Speak
            </a>
          </div>
        </div>
      </section>

      {/* ── TALKS ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: C.dark }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12 }}>What Joe Brings</div>
            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: C.cream, fontWeight: 600, margin: 0 }}>
              Four Ways to <span style={{ fontStyle: 'italic', color: C.gold }}>Engage</span>
            </h2>
          </div>
          <div ref={talksRef} className="spkgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, opacity: talksVis ? 1 : 0, transform: talksVis ? 'none' : 'translateY(24px)', transition: 'all 0.8s ease' }}>
            {TALKS.map(talk => (
              <div key={talk.title}
                style={{ background: C.dark2, border: `1px solid ${C.line}`, padding: 'clamp(24px,3vw,36px)', transition: 'border-color 0.3s', display: 'flex', flexDirection: 'column', gap: 16 }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.goldDim.replace('0.12', '0.4')}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.line}>
                {/* Header */}
                <div>
                  <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.gold, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 8 }}>{talk.type}</div>
                  <h3 style={{ fontFamily: FONT.display, fontSize: 'clamp(1.1rem,1.8vw,1.45rem)', color: C.cream, fontWeight: 600, lineHeight: 1.25, marginBottom: 10 }}>{talk.title}</h3>
                  <p style={{ fontFamily: FONT.body, fontSize: '0.9rem', color: C.muted, lineHeight: 1.65 }}>{talk.purpose}</p>
                </div>
                {/* Length */}
                <div>
                  <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.mutedLight, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Length Options</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {talk.lengths.map(l => (
                      <span key={l} style={{ fontFamily: FONT.body, fontSize: '0.75rem', color: C.cream, background: 'rgba(212,162,78,0.08)', border: `1px solid ${C.goldDim}`, padding: '3px 10px' }}>{l}</span>
                    ))}
                  </div>
                </div>
                {/* Focus */}
                <div>
                  <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.mutedLight, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Focus Areas</div>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {talk.focus.map(f => (
                      <li key={f} style={{ fontFamily: FONT.body, fontSize: '0.85rem', color: C.muted, paddingLeft: 14, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: C.gold, fontSize: '0.6rem', top: 3 }}>◆</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Outcome */}
                <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14, marginTop: 'auto' }}>
                  <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.mutedLight, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Outcome</div>
                  <p style={{ fontFamily: FONT.body, fontSize: '0.85rem', color: C.creamSoft, lineHeight: 1.6 }}>{talk.outcome}</p>
                </div>
                {/* Add-ons */}
                {talk.addons.length > 0 && (
                  <div>
                    <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.mutedLight, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Add-On Options</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {talk.addons.map(a => (
                        <span key={a} style={{ fontFamily: FONT.body, fontSize: '0.7rem', color: C.muted, border: `1px solid ${C.line}`, padding: '2px 8px' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDIBILITY BAR ── */}
      <section style={{ padding: 'clamp(40px,6vw,70px) 0', background: C.dark3, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div ref={credRef} style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', opacity: credVis ? 1 : 0, transform: credVis ? 'none' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
          <p style={{ fontFamily: FONT.body, fontSize: 'clamp(0.85rem,1.2vw,1rem)', color: C.muted, textAlign: 'center', letterSpacing: '0.12em', marginBottom: 36, fontStyle: 'italic' }}>
            Joe Profit has spoken to students, executives, athletes, and world leaders.
          </p>
          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,32px)', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {[
              { src: IMG.reagan, label: 'The White House' },
              { src: IMG.ali, label: 'Muhammad Ali' },
              { src: IMG.falcons, label: 'NFL — Atlanta Falcons' },
              { src: IMG.speaks, label: 'Live Keynote' },
              { src: IMG.ambassador, label: 'Ambassador Andrew Young' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ width: 160, height: 160, overflow: 'hidden', margin: '0 auto 10px', border: `1px solid ${C.lineBright}` }}>
                  <img src={item.src} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
                </div>
                <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING FORM ── */}
      <section id="booking-form" style={{ padding: 'clamp(60px,8vw,100px) 0', background: C.dark }}>
        <div ref={formRef} style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', opacity: formVis ? 1 : 0, transform: formVis ? 'none' : 'translateY(24px)', transition: 'all 0.8s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12 }}>Inquiries</div>
            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: C.cream, fontWeight: 600, marginBottom: 16 }}>
              Book Joe to <span style={{ fontStyle: 'italic', color: C.gold }}>Speak</span>
            </h2>
            <p style={{ fontFamily: FONT.body, fontSize: '0.9rem', color: C.muted, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
              Joe accepts a limited number of engagements each year. All inquiries are reviewed within 48–72 hours.
            </p>
          </div>

          {formState === 'success' ? (
            <div style={{ textAlign: 'center', padding: '60px 40px', border: `1px solid ${C.goldDim}`, background: 'rgba(212,162,78,0.04)' }}>
              <div style={{ fontFamily: FONT.display, fontSize: '2rem', color: C.gold, fontStyle: 'italic', marginBottom: 16 }}>Inquiry Received</div>
              <p style={{ fontFamily: FONT.body, fontSize: '1rem', color: C.muted, lineHeight: 1.7 }}>
                Thank you for reaching out. We'll review your inquiry and be in touch within 48–72 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Row 1: Name + Email */}
              <div className="spkformrow" style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Name <span style={{ color: C.gold }}>*</span></label>
                  <input name="name" value={formData.name} onChange={handleChange} required className="spk-input" style={inputStyle} placeholder="Full name" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Email <span style={{ color: C.gold }}>*</span></label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required className="spk-input" style={inputStyle} placeholder="your@email.com" />
                </div>
              </div>
              {/* Row 2: Phone + Organization */}
              <div className="spkformrow" style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="spk-input" style={inputStyle} placeholder="(optional)" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Organization <span style={{ color: C.gold }}>*</span></label>
                  <input name="organization" value={formData.organization} onChange={handleChange} required className="spk-input" style={inputStyle} placeholder="School, company, org..." />
                </div>
              </div>
              {/* Row 3: City + Event Type */}
              <div className="spkformrow" style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>City / State <span style={{ color: C.gold }}>*</span></label>
                  <input name="city" value={formData.city} onChange={handleChange} required className="spk-input" style={inputStyle} placeholder="City, ST" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Event Type <span style={{ color: C.gold }}>*</span></label>
                  <select name="eventType" value={formData.eventType} onChange={handleChange} required className="spk-input" style={inputStyle}>
                    <option value="">Select type...</option>
                    <option value="School / Youth Assembly">School / Youth Assembly</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Leadership Retreat">Leadership Retreat</option>
                    <option value="Athletic Program">Athletic Program</option>
                    <option value="Conference">Conference</option>
                    <option value="Church / Ministry">Church / Ministry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {/* Row 4: Audience Size + Budget */}
              <div className="spkformrow" style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Estimated Audience Size</label>
                  <select name="audienceSize" value={formData.audienceSize} onChange={handleChange} className="spk-input" style={inputStyle}>
                    <option value="">Select...</option>
                    <option value="Under 50">Under 50</option>
                    <option value="50–200">50–200</option>
                    <option value="200–500">200–500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Budget Range</label>
                  <select name="budget" value={formData.budget} onChange={handleChange} className="spk-input" style={inputStyle}>
                    <option value="">Select...</option>
                    <option value="Under $2,000">Under $2,000</option>
                    <option value="$2,000–$5,000">$2,000–$5,000</option>
                    <option value="$5,000–$10,000">$5,000–$10,000</option>
                    <option value="Open to discuss">Open to discuss</option>
                  </select>
                </div>
              </div>
              {/* Preferred Date */}
              <div>
                <label style={labelStyle}>Preferred Date / Date Range</label>
                <input name="dateRange" value={formData.dateRange} onChange={handleChange} className="spk-input" style={inputStyle} placeholder="e.g. April 2026, Spring semester, flexible..." />
              </div>
              {/* Message */}
              <div>
                <label style={labelStyle}>Additional Details</label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="spk-input" rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tell us about your event, audience, or any specific goals..." />
              </div>
              {/* Submit */}
              {formState === 'error' && (
                <p style={{ fontFamily: FONT.body, fontSize: '0.85rem', color: '#E57373', textAlign: 'center' }}>
                  Something went wrong. Please try again or email <a href="mailto:jprofit23@gmail.com" style={{ color: C.gold }}>jprofit23@gmail.com</a>.
                </p>
              )}
              <button type="submit" disabled={formState === 'loading'}
                style={{ fontFamily: FONT.body, fontSize: '0.8rem', color: C.black, background: formState === 'loading' ? C.muted : C.gold, padding: '18px 40px', border: 'none', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, cursor: formState === 'loading' ? 'not-allowed' : 'pointer', transition: 'background 0.3s', alignSelf: 'flex-start' }}
                onMouseEnter={e => { if (formState !== 'loading') e.currentTarget.style.background = C.goldLight; }}
                onMouseLeave={e => { if (formState !== 'loading') e.currentTarget.style.background = C.gold; }}>
                {formState === 'loading' ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── PRESS KIT ── */}
      <section style={{ padding: 'clamp(40px,5vw,60px) 0', background: C.dark3, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.muted, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12, opacity: 0.6 }}>Media & Event Planners</div>
          <p style={{ fontFamily: FONT.body, fontSize: '0.9rem', color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
            Bios, approved photos, press coverage, and speaker description — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/press" style={{ fontFamily: FONT.body, fontSize: '0.75rem', color: C.gold, border: `1px solid ${C.goldDim}`, padding: '10px 24px', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.goldDim}>
              View Press Kit
            </a>
            <a href="/" style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', padding: '10px 0', opacity: 0.5 }}>← Joe's Story</a>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}

// ─── PRESS PAGE ───
const PRESS_COVERAGE = [
  { src: IMG.wallStreet, label: "Wall Street Journal" },
  { src: IMG.usaToday, label: "USA Today" },
  { src: IMG.essenceArticle, label: "Essence Magazine" },
  { src: IMG.ciiArticle, label: "CII Feature" },
  { src: IMG.noOrdinaryJoe, label: "No Ordinary Joe" },
  { src: IMG.millionaire, label: "Millionaire Profile" },
];

const BIO_SHORT = `Joe Profit is a former elite athlete, leader, and mentor whose life story is a testament to resilience and responsibility. Rising from early hardship that could have shaped a life of bitterness, Joe chose discipline, growth, and purpose instead. Through speaking, mentorship, and his book Never Broken, he challenges people of all ages to take ownership of their story and turn adversity into strength.`;

const BIO_LONG = `Joe Profit's life is proof that circumstances do not dictate destiny.

As a young boy, Joe experienced fear and adversity that could have easily hardened his heart and narrowed his future. Instead, he made a different choice — one that would define his life. He chose discipline over resentment, growth over excuses, and purpose over pain.

That mindset carried him into elite athletics, leadership roles, business success, and a lifelong commitment to mentoring young people and leaders facing their own challenges. Joe's journey is not about escaping hardship. It's about transforming it.

After a career in the NFL with the Atlanta Falcons and New Orleans Saints, Joe built CII — a $100 million multimedia company — and went on to serve in ministry, politics, and community leadership. He has stood alongside presidents, world leaders, and icons from Muhammad Ali to Ambassador Andrew Young.

Through his book Never Broken, his speaking, and his mentorship, Joe teaches a powerful truth: pain is part of life, but staying broken is a decision. His message resonates with students, athletes, professionals, and leaders who want to build character, resilience, and personal accountability in a world that often promotes blame instead of growth.

Joe doesn't offer motivation. He offers perspective that changes how people see their own story.`;

function PressPage() {
  const [bioView, setBioView] = useState('short');
  const [headRef, headVis] = useScrollReveal(0.1);
  const [photoRef, photoVis] = useScrollReveal(0.08);
  const [pressRef, pressVis] = useScrollReveal(0.08);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{background:${C.black};overflow-x:hidden}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    a:hover{opacity:0.85}
    ::selection{background:${C.gold};color:${C.black}}
    img{-webkit-user-drag:none}
    @media(max-width:820px){
      .dnav{display:none!important}
      .mobile-nav-btn{display:block!important}
      .pressgrid{grid-template-columns:1fr!important}
      .presscovgrid{grid-template-columns:repeat(2,1fr)!important}
      .presshero{flex-direction:column!important}
    }
    @media(max-width:480px){
      .pressgrid{grid-template-columns:1fr!important}
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <Grain />
      <Nav />

      {/* ── HEADER ── */}
      <section style={{ paddingTop: 110, paddingBottom: 70, background: `linear-gradient(180deg, ${C.dark3} 0%, ${C.dark} 100%)`, borderBottom: `1px solid ${C.line}` }}>
        <div ref={headRef} style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', opacity: headVis ? 1 : 0, transform: headVis ? 'none' : 'translateY(24px)', transition: 'all 0.8s ease' }}>
          <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 14 }}>Media Resources</div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 'clamp(2rem,4vw,3rem)', color: C.cream, fontWeight: 700, marginBottom: 20 }}>
            Press <span style={{ fontStyle: 'italic', color: C.gold }}>Kit</span>
          </h1>
          <p style={{ fontFamily: FONT.body, fontSize: '1rem', color: C.muted, lineHeight: 1.7, maxWidth: 600, marginBottom: 28 }}>
            For event planners, media contacts, and booking coordinators. All assets below are cleared for editorial and promotional use in connection with Dr. Joe Profit's speaking engagements and book.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:info@joeprofitneverbroken.com" style={{ fontFamily: FONT.body, fontSize: '0.75rem', color: C.black, background: C.gold, padding: '12px 28px', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = C.goldLight}
              onMouseLeave={e => e.currentTarget.style.background = C.gold}>
              Media Inquiries
            </a>
            <a href="/speaking" style={{ fontFamily: FONT.body, fontSize: '0.75rem', color: C.gold, background: 'transparent', padding: '12px 28px', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, border: `1px solid ${C.goldDim}`, transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.goldDim}>
              Book Joe to Speak
            </a>
          </div>
        </div>
      </section>

      {/* ── SPEAKER BIO ── */}
      <section style={{ padding: 'clamp(60px,7vw,90px) 0', background: C.dark }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>
          <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 16 }}>Speaker Bio</div>
          <div className="presshero" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            {/* Photo */}
            <div style={{ flexShrink: 0 }}>
              <img src={IMG.joeJoe} alt="Dr. Joe Profit" style={{ width: 'clamp(140px,18vw,200px)', display: 'block', filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))' }} />
              <p style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.muted, marginTop: 8, textAlign: 'center', opacity: 0.5 }}>Right-click to save</p>
            </div>
            {/* Bio */}
            <div style={{ flex: 1 }}>
              {/* Toggle */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 20, border: `1px solid ${C.line}`, width: 'fit-content' }}>
                {['short', 'long'].map(v => (
                  <button key={v} onClick={() => setBioView(v)}
                    style={{ fontFamily: FONT.body, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 20px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: bioView === v ? C.gold : 'transparent', color: bioView === v ? C.black : C.muted, fontWeight: bioView === v ? 700 : 400 }}>
                    {v === 'short' ? 'Short Bio' : 'Full Bio'}
                  </button>
                ))}
              </div>
              <p style={{ fontFamily: FONT.body, fontSize: '1rem', color: C.creamSoft, lineHeight: 1.85, whiteSpace: 'pre-line', userSelect: 'text' }}>
                {bioView === 'short' ? BIO_SHORT : BIO_LONG}
              </p>
              <p style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.muted, marginTop: 16, opacity: 0.5 }}>Select and copy the text above for your event materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPEAKER QUOTE ── */}
      <section style={{ padding: 'clamp(36px,4vw,52px) 0', background: C.dark3, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.muted, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14, opacity: 0.6 }}>Approved Speaker Description</div>
          <p style={{ fontFamily: FONT.display, fontSize: 'clamp(1rem,1.8vw,1.3rem)', color: C.cream, fontStyle: 'italic', lineHeight: 1.65, userSelect: 'text' }}>
            "Joe delivers real-life perspective on resilience, responsibility, and turning adversity into strength."
          </p>
        </div>
      </section>

      {/* ── AVAILABLE PHOTOS ── */}
      <section style={{ padding: 'clamp(60px,7vw,90px) 0', background: C.dark }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>
          <div ref={photoRef} style={{ opacity: photoVis ? 1 : 0, transform: photoVis ? 'none' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 8 }}>Photo Assets</div>
                <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: C.cream, fontWeight: 600 }}>Available Images</h2>
              </div>
              <p style={{ fontFamily: FONT.body, fontSize: '0.78rem', color: C.muted, maxWidth: 320, lineHeight: 1.6 }}>
                Right-click any image to save. Professional headshot and stage photography coming soon.
              </p>
            </div>
            {/* Pending notice */}
            <div style={{ background: 'rgba(212,162,78,0.05)', border: `1px solid ${C.goldDim}`, padding: '14px 20px', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: C.gold, fontSize: '0.9rem' }}>◆</span>
              <p style={{ fontFamily: FONT.body, fontSize: '0.82rem', color: C.muted, lineHeight: 1.6 }}>
                <span style={{ color: C.cream, fontWeight: 600 }}>Professional headshot and speaking-stage photography are in production.</span>{' '}
                For high-resolution assets or custom needs, email <a href="mailto:info@joeprofitneverbroken.com" style={{ color: C.gold, textDecoration: 'none' }}>info@joeprofitneverbroken.com</a>.
              </p>
            </div>
            <div className="pressgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {[
                { src: IMG.reagan, label: 'With President Reagan', featured: true },
                { src: IMG.ali, label: 'With Muhammad Ali', featured: true },
                { src: IMG.joeJoe, label: 'Portrait — Suited' },
                { src: IMG.speaks, label: 'Live Keynote' },
                { src: IMG.book, label: 'Never Broken — Book' },
                { src: IMG.reverend, label: 'Reverend Joe Profit' },
              ].map(item => (
                <div key={item.label} style={{ cursor: 'context-menu' }}>
                  <div style={{ overflow: 'hidden', border: `1px solid ${item.featured ? C.goldDim : C.line}`, transition: 'border-color 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                    onMouseLeave={e => e.currentTarget.style.borderColor = item.featured ? C.goldDim : C.line}>
                    <img src={item.src} alt={item.label} style={{ width: '100%', height: item.featured ? 360 : 300, objectFit: 'cover', display: 'block', transition: 'transform 0.4s', filter: 'brightness(0.92)' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                  <p style={{ fontFamily: FONT.body, fontSize: '0.78rem', color: item.featured ? C.cream : C.muted, marginTop: 9, letterSpacing: '0.08em' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRESS COVERAGE ── */}
      <section style={{ padding: 'clamp(60px,7vw,90px) 0', background: C.dark3, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>
          <div ref={pressRef} style={{ opacity: pressVis ? 1 : 0, transform: pressVis ? 'none' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
            <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 10 }}>Media Coverage</div>
            <h2 style={{ fontFamily: FONT.display, fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: C.cream, fontWeight: 600, marginBottom: 32 }}>As Seen In</h2>
            <div className="presscovgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {PRESS_COVERAGE.map(item => (
                <div key={item.label} style={{ border: `1px solid ${C.line}`, overflow: 'hidden', transition: 'border-color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.goldDim.replace('0.12','0.35')}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.line}>
                  <img src={item.src} alt={item.label} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block', filter: 'grayscale(30%) brightness(0.85)' }} />
                  <div style={{ padding: '8px 12px', fontFamily: FONT.body, fontSize: '0.68rem', color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAST FACTS ── */}
      <section style={{ padding: 'clamp(50px,6vw,80px) 0', background: C.dark, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>
          <div style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 28 }}>At a Glance</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { stat: 'NFL Career', detail: 'Atlanta Falcons + New Orleans Saints, 1971–' },
              { stat: '$100M', detail: 'CII Multimedia Company — founded and led' },
              { stat: 'Never Broken', detail: 'Author — available in hardcover and paperback' },
              { stat: 'YUP Foundation', detail: 'Youth United for Prosperity — founder' },
              { stat: '4 Talks', detail: 'Keynote, Youth, Leadership, Athletic Program' },
              { stat: '30–60 min', detail: 'Flexible formats, add-ons available' },
            ].map(item => (
              <div key={item.stat} style={{ borderLeft: `2px solid ${C.goldDim}`, paddingLeft: 16 }}>
                <div style={{ fontFamily: FONT.display, fontSize: '1.1rem', color: C.gold, fontWeight: 700, marginBottom: 4 }}>{item.stat}</div>
                <div style={{ fontFamily: FONT.body, fontSize: '0.82rem', color: C.muted, lineHeight: 1.55 }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section style={{ padding: 'clamp(40px,5vw,60px) 0', background: C.dark3, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: FONT.body, fontSize: '0.65rem', color: C.muted, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8, opacity: 0.6 }}>Media Contact</div>
            <p style={{ fontFamily: FONT.body, fontSize: '0.95rem', color: C.cream, marginBottom: 4 }}>info@joeprofitneverbroken.com</p>
            <p style={{ fontFamily: FONT.body, fontSize: '0.82rem', color: C.muted }}>For interviews, additional assets, and booking inquiries.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/speaking#booking-form" style={{ fontFamily: FONT.body, fontSize: '0.75rem', color: C.black, background: C.gold, padding: '12px 28px', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>Book Joe</a>
            <a href="/" style={{ fontFamily: FONT.body, fontSize: '0.72rem', color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', padding: '12px 0', opacity: 0.5 }}>← Joe's Story</a>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}

// ─── APP ───
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/audiobook" element={<AudiobookPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/speaking" element={<SpeakingPage />} />
        <Route path="/press" element={<PressPage />} />
      </Routes>
    </BrowserRouter>
  );
}
