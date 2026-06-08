export default function VehicleSpecs({ car }) {
    const { auction } = car || {};
    const specs = auction?.asset?.specifications || [];

    return (
        <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Additional Features & Details</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                {specs.length > 0 ? specs.map((row, index) => (
                  <div key={index} className={`flex py-4 px-6 ${index !== specs.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="w-1/3 text-gray-500 text-sm">{row.label}</div>
                    <div className="w-2/3 font-bold text-gray-900 text-sm">{row.value}</div>
                  </div>
                )) : (
                  <div className="py-4 px-6 text-gray-500 text-sm">No details available.</div>
                )}
              </div>
            </div>
    )}