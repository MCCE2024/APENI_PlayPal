
import type { FormEvent} from 'react';
import React, { useState, useEffect } from 'react';
import type { MatchRequest } from '../types';
import { Level } from '../types';
import { SPORTS, LEVELS } from '../constants';
import { CloseIcon } from './icons/CloseIcon';
import { TennisIcon } from './icons/TennisIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { LocationIcon } from './icons/LocationIcon';

interface MatchRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<MatchRequest, '_id'>) => void;
}

// NOTE: Define InputGroup outside of the component to keep a stable identity across renders.
// Defining it inside causes React to treat it as a new component each render and may remount
// its subtree, leading to input focus loss.
const InputGroup: React.FC<{ label: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ label, children, icon }) => (
  <div>
    <label className="flex items-center mb-2 text-sm font-medium text-slate-300">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

const MatchRequestModal: React.FC<MatchRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [sport, setSport] = useState<string>(SPORTS[0]);
  const [level, setLevel] = useState<Level>(Level.INTERMEDIATE);
  const [location, setLocation] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [timeFrom, setTimeFrom] = useState<string>('10:00');
  const [timeTo, setTimeTo] = useState<string>('12:00');
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const dateTimeStart = new Date(`${dateFrom}T${timeFrom}`).toISOString();
    const dateTimeEnd = new Date(`${dateTo}T${timeTo}`).toISOString();
    onSubmit({ sport, level, location, dateTimeStart, dateTimeEnd });
  };

  if (!isOpen) return null;

  const commonInputClasses = "w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg m-4 border border-slate-700 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Request a Match</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Sport" icon={<TennisIcon className="w-5 h-5 text-slate-400"/>}>
              <select value={sport} onChange={(e) => setSport(e.target.value)} className={commonInputClasses}>
                {SPORTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </InputGroup>
            <InputGroup label="Skill Level" icon={<TrophyIcon className="w-5 h-5 text-slate-400"/>}>
              <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className={commonInputClasses}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </InputGroup>
          </div>
          
          <InputGroup label="Location" icon={<LocationIcon className="w-5 h-5 text-slate-400"/>}>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Central Park Courts" required className={commonInputClasses} />
          </InputGroup>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Date From">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} required className={commonInputClasses} />
            </InputGroup>
            <InputGroup label="Date To">
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} required className={commonInputClasses} />
            </InputGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Time From">
              <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} required className={commonInputClasses} />
            </InputGroup>
            <InputGroup label="Time To">
              <input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} required className={commonInputClasses} />
            </InputGroup>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatchRequestModal;
