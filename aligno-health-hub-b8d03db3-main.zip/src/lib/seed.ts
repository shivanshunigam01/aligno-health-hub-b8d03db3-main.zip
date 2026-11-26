import { ASSETS } from "./assets";
import type {
  Activity,
  Banner,
  Blog,
  BodyPart,
  CMSContent,
  Category,
  ContactInfo,
  Customer,
  FooterContent,
  Lead,
  Order,
  PainArea,
  PolicyPage,
  Poster,
  Product,
  Review,
  TrustStripItem,
} from "./types";

const P = ASSETS.products;
const B = ASSETS.body;
const H = ASSETS.hero;
const L = ASSETS.lifestyle;

export const seedCategories: Category[] = [
  { id: "c1", name: "Orthopedic Supports", slug: "orthopedic-supports", subtitle: "Braces, belts & splints", image: B.knee, order: 1, enabled: true },
  { id: "c2", name: "Medical Disposables", slug: "medical-disposables", subtitle: "Masks, gloves, gowns", image: P.nasal, order: 2, enabled: false },
  { id: "c3", name: "Personal Care", slug: "personal-care", subtitle: "Daily care essentials", image: P.posture, order: 3, enabled: false },
  { id: "c4", name: "Hygiene Products", slug: "hygiene-products", subtitle: "Clean & safe", image: P.nasal, order: 4, enabled: false },
  { id: "c5", name: "Pain Relief Products", slug: "pain-relief-products", subtitle: "Targeted relief", image: B.back, order: 5, enabled: false },
  { id: "c6", name: "Daily Support Products", slug: "daily-support-products", subtitle: "Support every day", image: P.wfh, order: 6, enabled: false },
];

export const seedBodyParts: BodyPart[] = [
  { id: "b1", name: "Knee", slug: "knee", image: B.knee, marker: { x: 50, y: 70 }, enabled: true },
  { id: "b2", name: "Back", slug: "back", image: B.back, marker: { x: 50, y: 40 }, enabled: true },
  { id: "b3", name: "Neck", slug: "neck", image: B.neck, marker: { x: 50, y: 15 }, enabled: true },
  { id: "b4", name: "Shoulder", slug: "shoulder", image: B.shoulder, marker: { x: 35, y: 22 }, enabled: true },
  { id: "b5", name: "Wrist", slug: "wrist", image: B.wrist, marker: { x: 25, y: 50 }, enabled: true },
  { id: "b6", name: "Hand", slug: "hand", image: B.hand, marker: { x: 22, y: 55 }, enabled: true },
  { id: "b7", name: "Foot", slug: "foot", image: B.foot, marker: { x: 45, y: 92 }, enabled: true },
  { id: "b8", name: "Calf", slug: "calf", image: B.calf, marker: { x: 48, y: 82 }, enabled: true },
  { id: "b9", name: "Chest", slug: "chest", image: B.chest, marker: { x: 50, y: 30 }, enabled: true },
  { id: "b10", name: "Face", slug: "face", image: B.face, marker: { x: 50, y: 8 }, enabled: true },
];

export const seedPainAreas: PainArea[] = [
  { id: "p1", name: "Neck Pain", slug: "neck", image: B.neck, marker: { x: 50, y: 15 }, enabled: true },
  { id: "p2", name: "Shoulder Pain", slug: "shoulder", image: B.shoulder, marker: { x: 35, y: 22 }, enabled: true },
  { id: "p3", name: "Back Pain", slug: "back", image: B.back, marker: { x: 50, y: 40 }, enabled: true },
  { id: "p4", name: "Elbow Pain", slug: "elbow", image: B.hand, marker: { x: 28, y: 42 }, enabled: true },
  { id: "p5", name: "Wrist Pain", slug: "wrist", image: B.wrist, marker: { x: 25, y: 50 }, enabled: true },
  { id: "p6", name: "Hand Pain", slug: "hand", image: B.hand, marker: { x: 22, y: 55 }, enabled: true },
  { id: "p7", name: "Knee Pain", slug: "knee", image: B.knee, marker: { x: 50, y: 70 }, enabled: true },
  { id: "p8", name: "Calf Pain", slug: "calf", image: B.calf, marker: { x: 48, y: 82 }, enabled: true },
  { id: "p9", name: "Ankle Pain", slug: "ankle", image: B.ankle, marker: { x: 47, y: 88 }, enabled: true },
  { id: "p10", name: "Foot Pain", slug: "foot", image: B.foot, marker: { x: 45, y: 92 }, enabled: true },
];

export const seedActivities: Activity[] = [
  { id: "a1", name: "Athletics", slug: "athletics", image: L.running, enabled: true },
  { id: "a2", name: "Badminton", slug: "badminton", image: B.shoulder, enabled: true },
  { id: "a3", name: "Basketball", slug: "basketball", image: L.running, enabled: true },
  { id: "a4", name: "Cricket", slug: "cricket", image: L.active, enabled: true },
  { id: "a5", name: "Yoga", slug: "yoga", image: L.yoga, enabled: true },
  { id: "a6", name: "Gym", slug: "gym", image: B.knee, enabled: true },
  { id: "a7", name: "Running", slug: "running", image: L.running, enabled: true },
  { id: "a8", name: "Walking", slug: "walking", image: L.walking, enabled: true },
  { id: "a9", name: "Travel", slug: "travel", image: L.travel, enabled: true },
  { id: "a10", name: "Office", slug: "office", image: L.office, enabled: true },
];

const galleryFor = (pack: string, bodyPart?: string, painArea?: string): string[] => {
  const painKey = painArea?.replace(/-pain$/, "");
  const body =
    (bodyPart && (B as Record<string, string>)[bodyPart]) ||
    (painKey && (B as Record<string, string>)[painKey]);
  const views = [pack, body || pack, L.running].filter(Boolean);
  const unique = [...new Set(views)];
  while (unique.length < 3) unique.push(pack);
  return unique.slice(0, 3);
};

const mkProduct = (
  i: number,
  name: string,
  category: string,
  image: string,
  bodyPart?: string,
  painArea?: string,
  activity?: string[],
): Product => ({
  id: `prod-${i}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  category,
  bodyPart,
  painArea,
  activity,
  price: 100,
  discountPrice: 100,
  sku: `AL-${String(i).padStart(4, "0")}`,
  stock: 25 + (i % 50),
  images: galleryFor(image, bodyPart, painArea),
  rating: 4 + (i % 10) / 10,
  reviewCount: 50 + i * 7,
  sizes: ["S", "M", "L", "XL"],
  shortDescription: `${name} — premium medical-grade support engineered for daily comfort and active recovery.`,
  longDescription: `Aligno ${name} is built with high-density orthopedic foam, breathable medical-grade fabric and ergonomic contouring. Designed by physiotherapists for everyday comfort, injury recovery, sports performance and posture correction. Soft to the touch yet firm where it matters, this product gives you confidence in every movement.`,
  benefits: [
    "Medical-grade premium materials",
    "Ergonomic anatomical contouring",
    "Breathable, skin-friendly fabric",
    "Adjustable straps for perfect fit",
    "Long-lasting durable construction",
  ],
  specifications: {
    Material: "Neoprene / Spandex blend",
    Color: "Black / Grey",
    Sizes: "S, M, L, XL",
    Care: "Hand wash with mild soap",
    Warranty: "30 days replacement",
  },
  careInstructions: ["Hand wash in cold water", "Do not bleach", "Air dry only", "Do not iron"],
  faqs: [
    { q: "Is this product machine washable?", a: "We recommend gentle hand washing for longest life." },
    { q: "Can I wear it all day?", a: "Yes, the breathable fabric is designed for extended wear." },
    { q: "What's the return policy?", a: "30-day easy returns on unused items." },
  ],
  bestSeller: i % 3 === 0,
  featured: i % 4 === 0,
  newArrival: i < 6,
  enabled: true,
});

const orth = "orthopedic-supports";

export const seedProducts: Product[] = [
  mkProduct(1, "Abdominal Support", orth, B.back, "chest", "back"),
  mkProduct(2, "Ankle Support", orth, B.ankle, "foot", "ankle", ["running", "walking"]),
  mkProduct(3, "Cervical Collar", orth, B.neck, "neck", "neck"),
  mkProduct(4, "Contoured LS Support Belt", orth, B.back, "back", "back", ["office"]),
  mkProduct(5, "Elbow Support", orth, B.wrist, "hand", "elbow", ["badminton"]),
  mkProduct(6, "Functional Knee Support", orth, B.knee, "knee", "knee", ["athletics", "gym"]),
  mkProduct(7, "Knee Support", orth, B.knee, "knee", "knee", ["running", "cricket"]),
  mkProduct(8, "LS Belt Eco", orth, B.back, "back", "back", ["office"]),
  mkProduct(9, "Lumbar Sacral Support Belt", orth, B.back, "back", "back", ["office"]),
  mkProduct(10, "Pouch Arm Sling", orth, B.shoulder, "shoulder", "shoulder"),
  mkProduct(11, "Tennis Elbow Support", orth, B.wrist, "hand", "elbow", ["badminton", "cricket"]),
  mkProduct(12, "Wrist Wrap", orth, B.wrist, "wrist", "wrist", ["gym"]),
  mkProduct(13, "Wrist Wrap with Thumb", orth, B.wrist, "wrist", "wrist", ["gym", "running"]),
];

export const seedBanners: Banner[] = [
  { id: "ban1", title: "MOVE FREELY. LIVE COMFORTABLY.", subtitle: "Premium orthopedic wellness and support products", offer: "", ctaText: "Shop Collection", ctaLink: "/shop", image: H.moveFreely, order: 1, enabled: true, layout: "designed" },
  { id: "ban2", title: "BETTER POSTURE. BETTER PERFORMANCE.", subtitle: "Ergonomic comfort for IT & corporate professionals", offer: "", ctaText: "Shop Now", ctaLink: "/shop", image: H.posture, order: 2, enabled: true, layout: "designed" },
  { id: "ban3", title: "ADVENTURE STARTS HERE.", subtitle: "Support that moves with you — from trails to everyday life", offer: "", ctaText: "Shop Now", ctaLink: "/shop", image: H.activeLiving, order: 3, enabled: true, layout: "designed" },
  { id: "ban4", title: "LIVE ALIGNED. MOVE CONFIDENTLY.", subtitle: "Premium belts, cushions, and supports for everyday wellness", offer: "", ctaText: "Shop Collection", ctaLink: "/shop", image: "", order: 4, enabled: true, layout: "designed" },
];

export const seedPosters: Poster[] = [
  { id: "pos1", title: "STAY COOL STAY FOCUSED", ctaText: "Shop New Launches", ctaLink: "/shop?sort=newest", image: ASSETS.posters.stayCool, enabled: true },
  { id: "pos2", title: "KNEE SUPPORT FOR ACTIVE LIVING", ctaText: "Shop Now", ctaLink: "/body-part/knee", image: ASSETS.posters.kneeActive, enabled: true },
];

export const seedTrustStrip: TrustStripItem[] = [
  { id: "t1", title: "Impacted Over 100 Million Lives", subtitle: "A legacy of impact across 100 million lives", icon: "Sparkles", image: ASSETS.trust.lives, order: 1, enabled: true },
  { id: "t2", title: "Trusted Across 60 Countries", subtitle: "Trusted by customers across 60+ countries worldwide", icon: "Globe", image: ASSETS.trust.countries, order: 2, enabled: true },
  { id: "t3", title: "Most Reliable Name for Over 25 Years", subtitle: "Trusted excellence for over 25 years", icon: "Award", image: ASSETS.trust.reliable, order: 3, enabled: true },
  { id: "t4", title: "Free and Fast Shipping Across India", subtitle: "Prompt delivery to your doorstep nationwide", icon: "Truck", image: ASSETS.trust.shipping, order: 4, enabled: true },
  { id: "t5", title: "Designed by Experts", subtitle: "Physio-engineered", icon: "Stethoscope", order: 5, enabled: true },
  { id: "t6", title: "Secure Payment, Safe & Trusted", subtitle: "Protected checkout and confidential transactions", icon: "ShieldCheck", image: ASSETS.trust.secure, order: 6, enabled: true },
  { id: "t7", title: "Medical Grade Quality", subtitle: "Certified materials", icon: "BadgeCheck", order: 7, enabled: true },
  { id: "t8", title: "Easy Returns", subtitle: "30-day promise", icon: "RotateCcw", order: 8, enabled: true },
  { id: "t9", title: "Genuine Products", subtitle: "100% authentic", icon: "Sparkles", order: 9, enabled: true },
];

export const seedBlogs: Blog[] = [
  { id: "bl1", title: "Knee Support Buying Guide", slug: "knee-support-buying-guide", excerpt: "How to choose the right knee brace for sport, recovery, or daily comfort.", content: "Choosing the right knee support depends on the kind of activity and the level of stability you need. Compression sleeves are great for mild discomfort and warmth. Hinged braces give you maximum lateral stability after ligament injuries. For everyday office use a soft patella support is enough.\n\nAt Aligno we recommend a fitting check to make sure the brace sits exactly on your kneecap and the straps do not pinch.", image: B.knee, author: "Dr. Anjali Mehta", date: "2025-05-12", published: true },
  { id: "bl2", title: "Back Pain Causes and Treatment", slug: "back-pain-causes-treatment", excerpt: "Understanding lower back pain triggers and the best home interventions.", content: "Lower back pain is the most common reason adults visit a clinic. Sitting too long, weak core muscles and poor mattress support are usually behind it. Start with a posture audit, daily stretching and a lumbo-sacral belt for active hours.", image: B.back, author: "Aligno Experts", date: "2025-05-20", published: true },
  { id: "bl3", title: "Neck Pain Relief Guide", slug: "neck-pain-relief-guide", excerpt: "Simple daily resets to release tension in your neck and upper back.", content: "Most neck pain comes from screen time. Pair a memory foam pillow at night with a neck corrector belt during the day to reset alignment.", image: B.neck, author: "Aligno Experts", date: "2025-05-28", published: true },
  { id: "bl4", title: "Wrist Brace Usage Guide", slug: "wrist-brace-usage-guide", excerpt: "When to wear a wrist brace and how tight is too tight.", content: "Wear a wrist brace during the activity that triggers pain. It should be snug but you should still feel your fingers warm.", image: B.wrist, author: "Aligno Experts", date: "2025-06-02", published: true },
  { id: "bl5", title: "How to Choose the Right Support Belt", slug: "right-support-belt", excerpt: "Lumbar, abdominal, or rib — picking the right belt for your need.", content: "Each support belt targets a different anatomical region. Choose lumbar for lower back, abdominal for postpartum and core, rib for fracture recovery.", image: B.back, author: "Aligno Experts", date: "2025-06-09", published: true },
  { id: "bl6", title: "Foot Pain Relief Tips", slug: "foot-pain-relief-tips", excerpt: "Plantar fasciitis, arch pain, and what to do about it.", content: "Roll a frozen bottle under your foot, stretch your calf wall, and consider an arch support insole. Bunion splints help align the big toe overnight.", image: B.foot, author: "Aligno Experts", date: "2025-06-14", published: true },
];

export const seedReviews: Review[] = [
  { id: "r1", customerName: "Priya Sharma", productId: "prod-7", rating: 5, text: "Knee Support fits perfectly and stays in place during my morning runs. Highly recommend!", image: B.knee, approved: true, featured: true, date: "2025-05-10" },
  { id: "r2", customerName: "Rohan Verma", productId: "prod-12", rating: 5, text: "Wrist Wrap gives solid support without feeling bulky. Great for gym sessions.", image: B.wrist, approved: true, featured: true, date: "2025-05-22" },
  { id: "r3", customerName: "Aisha Khan", productId: "prod-3", rating: 4, text: "Cervical Collar is comfortable for long desk hours. Good quality fabric.", image: B.neck, approved: true, featured: true, date: "2025-06-01" },
  { id: "r4", customerName: "Vikram Singh", productId: "prod-9", rating: 5, text: "Lumbar Sacral Support Belt — finally something that actually supports my lower back during long drives.", image: B.back, approved: true, featured: true, date: "2025-06-08" },
  { id: "r5", customerName: "Neha Gupta", productId: "prod-2", rating: 5, text: "Ankle Support helped me get back to walking comfortably after a sprain.", image: B.ankle, approved: true, featured: true, date: "2025-06-12" },
];

export const seedCMS: CMSContent = {
  topBarText: "Free Shipping Above ₹999",
  heroVisible: true,
  trustStripVisible: true,
  categoriesVisible: true,
  painAreaVisible: true,
  bestSellersVisible: true,
  postersVisible: true,
  activityVisible: true,
  brandBannerVisible: true,
  brandRangeVisible: true,
  testimonialsVisible: true,
  blogsVisible: true,
  seoTitle: "Aligno — Premium Orthopedic Supports & Daily Comfort",
  seoDescription: "Shop medical-grade braces, belts, posture correctors and daily-support products engineered by physiotherapists.",
};

export const seedFooter: FooterContent = {
  description: "Aligno designs medical-grade orthopedic and daily-support products that help you move, recover and live aligned.",
  address: "Aligno HQ, 12 Wellness Avenue, Mumbai 400001, India",
  email: "hello@aligno.in",
  phone: "+91 98000 11122",
  whatsapp: "+91 98000 11122",
  newsletterText: "Subscribe for new launches and 10% off your first order.",
  copyright: "© 2026 Aligno Wellness Pvt. Ltd. All rights reserved.",
  social: { facebook: "#", instagram: "#", youtube: "#", linkedin: "#" },
};

export const seedContact: ContactInfo = {
  businessName: "Aligno Wellness Pvt. Ltd.",
  address: "12 Wellness Avenue, Mumbai 400001, India",
  phone: "+91 98000 11122",
  email: "hello@aligno.in",
  whatsapp: "+91 98000 11122",
  hours: "Mon–Sat, 9:00 AM – 7:00 PM IST",
  mapLink: "https://maps.google.com/?q=Mumbai",
};

const privacyPolicyContent = `Last updated: June 2026

INTRODUCTION

Aligno Wellness Pvt. Ltd. ("Aligno", "we", "us") operates aligno.in and is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and the choices you have when you shop for orthopedic supports, braces, and daily comfort products on our website.

INFORMATION WE COLLECT

We collect information you provide directly, such as your name, email address, phone number, shipping and billing address, and payment details when you place an order or contact us. We also collect order history, product preferences, and messages you send through our contact form or customer support channels.

When you browse our site, we automatically collect device information, browser type, IP address, pages visited, and referral source through cookies and similar technologies. This helps us improve site performance and understand how customers discover our products.

HOW WE USE YOUR INFORMATION

We use your information to process and deliver orders, send order confirmations and shipping updates, respond to support requests, and personalize product recommendations. With your consent, we may send promotional emails about new launches, offers, and wellness tips. You can unsubscribe at any time using the link in any marketing email.

We do not sell your personal data to third parties. We share information only with trusted service partners such as payment gateways, courier companies, and email providers who help us operate our business, and only to the extent necessary to fulfil your order or provide our services.

DATA SECURITY

We use industry-standard encryption and secure servers to protect your payment and personal information. While no online system is completely immune to risk, we regularly review our security practices and limit internal access to customer data on a need-to-know basis.

YOUR RIGHTS

You may request access to, correction of, or deletion of your personal data by emailing hello@aligno.in. You may also opt out of marketing communications at any time. If you are located in a jurisdiction with additional privacy rights, we will honour those rights as applicable.

COOKIES

Our website uses cookies to remember your cart, login session, and browsing preferences. You can disable cookies in your browser settings, though some features such as checkout may not work correctly without them.

CONTACT US

For privacy-related questions or requests, contact us at hello@aligno.in or call +91 98000 11122. Our registered office is Aligno Wellness Pvt. Ltd., 12 Wellness Avenue, Mumbai 400001, India.`;

const termsConditionsContent = `Last updated: June 2026

OVERVIEW

These Terms & Conditions govern your use of aligno.in and your purchase of Aligno orthopedic supports, braces, belts, cushions, and related wellness products. By accessing our website or placing an order, you agree to these terms. If you do not agree, please do not use our site.

ELIGIBILITY

You must be at least 18 years of age to purchase from Aligno. By placing an order, you confirm that the information you provide is accurate and that you are authorised to use the payment method submitted.

PRODUCT INFORMATION

We make every effort to display product images, descriptions, sizes, and specifications accurately. Minor variations in colour or packaging may occur. Orthopedic supports are designed for general comfort and support and are not a substitute for professional medical diagnosis or treatment. Consult a healthcare provider before use if you have a serious injury or medical condition.

PRICING AND PAYMENT

All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to correct pricing errors. Payment must be completed at checkout through our secure payment partners. Orders are confirmed only after successful payment verification.

ORDER ACCEPTANCE

We reserve the right to refuse or cancel any order due to product unavailability, pricing errors, suspected fraud, or delivery restrictions. If your order is cancelled after payment, a full refund will be issued to your original payment method within 5–7 business days.

INTELLECTUAL PROPERTY

All content on aligno.in — including logos, product photography, text, and design — is owned by Aligno Wellness Pvt. Ltd. and protected by copyright and trademark laws. You may not reproduce, distribute, or use our content without written permission.

LIMITATION OF LIABILITY

Aligno is not liable for indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability for any claim related to a product or order shall not exceed the amount you paid for that product.

GOVERNING LAW

These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.

CONTACT

Questions about these terms? Email hello@aligno.in or call +91 98000 11122.`;

const shippingPolicyContent = `Last updated: June 2026

DELIVERY COVERAGE

Aligno ships orthopedic supports, braces, belts, cushions, and daily comfort products across India. We deliver to most pin codes through our trusted courier partners. Enter your pincode on the product page to check availability for your location.

PROCESSING TIME

Orders are processed within 1–2 business days (Monday–Saturday, excluding public holidays) after payment confirmation. You will receive an email and SMS with your order confirmation and tracking details once your package is dispatched.

SHIPPING CHARGES

Orders above ₹999 qualify for free standard shipping anywhere in India. For orders below ₹999, a flat shipping fee is applied at checkout and shown before you confirm payment. Express delivery may be available in select cities at an additional charge.

ESTIMATED DELIVERY TIMES

Metro cities: 3–5 business days after dispatch
Tier 2 and Tier 3 cities: 5–7 business days after dispatch
Remote and north-east regions: 7–10 business days after dispatch

Delivery times are estimates and may vary due to weather, courier delays, or local restrictions. Aligno is not responsible for delays caused by factors outside our control once the package has been handed to the courier.

ORDER TRACKING

Track your order anytime at aligno.in/track-order using your Order ID from the confirmation email. You can also view order status from My Account → My Orders after logging in.

DELIVERY ATTEMPTS

Our courier partner will attempt delivery up to two times. If delivery fails, the package may be returned to us. Re-shipping charges may apply for returned orders due to incorrect address or repeated failed delivery attempts.

DAMAGED OR MISSING ITEMS

If your package arrives damaged or items are missing, contact us within 48 hours of delivery at hello@aligno.in with your Order ID and photos of the package. We will arrange a replacement or refund as per our Return & Refund Policy.

CONTACT

Shipping questions? Reach us at hello@aligno.in, WhatsApp +91 98000 11122, or call +91 98000 11122 (Mon–Sat, 9:00 AM – 7:00 PM IST).`;

const returnRefundPolicyContent = `Last updated: June 2026

OUR COMMITMENT

We want you to feel confident buying Aligno orthopedic supports and daily comfort products. If you are not satisfied, our 30-day return policy makes it easy to request a return or exchange on eligible items.

ELIGIBILITY FOR RETURNS

Returns are accepted within 30 days of delivery for unused products in their original packaging with all tags and accessories intact. Products must be unworn, unwashed, and free from odour or damage. For hygiene reasons, opened personal care items, nasal filters, and disposable medical products cannot be returned unless defective.

Items marked as final sale or purchased during special clearance events may not be eligible for return. Custom or specially ordered products are non-returnable unless defective.

HOW TO INITIATE A RETURN

Email hello@aligno.in with your Order ID, product name, reason for return, and photos if the item is defective or damaged. Our support team will confirm eligibility and provide return instructions within 1–2 business days. Do not ship items back without approval, as unauthorised returns may not be processed.

RETURN SHIPPING

If the return is due to our error (wrong item, defective product, or damage in transit), Aligno will cover return shipping costs. For change-of-mind returns, the customer is responsible for return courier charges unless stated otherwise at the time of approval.

REFUND PROCESS

Once we receive and inspect the returned item, approved refunds are processed within 5–7 business days to your original payment method. Bank processing times may add 3–5 additional business days before the amount appears in your account. You will receive an email confirmation when your refund is initiated.

EXCHANGES

Prefer a different size or product? Mention this in your return request. Exchanges are subject to stock availability. If the replacement item costs more, you will need to pay the difference. If it costs less, we will refund the balance.

DEFECTIVE OR WRONG ITEMS

Received a defective or incorrect product? Contact us within 48 hours of delivery with photos and your Order ID. We will arrange a free pickup and send a replacement or issue a full refund — your choice.

CANCELLATIONS

Orders can be cancelled before dispatch by contacting hello@aligno.in with your Order ID. Once shipped, the order falls under our standard return policy.

CONTACT

Return and refund questions? Email hello@aligno.in, WhatsApp +91 98000 11122, or call +91 98000 11122 (Mon–Sat, 9:00 AM – 7:00 PM IST).`;

export const seedPolicies: PolicyPage[] = [
  { slug: "privacy-policy", title: "Privacy Policy", content: privacyPolicyContent },
  { slug: "terms-conditions", title: "Terms & Conditions", content: termsConditionsContent },
  { slug: "shipping-policy", title: "Shipping Policy", content: shippingPolicyContent },
  { slug: "return-refund-policy", title: "Return & Refund Policy", content: returnRefundPolicyContent },
];

export const seedOrders: Order[] = [];
export const seedCustomers: Customer[] = [];
export const seedLeads: Lead[] = [];