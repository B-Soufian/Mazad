export default function NotificationSection(){
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between mb-6 shadow-sm">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Please Note</h4>
              <p className="text-sm text-gray-500 mt-0.5">Each bid placed within the last 3 minutes of the lot's closing time will extend the lot closing by an additional 3 minutes.</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
    )
}