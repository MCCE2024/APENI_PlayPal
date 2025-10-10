
import React, { useState, useCallback } from 'react';
import MatchRequestModal from './MatchRequestModal';
import { MatchRequest } from '../types';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleRequestSubmit = (request: MatchRequest) => {
    console.log('New Match Request:', request);
    setMatchRequests(prev => [...prev, request]);
    closeModal();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
        <button
          onClick={openModal}
          className="px-6 py-2 font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-transform duration-200 hover:scale-105 shadow-lg shadow-emerald-500/10"
        >
          Request a Match
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Active Requests</h2>
        {matchRequests.length > 0 ? (
          <div className="space-y-4">
            {matchRequests.map((req, index) => (
              <div key={index} className="bg-slate-700/50 p-4 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-bold text-emerald-400">{req.sport} - <span className="text-slate-300 font-medium">{req.level}</span></p>
                  <p className="text-sm text-slate-400">{req.location}</p>
                   <p className="text-sm text-slate-400">{req.dateFrom} to {req.dateTo}</p>
                </div>
                 <span className="text-xs font-semibold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                    Pending
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-300">No active requests</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by creating a new match request.</p>
          </div>
        )}
      </div>

      <MatchRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
};

export default Dashboard;
