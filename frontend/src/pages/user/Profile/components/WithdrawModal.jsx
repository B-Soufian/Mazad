import { useState } from 'react';
import { walletApi } from '../../../../api/walletApi';
import { X, ArrowUpFromLine } from 'lucide-react';

export default function WithdrawModal({ isOpen, onClose, onSuccess, availableBalance }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setError(null);
        
        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        if (numAmount > availableBalance) {
            setError('Amount exceeds your available balance.');
            return;
        }

        setLoading(true);
        try {
            await walletApi.withdraw(numAmount);
            onSuccess();
            setAmount('');
        } catch (err) {
            setError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-[#111827]">Withdraw Funds</h2>
                        <p className="text-sm text-gray-500 mt-1">Transfer funds back to your account</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-gray-50/50">
                    <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
                        <span className="text-gray-500 font-medium">Available Balance</span>
                        <span className="font-bold text-[#111827] text-lg">MAD {Number(availableBalance).toLocaleString()}</span>
                    </div>

                    <form onSubmit={handleWithdraw}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Withdraw Amount</label>
                        <div className="relative mb-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">MAD</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError(null);
                                }}
                                placeholder="0.00"
                                className="w-full pl-14 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg font-bold text-[#111827] outline-none focus:border-[#d71939] focus:ring-1 focus:ring-[#d71939] transition-all"
                            />
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#111827] hover:bg-black transition-colors rounded-xl py-4 flex items-center justify-center gap-2 text-white font-bold shadow-md disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>
                                    <ArrowUpFromLine size={18} />
                                    <span>Confirm Withdrawal</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
