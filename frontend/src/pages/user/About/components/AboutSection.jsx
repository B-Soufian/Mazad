import React from 'react';

export default function AboutSection() {
    return(
    <section className="relative py-24 px-6 md:px-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="absolute top-0 right-0 font-['Playfair_Display'] text-[250px] font-bold text-gray-50 leading-none -z-10 select-none">
            About
        </div>

        <div>
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#D71939] mb-8 block">Who we are</span>
          <h2 className="font-['Playfair_Display'] text-5xl leading-[1.1] text-gray-900">
            Redefining the <br />
            <span className="text-gray-400">auction experience</span> <br />
            for the modern era.
          </h2>
        </div>

        <div className="pt-12">
          <p className="text-gray-900 font-medium text-lg mb-8 leading-snug">
            BidMaster was born from a simple yet powerful vision: to seamlessly transition the thrill of the traditional auction house into a sophisticated digital ecosystem.
          </p>
          <div className="grid grid-cols-2 gap-8 text-xs leading-relaxed text-gray-500">
            <p>For over two decades, we have curated a collection of the world's finest vehicles, properties, and luxury goods. Our platform isn't just about buying and selling; it's about the heritage of value and the excitement of opportunity.</p>
            <p>We combine cutting-edge technology with white-glove service to ensure transparency, security, and prestige in every transaction. From rare collectibles to fleet liquidations, we set the standard.</p>
          </div>
          <div className="mt-10">
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Signature_of_Zayn_Malik.png" alt="Signature" className="h-12 opacity-80 grayscale" />
          </div>
        </div>
    </section>

    )}