import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    id: "1",
    name: "Ngwéré Oud",
    slug: "ngwere-oud",
    tagline: "Authority, Power, Silent Dominance",
    description: "Ngwéré Oud embodies authority that is felt rather than announced. It moves with the quiet confidence of tailored luxury—polished, composed, and unmistakably commanding.",
    story: "Each note is measured and intentional, creating a presence that fills a space without excess. This fragrance is crafted for those who value restraint as the highest form of power. Its niche character lies in its refined depth, designed for individuals who understand that true dominance is expressed through elegance, control, and enduring sophistication.",
    category: "Unisex",
    price: 150,
    stock: 15,
    notes: "Agarwood, Rosewood, Sandalwood, Amber",
    ingredients: "Agarwood, Rosewood, Sandalwood, Amber",
    image: "/images/ngwere-oud.png",
    accentColor: "#3d2817"
  },
  {
    id: "2",
    name: "MaNyaMa Oud",
    slug: "manyama-oud",
    tagline: "Abundance, Richness, Majesty",
    description: "MaNyaMa Oud is a tribute to abundance in its most authentic form. Saffron and rose unfold into the depth of Agarwood, echoing land that has long held value beneath its surface.",
    story: "Like the mineral-rich soils of Zim, this fragrance reflects wealth that is rooted, layered, and enduring rather than displayed. Amber settles with warmth and gravity, mirroring the quiet majesty of natural resources shaped over time. Crafted with a niche sensibility, MaNyaMa Oud speaks to prosperity that is inherited from the earth itself—rich, powerful, and unmistakably present.",
    category: "Unisex",
    price: 165,
    stock: 8,
    notes: "Agarwood, Saffron, Rose, Birch, Amber",
    ingredients: "Agarwood, Saffron, Rose, Birch, Amber",
    image: "/images/manyama-oud.png",
    accentColor: "#4a1a4a"
  },
  {
    id: "3",
    name: "Gafa Intense",
    slug: "gafa-intense",
    tagline: "Bold, Powerful, Trend Setter",
    description: "Gafa Intense is a declaration of fearless individuality. Floral intensity and earthy depth collide to create a fragrance that thrives on confidence and movement.",
    story: "It is expressive, magnetic, and built for those who command attention naturally. There is a subtle cultural rhythm beneath its boldness—an echo of African urban creativity that has quietly shaped global style narratives. Designed for niche fragrance lovers, Gafa Intense belongs to those who lead conversations, set trends, and define their own lane.",
    category: "Men",
    price: 145,
    stock: 20,
    notes: "French Jasmine, Black Truffle, Ylang-ylang",
    ingredients: "French Jasmine, Black Truffle, Ylang-ylang",
    image: "/images/gafa-intense.png",
    accentColor: "#1a1a2d"
  },
  {
    id: "4",
    name: "Shungu",
    slug: "shungu",
    tagline: "Passion, Intensity, Fire of the Heart",
    description: "Shungu is emotion distilled into scent. Tobacco leaf and spice ignite the senses, while pink pepper adds warmth and urgency.",
    story: "This fragrance is raw yet refined, capturing the fire that drives ambition, love, and self-expression. Inspired by artistic expression where emotion fuels creation, Shungu carries a niche depth that feels intimate and powerful. It is crafted for those who feel deeply and wear their intensity with pride and elegance.",
    category: "Unisex",
    price: 140,
    stock: 12,
    notes: "Tobacco Leaf, Spicy Notes, Pink Pepper",
    ingredients: "Tobacco Leaf, Spicy Notes, Pink Pepper",
    image: "/images/shungu.png",
    accentColor: "#3d1a1a"
  },
  {
    id: "5",
    name: "Goridhé",
    slug: "goridhe",
    tagline: "Opulent, Wealth, Prestige",
    description: "Goridhé reflects polished success and elevated taste. Crisp fruits and citrus notes open with clarity and brightness, creating a scent that feels confident, modern, and refined.",
    story: "It is fresh yet authoritative, luminous yet composed. Inspired by South Africa’s sophisticated luxury landscape—where heritage, craftsmanship, and global excellence converge—Goridhé carries a refined niche identity. It is a fragrance for those who wear success effortlessly and move with quiet prestige.",
    category: "Unisex",
    price: 155,
    stock: 10,
    notes: "Apple, Citrus Fruits, Bergamot",
    ingredients: "Apple, Citrus Fruits, Bergamot",
    image: "/images/goridhe.png",
    accentColor: "#D4AF37"
  },
  {
    id: "6",
    name: "MaBoss",
    slug: "maboss",
    tagline: "Leadership, Status, Power",
    description: "MaBoss is the essence of composed leadership. Saffron and jasmine introduce authority with elegance, while ambergris and cedarwood ground the fragrance in strength and clarity.",
    story: "It commands respect without force, presence without noise. Rooted in artisanal values where leadership is earned through wisdom and discipline, MaBoss reflects a confident niche character. It is designed for those who lead decisively and carry status as a natural extension of who they are.",
    category: "Men",
    price: 160,
    stock: 5,
    notes: "Saffron, Jasmine, Ambergris, Cedarwood",
    ingredients: "Saffron, Jasmine, Ambergris, Cedarwood",
    image: "/images/maboss.png",
    accentColor: "#2A2A2A"
  },
  {
    id: "7",
    name: "Dadiso",
    slug: "dadiso",
    tagline: "Love, Warmth, Deep Emotional Connection",
    description: "Dadiso is a fragrance of closeness and sincerity. Soft fruits and florals blend seamlessly, creating an inviting warmth that feels personal and heartfelt.",
    story: "It lingers gently, leaving an impression that is comforting and memorable. Inspired by traditions that honor connection and emotional depth, Dadiso offers a niche softness rarely found in contemporary perfumery. It is crafted for those who value intimacy, affection, and meaningful presence.",
    category: "Women",
    price: 135,
    stock: 25,
    notes: "Raspberry, Rose, Pink Pepper",
    ingredients: "Raspberry, Rose, Pink Pepper",
    image: "/images/dadiso.png",
    accentColor: "#B565A7"
  },
  {
    id: "8",
    name: "Uzoba Lit",
    slug: "uzoba-lit",
    tagline: "Energy, Excitement, Youthful Urban Fire",
    description: "Uzoba Lit is vibrant and alive with momentum. Bright citrus and aromatic notes ignite an energetic trail that mirrors ambition, creativity, and modern city life.",
    story: "It is expressive, fresh, and unapologetically dynamic. Influenced by contemporary African urban culture, Uzoba Lit embraces a niche freshness that feels authentic and fearless. It is designed for individuals who move fast, think boldly, and thrive in motion.",
    category: "Unisex",
    price: 130,
    stock: 18,
    notes: "Bergamot, Grapefruit, Rosemary",
    ingredients: "Bergamot, Grapefruit, Rosemary",
    image: "/images/unoziba-lit.png",
    accentColor: "#E25822"
  },
  {
    id: "9",
    name: "DNA Oud",
    slug: "dna-oud",
    tagline: "Legacy, Heritage, Presence",
    description: "DNA Oud is a reflection of identity and continuity. Its opening is refined and confident, settling into a deep, grounded presence that feels timeless.",
    story: "This fragrance carries history while remaining unmistakably modern. Crafted with respect for heritage and artisanal depth, DNA Oud stands firmly in the niche fragrance space. It is worn by those who understand their roots and move forward with quiet authority.",
    category: "Unisex",
    price: 170,
    stock: 0,
    notes: "Saffron, Bergamot, Spicy Accords",
    ingredients: "Saffron, Bergamot, Spicy Accords",
    image: "/images/dna-oud.png",
    accentColor: "#2F4F4F"
  },
  {
    id: "10",
    name: "Goldess",
    slug: "goldess",
    tagline: "Glow of Confidence, Warmth, Radiance",
    description: "Goldess radiates self-assurance and elegance. Bright citrus and green notes unfold into a luminous warmth that feels uplifting and refined.",
    story: "It enhances presence without overwhelming, leaving a graceful and confident trail. Inspired by artistic expressions that celebrate light and balance, Goldess holds a subtle niche sophistication. It is designed for those whose confidence shines naturally and whose warmth leaves a lasting impression.",
    category: "Women",
    price: 145,
    stock: 3,
    notes: "Bergamot, Orange, Green Notes",
    ingredients: "Bergamot, Orange, Green Notes",
    image: "/images/goldess.png",
    accentColor: "#FFD700"
  }
]

const orders = [
  {
    id: "ORD-001",
    customer: "Farai Munetsi",
    phone: "+263 77 123 4567",
    items: "Mbinga Noir (x1)",
    amount: 120,
    status: "Pending",
    date: new Date(new Date().setMinutes(new Date().getMinutes() - 2)), // 2 mins ago
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    phone: "+263 71 987 6543",
    items: "Golden Savanna (x2)",
    amount: 290,
    status: "Paid",
    date: new Date(new Date().setHours(new Date().getHours() - 1)), // 1 hour ago
  },
  {
    id: "ORD-003",
    customer: "Tafadzwa K.",
    phone: "+263 77 222 3333",
    items: "Royal Zambezi (x1)",
    amount: 145,
    status: "Shipped",
    date: new Date(new Date().setHours(new Date().getHours() - 3)), // 3 hours ago
  }
]

async function main() {
  console.log('Start seeding ...')
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
    console.log(`Created product with id: ${product.id}`)
  }

  for (const o of orders) {
    const order = await prisma.order.upsert({
      where: { id: o.id },
      update: {},
      create: o,
    })
    console.log(`Created order with id: ${order.id}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
