export default function PaginationSection(){
    return (
        <div className="flex justify-center items-center gap-2 pb-12">
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-400 hover:bg-gray-50 shadow-sm">&lt;</button>
          <button className="w-10 h-10 flex items-center justify-center bg-[#D71939] text-white rounded font-bold shadow-sm">1</button>
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 shadow-sm">2</button>
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 shadow-sm">3</button>
          <span className="text-gray-400 px-2">...</span>
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 shadow-sm">6</button>
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 shadow-sm">&gt;</button>
        </div>
    )
}