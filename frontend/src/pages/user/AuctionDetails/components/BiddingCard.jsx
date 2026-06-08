import { useEffect, useState, useRef } from 'react';
import { authApi } from '../../../../api/authApi';
import { bidApi } from '../../../../api/bidApi';
import DepositModal from './DepositModal';
import { Loader2, CheckCircle2, AlertCircle, Clock, Users, Calendar } from 'lucide-react';

export default function BiddingCard({ car, onBidSuccess }) {
  const { auction } = car || {};

  // ── Wallet state ───────────────────────────────────────────────────────────
  const [walletBalance, setWalletBalance] = useState(0);
  const [frozenBalance, setFrozenBalance] = useState(0);
  const [checking, setChecking]           = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // ── Bid input state ────────────────────────────────────────────────────────
  const currentPriceRaw = Number(auction?.current_price) || 0;
  const minIncrement    = Number(auction?.minimum_increment) || 500;
  const nextBid         = currentPriceRaw + minIncrement;
  const buyNowPrice     = Number(auction?.buy_now_price) || 0;

  const [bidAmount, setBidAmount]   = useState(nextBid);
  const [bidState, setBidState]     = useState('idle');   // idle | loading | success | error
  const [bidMsg, setBidMsg]         = useState('');
  const [buyState, setBuyState]     = useState('idle');
  const [buyMsg, setBuyMsg]         = useState('');

  // keep bidAmount in sync if auction price updates
  const prevPrice = useRef(currentPriceRaw);
  useEffect(() => {
    if (currentPriceRaw !== prevPrice.current) {
      setBidAmount(currentPriceRaw + minIncrement);
      prevPrice.current = currentPriceRaw;
    }
  }, [currentPriceRaw, minIncrement]);

  // ── Load wallet balance ────────────────────────────────────────────────────
  const refreshBalance = () => {
    authApi.getMe()
      .then(data => {
        setWalletBalance(Number(data.user?.wallet_balance) || 0);
        setFrozenBalance(Number(data.user?.frozen_balance) || 0);
      })
      .catch(() => { setWalletBalance(0); setFrozenBalance(0); });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setWalletBalance(0); setFrozenBalance(0); setChecking(false); return; }
    authApi.getMe()
      .then(data => {
        setWalletBalance(Number(data.user?.wallet_balance) || 0);
        setFrozenBalance(Number(data.user?.frozen_balance) || 0);
      })
      .catch(() => { setWalletBalance(0); setFrozenBalance(0); })
      .finally(() => setChecking(false));
  }, []);

  // ── Time remaining ─────────────────────────────────────────────────────────
  const [timeString, setTimeString] = useState('--h : --m');
  useEffect(() => {
    const calc = () => {
      const end = auction?.extended_ends_at || auction?.ends_at;
      if (!end) return;
      const diff = new Date(end) - new Date();
      if (diff <= 0) { setTimeString('Ended'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeString(d > 0 ? `${d}d : ${h}h` : `${h}h : ${m}m`);
    };
    calc();
    const t = setInterval(calc, 30000);
    return () => clearInterval(t);
  }, [auction?.ends_at, auction?.extended_ends_at]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const isEnded    = timeString === 'Ended';
  const availableBalance = walletBalance - frozenBalance;
  const hasBalance = availableBalance > 0;
  const endsOn     = auction?.extended_ends_at || auction?.ends_at
    ? new Date(auction.extended_ends_at || auction.ends_at)
        .toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
    : 'N/A';

  // ── Place Bid ──────────────────────────────────────────────────────────────
  const handleBid = async () => {
    // Client-side guard: amount must be >= next minimum
    if (bidAmount < nextBid) {
      setBidState('error');
      setBidMsg(`Minimum bid is MAD ${nextBid.toLocaleString()}`);
      return;
    }

    setBidState('loading');
    setBidMsg('');
    try {
      await bidApi.placeBid({ auction_id: auction.id, amount: Number(bidAmount) });
      setBidState('success');
      setBidMsg('Bid placed! You are the top bidder 🎉');
      refreshBalance();
      if (onBidSuccess) onBidSuccess();
      // Reset to idle after 3s
      setTimeout(() => { setBidState('idle'); setBidMsg(''); }, 3000);
    } catch (err) {
      setBidState('error');
      // Use backend message if available
      const msg =
        err.response?.data?.errors?.amount?.[0] ||
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setBidMsg(msg);
      setTimeout(() => { setBidState('idle'); setBidMsg(''); }, 4000);
    }
  };

  // ── Buy Now ────────────────────────────────────────────────────────────────
  const handleBuyNow = async () => {
    if (!window.confirm(`Buy now for MAD ${buyNowPrice.toLocaleString()}? This action is instant and final.`)) return;
    setBuyState('loading');
    setBuyMsg('');
    try {
      await bidApi.buyNow(auction.id);
      setBuyState('success');
      setBuyMsg('Purchase successful! You won this auction 🏆');
      refreshBalance();
      if (onBidSuccess) onBidSuccess();
    } catch (err) {
      setBuyState('error');
      const msg = err.response?.data?.message || 'Something went wrong.';
      setBuyMsg(msg);
      setTimeout(() => { setBuyState('idle'); setBuyMsg(''); }, 4000);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-7">
        {/* Current price */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Price</p>
        <h2 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">
          MAD {currentPriceRaw.toLocaleString()}
        </h2>

        {/* Stats */}
        <div className="space-y-4 mb-8">
          <StatRow icon={<Clock size={15} />} label="Time remaining" value={timeString} highlight={!isEnded} />
          <StatRow icon={<Users size={15} />} label="No. of Bids"    value={auction?.bid_count || 0} />
          <StatRow icon={<Calendar size={15} />} label="Ends on"      value={endsOn} last />
        </div>

        {/* Wallet balance badge */}
        {(walletBalance > 0) && !isEnded && (
          <div className="mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Available to Bid</span>
              <span className="text-sm font-bold text-[#111827]">MAD {availableBalance.toLocaleString()}</span>
            </div>
            {frozenBalance > 0 && (
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>Frozen (Active Bids)</span>
                <span>MAD {frozenBalance.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* ── Bid / Deposit area ── */}
        {checking ? (
          <div className="flex justify-center py-6">
            <Loader2 size={24} className="animate-spin text-gray-300" />
          </div>

        ) : isEnded ? (
          <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Auction Ended</p>
          </div>

        ) : !hasBalance ? (
          /* ── No balance: show deposit CTA ── */
          <div className="flex flex-col items-center">
            <p className="text-[13px] text-[#D71939] font-medium text-center mb-4">
              Add a security deposit to your wallet to start bidding.
            </p>
            <button
              onClick={() => setShowDepositModal(true)}
              className="w-full bg-[#D71939] hover:bg-[#b5142e] transition-colors rounded-xl py-4 text-white font-bold text-[15px] tracking-wide shadow-md"
            >
              Add Security Deposit
            </button>
          </div>

        ) : (
          /* ── Has balance: show bid form ── */
          <div>
            {/* Bid amount input */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">
              Enter Your Bid
            </p>
            <div className={`flex border rounded-xl overflow-hidden h-14 mb-1 bg-white transition-colors ${
              bidState === 'error' ? 'border-red-400' : 'border-gray-200'
            }`}>
              <span className="px-4 flex items-center text-gray-400 font-bold border-r border-gray-100 text-sm">
                MAD
              </span>
              <input
                type="number"
                value={bidAmount}
                min={nextBid}
                onChange={e => setBidAmount(Number(e.target.value))}
                className="w-full px-4 font-bold text-gray-900 text-lg outline-none"
              />
            </div>
            <p className="text-[11px] text-gray-400 mb-4 pl-1">
              Minimum next bid: <span className="font-bold text-gray-600">MAD {nextBid.toLocaleString()}</span>
            </p>

            {/* Feedback banner */}
            {bidMsg && (
              <div className={`mb-4 flex items-start gap-2 text-[13px] font-medium px-4 py-3 rounded-xl ${
                bidState === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {bidState === 'success'
                  ? <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                }
                {bidMsg}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {/* Place Bid */}
              <button
                onClick={handleBid}
                disabled={bidState === 'loading' || bidState === 'success'}
                className="flex-1 bg-[#1a1f24] hover:bg-black disabled:opacity-60 transition-colors rounded-xl py-3.5 flex flex-col items-center justify-center text-white shadow-md"
              >
                {bidState === 'loading' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : bidState === 'success' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <>
                    <span className="font-bold text-sm tracking-wide">Place a Bid</span>
                    <span className="text-[9px] text-gray-400 mt-0.5 tracking-wider">
                      MIN. INCR. MAD {minIncrement.toLocaleString()}
                    </span>
                  </>
                )}
              </button>

              {/* Buy Now — only show if buy_now_price is set */}
              {buyNowPrice > 0 && (
                <button
                  onClick={handleBuyNow}
                  disabled={buyState === 'loading' || buyState === 'success'}
                  className="flex-1 bg-[#D71939] hover:bg-[#b5142e] disabled:opacity-60 transition-colors rounded-xl py-3.5 flex flex-col items-center justify-center text-white shadow-md"
                >
                  {buyState === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : buyState === 'success' ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <>
                      <span className="font-bold text-sm tracking-wide">Buy Now</span>
                      <span className="text-[9px] text-red-200 mt-0.5 tracking-wider">
                        MAD {buyNowPrice.toLocaleString()}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Buy Now error feedback */}
            {buyMsg && (
              <div className={`mt-3 flex items-start gap-2 text-[13px] font-medium px-4 py-3 rounded-xl ${
                buyState === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {buyState === 'success'
                  ? <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                }
                {buyMsg}
              </div>
            )}
          </div>
        )}
      </div>

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={() => { setShowDepositModal(false); refreshBalance(); }}
      />
    </>
  );
}

// Small helper row component
function StatRow({ icon, label, value, last, highlight }) {
  return (
    <div className={`flex justify-between items-center ${!last ? 'pb-4 border-b border-gray-100' : ''}`}>
      <span className="text-gray-500 text-sm flex items-center gap-2">
        {icon} {label}
      </span>
      <span className={`font-bold text-sm ${highlight ? 'text-[#D71939]' : ''}`}>{value}</span>
    </div>
  );
}