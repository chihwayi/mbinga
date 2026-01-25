import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-obsidian pt-24 pb-12 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-serif text-2xl text-gold mb-4 tracking-widest">MBINGA</h3>
          <p className="text-cream/70 text-sm leading-relaxed">
            Born from the heart of Africa, defined by presence, refinement, and quiet authority.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg text-cream mb-6 tracking-widest">Collections</h4>
          <ul className="space-y-3">
            {["All Fragrances", "For Him", "For Her", "Unisex"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-cream/70 hover:text-gold transition-colors text-sm hover:pl-1 block">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-cream mb-6 tracking-widest">Company</h4>
          <ul className="space-y-3">
            {["Our Story", "Journal", "Contact", "Stockists"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-cream/70 hover:text-gold transition-colors text-sm hover:pl-1 block">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-cream mb-6 tracking-widest">Newsletter</h4>
          <p className="text-cream/70 text-sm mb-4">Subscribe for exclusive releases and stories.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-warm-grey border border-gold/30 p-3 text-cream text-sm focus:outline-none focus:border-gold"
            />
            <button className="bg-gold text-obsidian px-6 py-3 font-semibold text-xs uppercase tracking-wider hover:bg-amethyst hover:text-gold transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gold/10 text-center">
        <p className="text-cream/50 text-xs tracking-widest uppercase">
          &copy; {new Date().getFullYear()} MBINGA Parfum. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
