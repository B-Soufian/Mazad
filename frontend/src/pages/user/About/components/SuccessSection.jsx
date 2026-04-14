import React from 'react';

export default function SuccessSection() {
    return(
    <section className="bg-[#F9FAFB] pt-10">
        <div className="text-center mb-10 ">
            <h3 className="font-['Playfair_Display'] text-4xl uppercase tracking-tighter">
                Our Success <span className="text-[#D71939]">In Numbers</span>
            </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-[500px]">
          {[
            { n: "15M+", t: "Active Users", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80" },
            { n: "20+", t: "Years of Auctions", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80" },
            { n: "2300+", t: "Auctions Completed", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80" },
            { n: "32", t: "Global Branches", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" }
          ].map((stat, i) => (
            <div key={i} className="relative group overflow-hidden cursor-pointer border-r border-white/10">
              <img src={stat.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="relative h-full flex flex-col justify-end p-10 text-white">
                <h4 className="text-5xl font-bold font-['Inter'] mb-2">{stat.n}</h4>
                <p className="text-xs uppercase tracking-widest opacity-80">{stat.t}</p>
              </div>
            </div>
          ))}
        </div>
    </section>
    )}