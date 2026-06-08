export default function HighlightsSection({ car }) {
    const { asset } = car || {};
    const highlights = asset?.marketing?.highlights || [];

    if (!highlights || highlights.length === 0) return null;

    return (<div className="mb-10">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#D71939] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div className="font-bold text-gray-900">{highlight}</div>
                  </div>
                ))}

              </div>
            </div>
        )}