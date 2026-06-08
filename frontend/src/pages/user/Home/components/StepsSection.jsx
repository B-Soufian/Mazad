export default function StepsSection(){
  const steps = [
      { 
              step: '01', title: 'Register', desc: 'Set up your account swiftly to start your selling journey with confidence.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> 
            },
            { 
              step: '02', title: 'Inspect', desc: 'Our team evaluates your asset to ensure it hits the market at optimal value.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> 
            },
            { 
              step: '03', title: 'List & Bid', desc: 'Once ready, we list your item to our vast network of ready-to-buy bidders.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg> 
            },
            { 
              step: '04', title: 'Get Paid', desc: 'Receive secure and prompt payments once your transaction is successfully closed.',
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
            }
  ]
    return(
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-gray-900 inline-block relative">
            Journey to Sold
            <span className="absolute -bottom-3 left-1/4 right-1/4 h-1 bg-[#D71939]"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Background dashed line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] border-t-2 border-dashed border-gray-200 -z-10"></div>

          {steps.map((item, index) => (
            <div key={index} className="relative bg-white pt-4 border rounded-xl p-7">
              <div className="text-gray-100 text-5xl font-bold absolute top-0 right-6 z-0 select-none ">{item.step}</div>
              <div className="relative z-10 ">
                <div className="w-14 h-14 bg-[#D71939]/10 text-[#D71939] rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
}