import React, { useState, useEffect } from 'react';
import { Contract, Customer } from '../types';
import { generateAMCReminderEmail } from '../services/geminiService';

interface GeminiEmailModalProps {
  contract: Contract;
  customer: Customer;
  onClose: () => void;
}

const GeminiEmailModal: React.FC<GeminiEmailModalProps> = ({ contract, customer, onClose }) => {
  const [emailContent, setEmailContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      setIsLoading(true);
      const content = await generateAMCReminderEmail(contract, customer);
      setEmailContent(content);
      setIsLoading(false);
    };
    fetchEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, customer]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const subject = emailContent.match(/Subject: (.*)/)?.[1] || 'AMC Renewal Reminder';
  const body = emailContent.split('\n\n').slice(1).join('\n\n');

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-primary-600 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <span className="text-2xl">✨</span>
             <h2 className="text-xl font-bold">AI Email Generator</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Drafting perfect email with Gemini...</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center mb-3 border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold uppercase text-slate-400 w-16">To</span>
                      <p className="text-slate-800 font-medium">{customer.email}</p>
                  </div>
                  <div className="flex items-center">
                      <span className="text-xs font-bold uppercase text-slate-400 w-16">Subject</span>
                      <p className="text-slate-800 font-medium">{subject}</p>
                  </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">{body}</pre>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-white border-t border-slate-100 flex justify-end space-x-3">
            <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">Cancel</button>
            <button 
                onClick={handleCopy} 
                disabled={isLoading} 
                className={`px-5 py-2.5 text-white rounded-lg font-medium shadow-lg transition-all flex items-center ${isCopied ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed'}`}
            >
              {isCopied ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Copied!
                  </>
              ) : 'Copy to Clipboard'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiEmailModal;