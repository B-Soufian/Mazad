export default function FormSection() {
    return(
         <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 ">
            
            <div className="lg:col-span-5 flex flex-col">
              
              <div className="relative bg-white pt-10 pb-8 px-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-50 mb-16">
                <div className="absolute top-0 left-0 bg-[#D71939] text-white text-[10px] font-bold tracking-widest px-4 py-2 uppercase transform -translate-y-1/2">
                  Morocco temsna
                </div>
                
                <div className="mb-8">
                  <span className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">Location</span>
                  <p className="font-serif text-2xl leading-snug">
                    12 Savile Row, Mayfair<br />
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">Voice</span>
                    <p className="font-serif text-xl">0629879964</p>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">Email</span>
                    <p className="font-serif text-xl text-black">soufain@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-12 mb-16 flex-grow">
                <div>
                  <div className="flex items-center gap-3 mb-3 text-[#D71939]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a2 2 0 00-1.6-.8H8.3a2 2 0 00-1.6.8L4 11l-5.16.86a1 1 0 00-.84.99V16h3m10 0a2 2 0 104 0m-4 0a2 2 0 11-4 0m-10 0a2 2 0 104 0m-4 0a2 2 0 11-4 0"></path></svg>
                    <h3 className="font-serif text-xl text-black">Vehicles</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">Specialized logistics and provenance verification for automotive assets.</p>
                  <a href="#" className="text-[#D71939] text-[9px] font-bold tracking-widest uppercase hover:underline">Direct Inquiry</a>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3 text-[#D71939]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><path d="M9 4v16"></path><path d="M15 4v16"></path><path d="M4 9h16"></path><path d="M4 15h16"></path></svg>
                    <h3 className="font-serif text-xl text-black">Real Estate</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">Global portfolio management and high-value property auctions.</p>
                  <a href="#" className="text-[#D71939] text-[9px] font-bold tracking-widest uppercase hover:underline">Contact Broker</a>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3 text-[#D71939]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9l4-6z"></path><path d="M11 3v21"></path><path d="M2 9h20"></path></svg>
                    <h3 className="font-serif text-xl text-black">Luxury Items</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">Watch, jewelry, and fine art appraisal and acquisition services.</p>
                  <a href="#" className="text-[#D71939] text-[9px] font-bold tracking-widest uppercase hover:underline">Talk to Expert</a>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3 text-[#D71939]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    <h3 className="font-serif text-xl text-black">Tech Support</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">Technical assistance for our digital bidding platform and API access.</p>
                  <a href="#" className="text-[#D71939] text-[9px] font-bold tracking-widest uppercase hover:underline">Technical Desk</a>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200 pt-6 mt-auto">
                <span className="text-[9px] tracking-widest uppercase text-gray-400 font-medium">Transparent</span>
                <span className="text-[9px] tracking-widest uppercase text-[#D71939] font-bold">Competitive</span>
                <span className="text-[9px] tracking-widest uppercase text-gray-400 font-medium">Premium</span>
                <span className="text-[9px] tracking-widest uppercase text-gray-400 font-medium">Secure</span>
                <span className="text-[9px] tracking-widest uppercase text-gray-400 font-medium">Fast</span>
              </div>
            </div>


            <div className="lg:col-span-7 bg-[#f4f4f4] p-10 md:p-16 flex flex-col justify-center">
              <div className="mb-12">
                <h2 className="font-serif text-5xl mb-3">Inquiry</h2>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">Formal Request for Connection</p>
              </div>

              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-3">Legal Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Full Name" 
                      className="w-full bg-transparent border border-gray-300 p-4 text-[13px] placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-3">Electronic Mail</label>
                    <input 
                      type="email" 
                      placeholder="email@address.com" 
                      className="w-full bg-transparent border border-gray-300 p-4 text-[13px] placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-3">Primary Interest</label>
                  <div className="relative">
                    <select className="w-full bg-transparent border border-gray-300 p-4 text-[13px] text-gray-800 appearance-none focus:outline-none focus:border-gray-500 transition-colors cursor-pointer">
                      <option value="" disabled selected>Select Asset Class</option>
                      <option value="vehicles">Vehicles</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="luxury">Luxury Items</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-3">Detailed Brief</label>
                  <textarea 
                    placeholder="Please describe your acquisition or liquidation needs..." 
                    rows="4"
                    className="w-full bg-transparent border border-gray-300 p-4 text-[13px] placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors resize-none h-32"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="bg-[#1a1a1a] text-white text-[10px] uppercase font-bold tracking-[0.2em] py-5 px-8 flex items-center justify-between min-w-[240px] hover:bg-black transition-colors">
                    Initiate Connection
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-4 opacity-70"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              </form>
            </div>
          </section>
    )
}