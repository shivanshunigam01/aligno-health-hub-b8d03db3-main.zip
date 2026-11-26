// All brand images live in `public/img/`
const B = "/img";

export const ASSETS = {
  logo: `${B}/aligno-logo.png`,

  /** Full-width hero slider creatives (text baked into design) */
  hero: {
    moveFreely: `${B}/banner-move-freely.png`,
    posture: `${B}/banner-posture.png`,
    activeLiving: `${B}/banner-active-living.png`,
  },

  /** Trust-strip graphics (icon + text baked in) */
  trust: {
    shipping: `${B}/banner-3.jpg`,
    countries: `${B}/banner-5.jpg`,
    lives: `${B}/banner-6.jpg`,
    reliable: `${B}/banner-7.jpg`,
    secure: `${B}/poster-artboard.jpg`,
  },

  /** Promotional poster banners for homepage 2-column section */
  posters: {
    stayCool: `${B}/banner-move-freely.png`,
    kneeActive: `${B}/body-knee.jpg`,
    activeLiving: `${B}/banner-move-freely.png`,
  },

  /** Shop-by-body-part category photos */
  body: {
    knee: `${B}/body-knee.jpg`,
    back: `${B}/back-pain.jpg`,
    neck: `${B}/body-neck.jpg`,
    shoulder: `${B}/body-shoulder.jpg`,
    wrist: `${B}/body-wrist.jpg`,
    hand: `${B}/body-hand.jpg`,
    foot: `${B}/foot-pain.jpg`,
    ankle: `${B}/ankle-pain.jpg`,
    calf: `${B}/body-calf.jpg`,
    chest: `${B}/body-chest.jpg`,
    face: `${B}/body-face.jpg`,
  },

  /** Product packshots */
  products: {
    carNeckPillow: `${B}/grey-bg-copy.png`,
    neckCorrector: `${B}/body-neck.jpg`,
    fingerSplint: `${B}/product-nasal.png`,
    seatCombo: `${B}/product-seat-combo.png`,
    trio: `${B}/product-trio.png`,
    wfh: `${B}/product-wfh.png`,
    posture: `${B}/product-posture.png`,
    mattress: `${B}/product-menu-mattress.png`,
    mattressAnimated: `${B}/grey-bg.png`,
    nasal: `${B}/product-nasal.png`,
  },

  /** Orthotic care collage grid */
  collage: {
    tall: `${B}/product-wfh.png`,
    top1: `${B}/banner-move-freely.png`,
    top2: `${B}/body-knee.jpg`,
    bottom1: `${B}/product-seat-combo.png`,
    bottom2: `${B}/back-pain.jpg`,
  },

  /** Lifestyle / activity backgrounds */
  lifestyle: {
    yoga: `${B}/banner-move-freely.png`,
    running: `${B}/body-knee.jpg`,
    travel: `${B}/grey-bg-copy.png`,
    office: `${B}/product-wfh.png`,
    active: `${B}/banner-move-freely.png`,
    lumbo: `${B}/back-pain.jpg`,
    neck: `${B}/body-neck.jpg`,
    walking: `${B}/back-pain.jpg`,
  },
} as const;
