export default function FilterSection(){
    return ( 
    <>
    <div className="flex flex-col xl:flex-row justify-between gap-4 mb-6">
          {/* Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-50 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              All Filters
            </button>
            <select className="flex items-center gap-8 bg-white border border-gray-200 px-4 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 shadow-sm">
              {['Category', 'Vehicle Type', 'Make'].map((filter) => (
                <option key={filter} >
                  {filter}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-8 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-md text-sm text-gray-400 cursor-not-allowed">
              Model
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 xl:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 sm:text-sm shadow-sm text-gray-900" placeholder="Search in Vehicles and Machinery" />
            </div>
            <button className="flex items-center justify-between min-w-[100px] bg-white border border-gray-200 px-4 py-2.5 rounded-md text-sm text-gray-800 hover:bg-gray-50 shadow-sm">
              Sort
              <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
    </div>
    <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">Showing 1-120 of 673</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
             <button className="text-gray-400 hover:text-gray-600">&lt;</button>
             <div className="flex items-center gap-2">
                 <input type="text" value="1" readOnly className="w-8 h-8 text-center border border-gray-200 rounded-md bg-white shadow-sm" />
                 <span>of 6</span>
             </div>
             <button className="text-gray-800 font-bold hover:text-black">&gt;</button>
          </div>
    </div>
    
    </>
    )}