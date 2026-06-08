import { useState } from "react";
export default function QuestionsSection(){
    const [activeIndex, setActiveIndex] = useState(null);
    const faqs =[
        {
            question: 'What are the selling fees?',
            answer: 'Our selling fees vary depending on the type of asset and the final auction value. Registration is free, and we offer competitive rates with a transparent fee structure. Please contact our sales team for a detailed breakdown.'
        },
        {
            question: 'How long does the process take?',
            answer: 'The process is designed to be swift and efficient. Once you register and we inspect your asset, it can go live on our platform within 48 to 72 hours depending on the required documentation.'
        },
        {
            question: 'Do you offer transport services?',
            answer: 'Yes, we provide comprehensive transport and towing services. Our team can securely collect your vehicles or goods from your location and bring them directly to our auction centers.'
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    return(
        <>
            <section className="relative bg-[#D71939] py-16 overflow-hidden my-3">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200" alt="bg pattern" className="w-full h-full object-cover mix-blend-overlay" />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
                <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl mb-6">Ready to Monetize?</h2>
                <p className="text-red-100 text-lg mb-10 max-w-2xl mx-auto">
                    Join the elite sellers now and turn your assets into cash today's closed platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button className="bg-white text-[#D71939] font-bold py-3 px-8 rounded hover:bg-gray-100 transition w-full sm:w-auto tracking-wide">
                    START SELLING
                    </button>
                    <button className="bg-transparent border border-white text-white font-bold py-3 px-8 rounded hover:bg-white/10 transition w-full sm:w-auto tracking-wide">
                    CONTACT SALES
                    </button>
                </div>
                </div>
            </section>
           <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    <div className="lg:col-span-1">
                    <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4 text-gray-900">
                        Common Questions
                    </h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        Everything you need to know about selling with Emirates Auction.
                    </p>
                    <a href="#all-faqs" className="text-[#D70B27] font-semibold flex items-center hover:underline text-sm">
                        View all FAQs <span className="ml-2">&rarr;</span>
                    </a>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = activeIndex === idx;

                        return (
                        <div 
                            key={idx} 
                            className="border-b border-gray-200 pb-4 flex flex-col cursor-pointer group"
                            onClick={() => toggleFAQ(idx)}
                        >
                            <div className="flex justify-between items-center transition-colors duration-200">
                            <span className={`font-semibold text-sm md:text-base transition-colors duration-200 ${isOpen ? 'text-[#D70B27]' : 'text-gray-800'} group-hover:text-[#D70B27]`}>
                                {faq.question}
                            </span>
                            
                            <svg 
                                className={`w-5 h-5 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-180 text-[#D70B27]' : 'text-gray-400 group-hover:text-[#D70B27]'}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                            </div>

                            <div 
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                            >
                            <div className="overflow-hidden">
                                <p className="text-gray-500 text-sm leading-relaxed pr-8">
                                {faq.answer}
                                </p>
                            </div>
                            </div>

                        </div>
                        );
                    })}
                    </div>
                    
                </div>
            </section>
        </>
    )
} 