/* ==========================================================================
   NUROGRAPHY — মূল সেটিংস ফাইল
   এই ফাইল এডিট করলেই নাম, দাম, প্রোডাক্ট, পেমেন্ট তথ্য সব বদলে যাবে।
   (শুধু "" বা '' এর ভেতরের লেখা বদলান, কমা ও কোটেশন চিহ্ন মুছবেন না)
   ========================================================================== */
window.NG = {

  /* ---------- ১. ব্র্যান্ড পরিচয় ---------- */
  name: "Nurography",
  tagline: "কপিরাইট-মুক্ত রিলস বান্ডেল ও দক্ষতা শেখার অনলাইন কোর্স",
  address: "মিরপুর-১২, ঢাকা, বাংলাদেশ",

  /* হোমপেজের উপরে ছোট নোটিশ বার (ফাঁকা রাখলে দেখাবে না) — সরাসরি এখানে লিখে GitHub-এ কমিট করলেই বদলে যাবে */
  announcement: "",

  /* ---------- ২. যোগাযোগ ---------- */
  whatsapp: "01577-789212",
  whatsappIntl: "8801577789212",
  facebook: "https://www.facebook.com/Nurography",
  instagram: "https://www.instagram.com/nurographyofficial/",

  /* ---------- ৩. Google Sheet সংযোগ ----------
     Apps Script ডিপ্লয় করে যে "https://script.google.com/macros/s/AKfycbxxZn9sYUaiZZAoYVJdvEOc55dRQPRCKx8pJpgRa-IyyrkGVdKZSUgTZKfuHMppBycp/exec" পাবেন সেটা নিচে বসান।
     বিস্তারিত: setup-guide ফোল্ডারের SETUP-GUIDE.html দেখুন */
  sheetEndpoint: "https://script.google.com/macros/s/AKfycbxxZn9sYUaiZZAoYVJdvEOc55dRQPRCKx8pJpgRa-IyyrkGVdKZSUgTZKfuHMppBycp/exec",

  /* ওয়েবসাইটের পূর্ণ ঠিকানা, হোস্ট করার পর বসান (অর্ডার লিংক/শেয়ারের জন্য) */
  siteUrl: "https://nurography.github.io/",

  /* 🧪 ডেমো মোড: sheetEndpoint ফাঁকা থাকলে ব্রাউজারেই ডেমো ডাটা দিয়ে সব চলবে।
     অ্যাডমিন: admin / Demo@1234 — ডেমো কাস্টমার: 01711000001 / demo1234 */
  /* 🧪 ডেমো মোড: sheetEndpoint ফাঁকা থাকলে ব্রাউজারেই ডেমো অর্ডার দিয়ে চেকআউট/ট্র্যাকিং টেস্ট করা যায়।
     সত্যিকার সিস্টেমে কোনো লগইন/অ্যাডমিন প্যানেল নেই — Google Sheet-এ গিয়ে হাতে Status বদলাতে হয় (SETUP-GUIDE.html দেখুন)। */
  demoMode: false,

  /* ---------- ৪. পেমেন্ট পদ্ধতি ----------
     প্রতিটির qr ঐচ্ছিক (resources/images/ এ ছবি রেখে পথ দিন)। note এ নির্দেশনা লিখুন।
     ⚠️ অ্যাডমিন প্যানেলের "সেটিংস" থেকেও এই তথ্য বদলানো যায় (এখানে বদলালে ওটাই প্রথমবার দেখাবে)। */
  paymentMethods: [
    { id: "bkash", label: "bKash", type: "নম্বরে Send Money", number: "01577-789212", note: "Personal নম্বরে Send Money করুন, তারপর যে Transaction ID (TrxID) পাবেন সেটা নিচে বসান।" },
    { id: "nagad", label: "Nagad", type: "নম্বরে Send Money", number: "01577-789212", note: "Personal নম্বরে Send Money করুন, TrxID বসান।" },
    { id: "bank", label: "Bank Transfer (BRAC Bank)", type: "ব্যাংক অ্যাকাউন্ট", number: "আপনার BRAC Bank A/C নম্বর বসান", note: "A/C Name: Nurography (নিজের নাম দিন) • ট্রান্সফারের পর রেফারেন্স/স্লিপ নম্বর বসান।" },
    { id: "binance", label: "Binance Pay (USDT)", type: "Binance ID", number: "আপনার Binance Pay ID বসান", note: "Binance অ্যাপ থেকে Pay > Binance ID দিয়ে পাঠান, Transaction ID বসান।" },
    { id: "redotpay", label: "RedotPay Card (USDT/USD)", type: "ওয়ালেট অ্যাড্রেস", number: "আপনার RedotPay/USDT (TRC20) অ্যাড্রেস বসান", note: "শুধু USDT (TRC20) পাঠান, ভুল নেটওয়ার্কে পাঠালে টাকা ফেরত পাওয়া যায় না। পাঠানোর পর Transaction Hash বসান." }
  ],

  /* ---------- ৫. ক্যাটাগরি ---------- */
  categories: [
    { id: "reels", label: "Reels Bundle", icon: "film" },
    { id: "course", label: "Online Course", icon: "book" }
  ],

  /* ---------- ৬. প্রোডাক্ট ----------
     ⚠️ price/oldPrice নমুনা মূল্য — আপনার আসল দাম বসান।
     type: "reels" | "course"
     (⚠️ অ্যাক্সেস লিংক এখন এখানে নেই — Google Sheet-এর CourseLinks/ReelLinks ট্যাবে এই id অনুযায়ী লিংক বসাতে হবে, SETUP-GUIDE.html দেখুন)
     badge ও oldPrice ঐচ্ছিক। active:false করলে সাইটে লুকানো থাকবে। */
  products: [
    // ---- Reels Bundle ----
    { id: "r-animal", type: "reels", cat: "funny", icon: "🐾", title: "Funny Animal Reels Bundle", desc: "মজার প্রাণীর ভিডিও ক্লিপ দিয়ে সাজানো কপিরাইট-মুক্ত রিলস বান্ডেল।", price: 299, oldPrice: 399, badge: "জনপ্রিয়", active: true },
    { id: "r-attitude", type: "reels", cat: "lifestyle", icon: "🔥", title: "Attitude Reels Bundle", desc: "ট্রেন্ডি অ্যাটিটিউড ক্লিপ, পেজ/প্রোফাইল এনগেজমেন্ট বাড়াতে উপযোগী।", price: 249, oldPrice: "", badge: "", active: true },
    { id: "r-freefire", type: "reels", cat: "gaming", icon: "🎮", title: "Free Fire Gaming Reels Bundle", desc: "ফ্রি ফায়ার গেমপ্লে হাইলাইট রিলস, গেমিং পেজের জন্য আদর্শ।", price: 299, oldPrice: "", badge: "", active: true },
    { id: "r-minecraft", type: "reels", cat: "gaming", icon: "⛏️", title: "Minecraft Gaming Reels Bundle", desc: "মাইনক্রাফট গেমপ্লে ও বিল্ডিং হাইলাইট রিলস।", price: 299, oldPrice: "", badge: "", active: true },
    { id: "r-food", type: "reels", cat: "food", icon: "🍲", title: "Food & Vlogging Reels Bundle", desc: "ফুড ভ্লগিং স্টাইলের কপিরাইট-মুক্ত শর্ট ক্লিপ।", price: 249, oldPrice: "", badge: "", active: true },
    { id: "r-scientist", type: "reels", cat: "edu", icon: "🧪", title: "Mad Scientist Reels Bundle", desc: "মজার সায়েন্স এক্সপেরিমেন্ট স্টাইলের রিলস ক্লিপ।", price: 249, oldPrice: "", badge: "", active: true },
    { id: "r-drawing", type: "reels", cat: "art", icon: "🎨", title: "Drawing & Art Reels Bundle", desc: "আর্ট ও ড্রয়িং প্রসেস দেখানো স্যাটিসফাইং রিলস ক্লিপ।", price: 249, oldPrice: "", badge: "", active: true },
    { id: "r-shayari", type: "reels", cat: "quotes", icon: "✍️", title: "Shayari & Quotes Reels Bundle", desc: "বাংলা শায়েরি ও উক্তি ভিত্তিক ব্যাকগ্রাউন্ড রিলস ক্লিপ।", price: 199, oldPrice: "", badge: "", active: true },

    // ---- Online Course: Design ----
    { id: "c-graphic", type: "course", cat: "design", icon: "🎨", title: "Graphic Design Mastery (A to Z)", desc: "বেসিক থেকে অ্যাডভান্স গ্রাফিক ডিজাইন, ফ্রিল্যান্সিংয়ের জন্য প্রস্তুতি।", price: 699, oldPrice: 999, badge: "জনপ্রিয়", active: true },
    { id: "c-animation", type: "course", cat: "design", icon: "🎬", title: "Mobile 2D Animation & Cartoon", desc: "মোবাইল দিয়ে কার্টুন ও 2D অ্যানিমেশন বানানো শিখুন।", price: 599, oldPrice: "", badge: "", active: true },
    { id: "c-tshirt", type: "course", cat: "design", icon: "👕", title: "T-Shirt Design & Freelancing", desc: "টি-শার্ট ডিজাইন, মকআপ ও মার্কেটপ্লেসে বিক্রি শুরুর গাইড।", price: 499, oldPrice: "", badge: "", active: true },
    { id: "c-video-pro", type: "course", cat: "design", icon: "🎞️", title: "Professional Video Editing", desc: "প্রফেশনাল লেভেলের ভিডিও এডিটিং কৌশল।", price: 599, oldPrice: "", badge: "", active: true },
    { id: "c-video-mobile", type: "course", cat: "design", icon: "📱", title: "Mobile Video Editing for Beginners", desc: "মোবাইল দিয়ে ভিডিও এডিটিং শুরু করার সহজ কোর্স।", price: 399, oldPrice: "", badge: "", active: true },
    { id: "c-webdesign", type: "course", cat: "design", icon: "🖥️", title: "Web Design Fundamentals", desc: "ওয়েবসাইট ডিজাইনের বেসিক ধারণা ও প্র্যাকটিক্যাল কাজ।", price: 599, oldPrice: "", badge: "", active: true },

    // ---- Marketing ----
    { id: "c-fb", type: "course", cat: "marketing", icon: "📘", title: "Facebook Marketing & Page Monetization", desc: "ফেসবুক মার্কেটিং, পেজ গ্রোথ ও মনিটাইজেশন কৌশল।", price: 599, oldPrice: "", badge: "জনপ্রিয়", active: true },
    { id: "c-insta", type: "course", cat: "marketing", icon: "📷", title: "Instagram Marketing Masterclass", desc: "ইনস্টাগ্রাম গ্রোথ, রিলস স্ট্র্যাটেজি ও মার্কেটিং।", price: 499, oldPrice: "", badge: "", active: true },
    { id: "c-linkedin", type: "course", cat: "marketing", icon: "💼", title: "LinkedIn Marketing", desc: "প্রফেশনাল নেটওয়ার্কিং ও লিংকডইন মার্কেটিং কৌশল।", price: 399, oldPrice: "", badge: "", active: true },
    { id: "c-yt", type: "course", cat: "marketing", icon: "▶️", title: "YouTube Optimization & Shorts Viral Method", desc: "ইউটিউব SEO, অপ্টিমাইজেশন ও শর্টস ভাইরাল করার কৌশল।", price: 499, oldPrice: "", badge: "", active: true },
    { id: "c-digital", type: "course", cat: "marketing", icon: "📈", title: "Digital Marketing & SEO", desc: "ডিজিটাল মার্কেটিং এর বেসিক থেকে SEO পর্যন্ত সম্পূর্ণ গাইড।", price: 699, oldPrice: "", badge: "", active: true },
    { id: "c-copy", type: "course", cat: "marketing", icon: "✍️", title: "Copywriting Masterclass", desc: "বিক্রি বাড়ানোর মতো আকর্ষণীয় কপি লেখা শিখুন।", price: 499, oldPrice: "", badge: "", active: true },
    { id: "c-thumb", type: "course", cat: "marketing", icon: "🖼️", title: "Sell YouTube Thumbnails — Side Income", desc: "থাম্বনেইল ডিজাইন করে ফ্রিল্যান্স ইনকামের উপায়।", price: 299, oldPrice: "", badge: "", active: true },

    // ---- Tech / Dev ----
    { id: "c-js", type: "course", cat: "dev", icon: "💻", title: "JavaScript Full Course (Bangla)", desc: "বাংলায় সম্পূর্ণ জাভাস্ক্রিপ্ট প্রোগ্রামিং কোর্স।", price: 699, oldPrice: "", badge: "", active: true },
    { id: "c-app", type: "course", cat: "dev", icon: "📱", title: "Android & iOS App Development", desc: "মোবাইল অ্যাপ ডেভেলপমেন্ট শুরু থেকে শেখার কোর্স।", price: 799, oldPrice: "", badge: "", active: true },
    { id: "c-excel", type: "course", cat: "dev", icon: "📊", title: "Full Microsoft Excel Course", desc: "এক্সেলের বেসিক থেকে অ্যাডভান্স ফাংশন পর্যন্ত সম্পূর্ণ কোর্স।", price: 399, oldPrice: "", badge: "", active: true },
    { id: "c-office", type: "course", cat: "dev", icon: "📄", title: "Microsoft Office Full Course", desc: "Word, Excel, PowerPoint ব্যবহারের সম্পূর্ণ প্রশিক্ষণ।", price: 399, oldPrice: "", badge: "", active: true },
    { id: "c-blogger", type: "course", cat: "dev", icon: "📝", title: "Blogger Website Templates (Ready-to-Use)", desc: "রেডি ব্লগার টেমপ্লেট দিয়ে নিজের ওয়েবসাইট দাঁড় করানো।", price: 299, oldPrice: "", badge: "", active: true },

    // ---- Business / Freelancing ----
    { id: "c-freelance", type: "course", cat: "business", icon: "🌐", title: "Freelancing A to Z (Upwork & Fiverr)", desc: "আপওয়ার্ক ও ফাইভার-এ প্রোফাইল তৈরি থেকে প্রথম কাজ পাওয়া পর্যন্ত গাইড।", price: 699, oldPrice: "", badge: "জনপ্রিয়", active: true },
    { id: "c-dropship", type: "course", cat: "business", icon: "📦", title: "Dropshipping Basics — The Beginning", desc: "ড্রপশিপিং বিজনেস মডেল ও শুরু করার ধাপ।", price: 599, oldPrice: "", badge: "", active: true },
    { id: "c-zero", type: "course", cat: "business", icon: "🚀", title: "শূন্য টাকায় ব্যবসা শুরু করুন", desc: "কম পুঁজিতে অনলাইন ব্যবসা শুরুর বাস্তবসম্মত গাইড।", price: 399, oldPrice: "", badge: "", active: true },
    { id: "c-finance", type: "course", cat: "business", icon: "💰", title: "Personal Finance", desc: "ব্যক্তিগত অর্থ ব্যবস্থাপনা ও সঞ্চয়ের মূল নীতি।", price: 299, oldPrice: "", badge: "", active: true },
    { id: "c-trading", type: "course", cat: "business", icon: "📉", title: "Trading & Market Fundamentals (Bangla)", desc: "ট্রেডিং মার্কেটের মূল ধারণা ও ঝুঁকি ব্যবস্থাপনা। (এটি বিনিয়োগ পরামর্শ নয়, শিক্ষামূলক কোর্স মাত্র — ঝুঁকি নিজ দায়িত্বে)", price: 599, oldPrice: "", badge: "", active: true },
    { id: "c-cyber", type: "course", cat: "business", icon: "🛡️", title: "Cybersecurity Certification Prep (Defensive Track)", desc: "সাইবার সিকিউরিটি সার্টিফিকেশন প্রস্তুতির জন্য ডিফেন্সিভ সিকিউরিটি ধারণা।", price: 799, oldPrice: "", badge: "", active: true },
    { id: "c-dataentry", type: "course", cat: "business", icon: "⌨️", title: "Data Entry Basics for Freelancing", desc: "ডাটা এন্ট্রি স্কিল শিখে ফ্রিল্যান্সিং শুরুর গাইড।", price: 299, oldPrice: "", badge: "", active: true },

    // ---- Academic ----
    { id: "c-ielts", type: "course", cat: "academic", icon: "🗣️", title: "English & IELTS Speaking Prep", desc: "ইংরেজি দক্ষতা ও IELTS স্পিকিং-এর জন্য সম্পূর্ণ প্রস্তুতি।", price: 499, oldPrice: "", badge: "", active: true },
    { id: "c-bcs", type: "course", cat: "academic", icon: "📚", title: "BCS Preliminary Prep", desc: "বিসিএস প্রিলিমিনারি পরীক্ষার জন্য গোছানো প্রস্তুতি উপকরণ।", price: 599, oldPrice: "", badge: "", active: true },
    { id: "c-medical", type: "course", cat: "academic", icon: "🩺", title: "Medical Admission Prep", desc: "মেডিকেল ভর্তি পরীক্ষার প্রস্তুতি উপকরণ।", price: 599, oldPrice: "", badge: "", active: true },
    { id: "c-engg", type: "course", cat: "academic", icon: "⚙️", title: "Engineering Admission & Physics Prep", desc: "ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা ও ফিজিক্সের প্রস্তুতি উপকরণ।", price: 599, oldPrice: "", badge: "", active: true },
    { id: "c-hsc", type: "course", cat: "academic", icon: "🧮", title: "HSC Commerce — Accounting", desc: "এইচএসসি কমার্স বিভাগের হিসাববিজ্ঞান প্রস্তুতি।", price: 399, oldPrice: "", badge: "", active: true },
    { id: "c-quran", type: "course", cat: "academic", icon: "🕌", title: "Quran Learning Course", desc: "সহজ পদ্ধতিতে কুরআন শেখার কোর্স।", price: 299, oldPrice: "", badge: "", active: true },
    { id: "c-electrician", type: "course", cat: "academic", icon: "🔌", title: "Electrician Basics Course", desc: "ইলেকট্রিশিয়ান কাজের বেসিক দক্ষতা ও নিরাপত্তা।", price: 399, oldPrice: "", badge: "", active: true },
    { id: "c-news", type: "course", cat: "academic", icon: "🎙️", title: "News Presentation & Public Speaking", desc: "আত্মবিশ্বাসী উপস্থাপনা ও পাবলিক স্পিকিং দক্ষতা।", price: 299, oldPrice: "", badge: "", active: true }
  ],

  /* ---------- ৭. FAQ ---------- */
  faqs: [
    { q: "পেমেন্ট করার পর কতক্ষণে অ্যাক্সেস পাব?", a: "পেমেন্ট জমা দেওয়ার পর আমরা Transaction ID যাচাই করে অর্ডার অনুমোদন করি, সাধারণত কিছু সময়ের মধ্যেই। অনুমোদন হলে আপনার অ্যাকাউন্টে কোর্স/বান্ডেলের লিংক চলে আসবে এবং WhatsApp-এও জানানো হয়।" },
    { q: "একসাথে রিলস বান্ডেল ও কোর্স দুটোই কিনতে পারব?", a: "হ্যাঁ। কার্টে দুই ধরনের প্রোডাক্টই একসাথে যোগ করে এক অর্ডারে চেকআউট করতে পারবেন। অনুমোদনের পর দুটোর অ্যাক্সেসই একসাথে আপনার ড্যাশবোর্ডে দেখা যাবে।" },
    { q: "আন্তর্জাতিক পেমেন্ট করা যাবে?", a: "হ্যাঁ, bKash/Nagad ছাড়াও Binance Pay (USDT), RedotPay কার্ড এবং ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট নেওয়া হয়।" },
    { q: "কনটেন্ট কোথায় পাব?", a: "অনুমোদনের পর আপনার অ্যাকাউন্টের \"আমার কেনাকাটা\" পেজে Google Drive/TeraBox লিংক পাবেন, সেখান থেকে ডাউনলোড বা দেখতে পারবেন।" },
    { q: "রিফান্ড নীতি কী?", a: "ডিজিটাল প্রোডাক্ট হওয়ায় অ্যাক্সেস দেওয়ার পর রিফান্ড দেওয়া সম্ভব নয়। ভুল পেমেন্ট বা সমস্যা হলে WhatsApp-এ যোগাযোগ করুন, আমরা সমাধান করব।" }
  ]
};
