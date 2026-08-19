const images = [
  ['/images/WhatsApp_Image_2026-08-19_at_05.30.17.jpeg', 'Admissions open for 2026-27'],
  ['/images/WhatsApp_Image_2026-08-19_at_05.30.16.jpeg', 'Mentorship with Prasenjit Sir'],
  ['/images/WhatsApp_Image_2026-08-17_at_21.04.26.jpeg', 'Peerless Academy identity'],
];

export default function MediaGallery() {
  return <section id="gallery" className="bg-white px-5 py-24 text-ink lg:px-8 lg:py-32"><div className="mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="section-kicker text-coral">Inside / Peerless Academy</div><h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-6xl">See the space<br /><span className="text-slate-400">where futures grow.</span></h2></div><p className="max-w-[360px] text-sm leading-6 text-slate-500">A glimpse into the people, guidance, and learning atmosphere behind the results.</p></div><div className="mt-14 grid gap-5 md:grid-cols-3">{images.map(([src, alt], i) => <figure key={src} className={`group relative overflow-hidden rounded-[1.75rem] ${i === 1 ? 'md:-translate-y-6' : ''}`}><img src={src} alt={alt} className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" /><figcaption className="absolute bottom-0 p-6 text-sm font-black text-white">{alt}</figcaption></figure>)}</div></div></section>;
}
