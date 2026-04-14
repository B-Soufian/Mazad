export default function Similar(){
    return(
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Similar Vehicles</h2>
            <div className="flex gap-2">
               <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 transition shadow-sm bg-white">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
               </button>
               <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-50 transition shadow-sm bg-white">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              <div className="relative h-48 bg-[#fcfcfc] flex items-center justify-center border-b border-gray-100 p-6">
                 <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                 </button>
                 <div className="w-[80%] h-full bg-[#E4E1D0] rounded-lg shadow-lg border border-gray-200"></div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">2023 Ford F-150 Lightning</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                  <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 12,450 Km</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Dubai</span>
                </div>
                <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Current Bid</p>
                    <p className="font-extrabold text-lg text-gray-900">AED 285,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1 mb-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Ends in</p>
                    <p className="font-bold text-[#D71939] text-sm">04h : 22m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
    )}