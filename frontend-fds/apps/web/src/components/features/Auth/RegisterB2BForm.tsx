'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { API } from '../../../api';
import Link from 'next/link';

export function RegisterB2BForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    rut: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.Auth.registerClient(formData);
      setStatus('Company successfully registered. You can now login.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">B2B Registration</h2>
          <p className="mt-2 text-sm text-slate-600">
            Create your company account to start requesting manufacturing Quotes.
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Company Name</label>
            <input required type="text" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Company RUT</label>
            <input required type="text" placeholder="12345678-9" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Corporate Email</label>
            <input required type="email" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input required type="password" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          {status && (
             <div className={`text-sm font-medium p-3 rounded-md border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
               {status}
             </div>
          )}

          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Registering...' : 'Register Company'}
          </button>
          
          <div className="text-center mt-4">
             <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
