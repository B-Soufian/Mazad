export default function HeroSection() {
    return(
          <section className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
            <h1 className="font-serif text-[5rem] md:text-[7rem] lg:text-[9rem] leading-[0.85] tracking-tight uppercase m-0">
              <span className="block">Get in</span>
              <span className="block">Touch</span>
              <span className="block text-[#D71939] italic lowercase tracking-normal">with</span>
              <span className="block">Excellence</span>
            </h1>

            <div className="max-w-sm pb-4">
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6 font-medium">
                Our curators facilitate global acquisitions with absolute discretion. Reach our specialist desks for private consultation.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-[#D71939]"></div>
                <span className="text-[#D71939] text-[10px] font-bold tracking-[0.2em] uppercase">Est. 1984</span>
              </div>
            </div>
          </section>
    )
}