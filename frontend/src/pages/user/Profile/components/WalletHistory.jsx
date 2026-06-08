import React, { useState, useEffect } from 'react';
import { profileApi } from '../../../../api/profileApi';
import { ArrowDownToLine, ArrowUpFromLine, Tag } from 'lucide-react';
import DepositModal from '../../AuctionDetails/components/DepositModal';
import WithdrawModal from './WithdrawModal';
import { authApi } from '../../../../api/authApi';

const WalletHistory = ({ walletBalance }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [walletBalanceTotal, setWalletBalanceTotal] = useState(walletBalance || 0);
  const [frozenBalance, setFrozenBalance] = useState(0);

  const fetchTransactions = async () => {
    try {
      const data = await profileApi.getMyTransactions();
      setTransactions(data.data || data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const data = await authApi.getMe();
      if (data && data.user) {
        setWalletBalanceTotal(data.user.wallet_balance);
        setFrozenBalance(data.user.frozen_balance);
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  const handleTransactionSuccess = () => {
    setIsDepositOpen(false);
    setIsWithdrawOpen(false);
    fetchTransactions();
    fetchBalance();
  };

  const availableBalance = Number(walletBalanceTotal) - Number(frozenBalance);

  return (
    <div className="animate-[fadeIn_0.2s_ease-out] w-full space-y-8">
      
      {/* Balance Card */}
      <div className="bg-[#0c1220] rounded-xl shadow-sm p-8 text-white w-full">
         <h3 className="text-[13px] font-bold text-[#7189b6] uppercase tracking-widest mb-3">Available Balance</h3>
         <div className="flex items-end gap-2 mb-6">
            <span className="text-2xl text-[#7189b6] mb-1">MAD</span>
            <span className="text-5xl font-bold tracking-tight">{availableBalance.toLocaleString()}</span>
         </div>
         
         <div className="flex flex-col sm:flex-row gap-8 mb-8 border-t border-white/10 pt-6">
            <div>
               <h4 className="text-[11px] font-bold text-[#7189b6] uppercase tracking-widest mb-1">Total Wallet</h4>
               <div className="text-lg font-bold">MAD {Number(walletBalanceTotal || 0).toLocaleString()}</div>
            </div>
            <div>
               <h4 className="text-[11px] font-bold text-[#7189b6] uppercase tracking-widest mb-1">Frozen (Bids)</h4>
               <div className="text-lg font-bold text-[#d71939]">MAD {Number(frozenBalance || 0).toLocaleString()}</div>
            </div>
         </div>
         <div className="flex gap-4 max-w-sm">
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="bg-[#d71939] hover:bg-[#b5142e] transition-colors px-6 py-3 rounded-lg font-bold text-[14px] flex-1 text-white"
            >
              Add Funds
            </button>
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="bg-transparent hover:bg-white/5 border border-[#58739e] transition-colors px-6 py-3 rounded-lg font-bold text-[14px] text-white flex-1"
            >
              Withdraw
            </button>
         </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
         <div className="flex justify-between items-start mb-8">
           <div>
             <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-2">Wallet & Ledger</h2>
             <p className="text-[#64748b] text-[15px]">A complete history of your financial transactions.</p>
           </div>
           <div className="bg-[#f1f5f9] text-[#475569] px-4 py-2 rounded-md text-[13px] font-bold flex items-center gap-2 border border-gray-200">
             {transactions.length} RECORDS
           </div>
         </div>

         {loading ? (
            <div className="pt-4 text-gray-500 animate-pulse">Loading transactions...</div>
         ) : transactions.length === 0 ? (
           <div className="text-center py-12 border-t border-gray-100">
             <p className="text-gray-500">Your wallet history will appear here.</p>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b-2 border-gray-100">
                   <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Type</th>
                   <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Description</th>
                   <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Date</th>
                   <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest text-right">Amount</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {transactions.map(tx => {
                   const date = new Date(tx.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
                   const isPositive = tx.type === 'deposit' || tx.type === 'refund';
                   const amountClass = isPositive ? 'text-[#0d9488]' : 'text-[#111827]';
                   const sign = isPositive ? '+' : '-';
                   
                   let icon = <Tag size={16} strokeWidth={2.5} className="text-[#64748b]" />;
                   if (tx.type === 'deposit') icon = <ArrowDownToLine size={16} strokeWidth={2.5} className="text-[#0d9488]" />;
                   if (tx.type === 'withdrawal') icon = <ArrowUpFromLine size={16} strokeWidth={2.5} className="text-[#64748b]" />;

                   return (
                     <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                       <td className="py-5 px-2">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-lg bg-[#f1f5f9] flex items-center justify-center`}>
                                {icon}
                             </div>
                             <span className="font-bold text-[#0f172a] text-[15px] capitalize">{tx.type}</span>
                          </div>
                       </td>
                       <td className="py-5 px-2 text-[14px] text-[#64748b] font-medium">{tx.description || 'No description'}</td>
                       <td className="py-5 px-2 text-[14px] text-[#64748b]">{date}</td>
                       <td className={`py-5 px-2 text-right font-bold text-[16px] ${amountClass}`}>
                         {sign} MAD {Number(tx.amount).toLocaleString()}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         )}
      </div>

      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        onSuccess={handleTransactionSuccess} 
      />

      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        onSuccess={handleTransactionSuccess} 
        availableBalance={availableBalance}
      />
    </div>
  );
};

export default WalletHistory;
