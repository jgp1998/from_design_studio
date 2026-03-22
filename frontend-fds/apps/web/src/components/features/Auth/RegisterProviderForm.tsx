'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UploadCloud } from 'lucide-react';
import { API } from '../../../api';

export function RegisterProviderForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    capacityDescription: '',
    machinesCount: 1
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.Auth.registerProvider(formData);
      setStatus('Success! Your application has been submitted for administrative review.');
      setTimeout(() => router.push('/login'), 2000); // Decided to route to login on success for clarity
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Provider Onboarding</h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the FDS Network. We require verification of your farm capabilities.
          </p>
        </div>
        <form className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input required type="email" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input required type="password" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-slate-700">Capacity Description</label>
             <textarea rows={3} placeholder="Describe your 3D printers and materials supported..." className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.capacityDescription} onChange={e => setFormData({...formData, capacityDescription: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Number of Machines</label>
            <input required type="number" min="1" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.machinesCount} onChange={e => setFormData({...formData, machinesCount: Number(e.target.value)})} />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Legal Documents (SII / Constitución)</label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-indigo-400 transition-colors cursor-pointer text-center">
                <div className="space-y-1 text-center flex flex-col items-center">
                    <UploadCloud className="w-10 h-10 text-slate-400" />
                    <div className="text-sm text-slate-600">
                      <span className="text-indigo-600 font-medium">Upload a PDF file</span> or drag and drop
                    </div>
                </div>
            </div>
          </div>

          {status && (
             <div className={`md:col-span-2 text-sm font-medium p-3 rounded-md border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
               {status}
             </div>
          )}

          <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
