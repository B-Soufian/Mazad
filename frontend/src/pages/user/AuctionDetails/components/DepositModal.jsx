import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletApi } from '../../../../api/walletApi';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export default function DepositModal({ isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(null);

  const isLoggedIn = !!localStorage.getItem('token');

  if (!isOpen) return null;

  const handleDeposit = async () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1) {
      setError('Please enter a valid amount (minimum 1 MAD).');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await walletApi.deposit({ amount: numAmount });
      setNewBalance(data.new_balance);
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Deposit failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setAmount('');
    setSuccess(false);
    setNewBalance(null);
    setError('');
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleSelectPreset = (val) => {
    setAmount(String(val));
    setError('');
  };

  // ── Not logged in: redirect to login ──
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Lock icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-[#D71939]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            You need to be logged in to deposit funds and start bidding on auctions.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#D71939] hover:bg-[#b5142e] transition-colors rounded-xl py-3.5 text-white font-bold text-[15px] shadow-md mb-3"
          >
            Go to Login
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl py-3.5 text-gray-600 font-semibold text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Logged in: Deposit form ──
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1f24] to-[#2d333b] px-7 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">Add Funds</h3>
              <p className="text-gray-400 text-xs mt-0.5">Deposit to your wallet to start bidding</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="p-7">
          {/* ── Success State ── */}
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Deposit Successful!</h4>
              <p className="text-sm text-gray-500 mb-1">Your funds have been added to your wallet.</p>
              <p className="text-2xl font-bold text-gray-900 mb-6">
                MAD {Number(newBalance).toLocaleString()}
              </p>
              <button
                onClick={handleDone}
                className="w-full bg-[#D71939] hover:bg-[#b5142e] transition-colors rounded-xl py-3.5 text-white font-bold text-[15px] shadow-md"
              >
                Start Bidding
              </button>
            </div>
          ) : (
            <>
              {/* Amount Input */}
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block pl-1">
                Enter Amount
              </label>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden h-14 mb-4 bg-white focus-within:border-[#D71939] focus-within:ring-1 focus-within:ring-[#D71939]/20 transition-all">
                <span className="px-4 flex items-center text-gray-400 font-bold border-r border-gray-100 text-sm bg-gray-50">
                  MAD
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(''); }}
                  className="w-full px-4 font-bold text-gray-900 text-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Preset amounts */}
              <div className="flex gap-2 mb-5">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleSelectPreset(val)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      Number(amount) === val
                        ? 'bg-[#D71939] text-white border-[#D71939]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 mb-4">
                  <svg className="w-4 h-4 text-[#D71939] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-[#D71939] font-medium">{error}</p>
                </div>
              )}

              {/* Info */}
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your deposit will be available instantly. Funds are held securely and can be withdrawn at any time.
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleDeposit}
                disabled={loading || !amount}
                className={`w-full rounded-xl py-4 font-bold text-[15px] shadow-md transition-all flex items-center justify-center gap-2 ${
                  loading || !amount
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#D71939] hover:bg-[#b5142e] text-white'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Deposit MAD ${Number(amount || 0).toLocaleString()}`
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
