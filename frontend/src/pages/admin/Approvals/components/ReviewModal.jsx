import React, { useState, useEffect } from 'react';
import { auctionApi } from '../../../../api/auctionApi';
import { adminApi } from '../../../../api/adminApi';
import VehicleGallery from '../../../user/AuctionDetails/components/VehicleGallery';

export default function ReviewModal({ auctionId, onClose, onSuccess }) {
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState('');

  // Checkboxes state
  const [checks, setChecks] = useState({
    vin: false,
    media: false,
    reserve: false
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await auctionApi.getById(auctionId);
        setCarData({ asset: data.asset, auction: data });
      } catch (err) {
        console.error('Error fetching auction details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (auctionId) fetchDetails();
  }, [auctionId]);

  const handleApprove = async () => {
    if (!checks.vin || !checks.media || !checks.reserve) {
      alert("Please check all verification boxes before approving.");
      return;
    }
    try {
      setSubmitting(true);
      await adminApi.approveAuction(auctionId);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve auction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    try {
      setSubmitting(true);
      await adminApi.rejectAuction(auctionId, reason);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to reject auction');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Details</div>
        </div>
      </div>
    );
  }

  if (!carData) return null;

  const { asset, auction } = carData;
  const specs = asset?.specifications || [];

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1220]/80 backdrop-blur-md overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        
        <div className="bg-gray-50 w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reviewing: {asset?.title}</h2>
              <div className="text-sm text-gray-500 mt-1">
                Submitted by <span className="font-semibold text-gray-700">@{asset?.owner?.display_name || 'unknown'}</span> • Ticket #MD-{auctionId}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Skip Item
              </button>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Content (8 columns) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Gallery */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100 p-2">
                <VehicleGallery car={carData} />
              </div>

              {/* Specs Section */}
              <div className="bg-white rounded-xl border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Technical Specifications</h3>
                
                {specs.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {specs.slice(0, 4).map((spec, i) => (
                      <div key={i}>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{spec.label}</div>
                        <div className="text-sm font-bold text-gray-900">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mb-8">No specifications provided.</div>
                )}

                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Provenance & History</h3>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p>{asset?.marketing?.description || "No history provided by the seller."}</p>
                </div>
              </div>
            </div>

            {/* Right Content - Decision Panel (4 columns) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-8">
                
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Decision Panel
                </h3>

                {/* Checkboxes */}
                <div className="space-y-4 mb-8">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      checked={checks.vin}
                      onChange={(e) => setChecks({...checks, vin: e.target.checked})}
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Authenticity confirmed</div>
                      <div className="text-xs text-gray-500">Asset details match international registry.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      checked={checks.media}
                      onChange={(e) => setChecks({...checks, media: e.target.checked})}
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Media quality standards met</div>
                      <div className="text-xs text-gray-500">High resolution and mandatory angles present.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      checked={checks.reserve}
                      onChange={(e) => setChecks({...checks, reserve: e.target.checked})}
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Reserve price alignment</div>
                      <div className="text-xs text-gray-500">Within 15% of historical market averages.</div>
                    </div>
                  </label>
                </div>

                {/* Notes */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Decision Notes / Rejection Reason</h4>
                  <textarea 
                    rows="4" 
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg p-4 text-sm text-gray-900 resize-none transition-all placeholder-gray-400"
                    placeholder="If rejecting, please specify the missing requirements or documentation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button 
                    onClick={handleApprove}
                    disabled={submitting}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Approve & Publish to Live
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleReject}
                      disabled={submitting}
                      className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-red-100 disabled:opacity-50 text-sm"
                    >
                      Reject Submission
                    </button>
                    <button 
                      disabled={submitting}
                      onClick={() => alert('Request changes functionality to be implemented')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors text-sm"
                    >
                      Request Changes
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
