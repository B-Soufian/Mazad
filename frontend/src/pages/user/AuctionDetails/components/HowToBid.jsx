export default function HowToBid(){
    
    return(
        <div className="bg-[#f8f9fa] rounded-2xl p-7 border border-gray-100">
              <div className="flex mb-6">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">How To Place A Bid?</h3>
              </div>
              

              <div className="space-y-5">
                {/* Step 1 */}
                <div className="relative pl-6">
                   <h4 className="text-sm font-bold text-gray-900 mb-1">Log in or Create an Account</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">Before you can place a bid, you need to log in to your account. If you don't have one yet, don't worry—creating an account is quick and easy.</p>
                </div>
                {/* Step 2 */}
                <div className="relative pl-6">
                   <h4 className="text-sm font-bold text-gray-900 mb-1">2. Add Security Deposit</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">For added security and to ensure only committed bids, a refundable security deposit is required when placing a bid.</p>
                </div>
                 {/* Step 3 */}
                 <div className="relative pl-6">
                   <h4 className="text-sm font-bold text-gray-900 mb-1">3. Place Your Bid</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">Once logged in and your deposit is secured, you're ready to place your bid.</p>
                </div>
              </div>

            </div>
    )}