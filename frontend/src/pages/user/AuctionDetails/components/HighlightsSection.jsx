export default function HighlightsSection({ car }) {
    const { asset } = car || {};
    const highlights = asset?.marketing?.highlights || [];

    if (!highlights || highlights.length === 0) return null;

    return (<div className="mb-10">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#D71939] flex items-center justify-center flex-shrink-0 text-white">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{highlight.title}</h4>
                      <p className="text-sm text-gray-500">{highlight.description}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
        )}