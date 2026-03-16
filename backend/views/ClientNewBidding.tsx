import { Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ViewType } from '../types';

interface ClientNewBiddingProps {
    onViewChange: (view: ViewType) => void;
}

export function ClientNewBidding({ onViewChange }: ClientNewBiddingProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        material: 'PLA',
        color: 'Blue',
        tolerance: '±0.1mm',
        quantity: 1,
        details: '',
        acceptNDA: false
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadedFile(e.dataTransfer.files[0].name);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0].name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadedFile || !formData.acceptNDA) return;

        setShowSuccess(true);
        setTimeout(() => {
            onViewChange('client-dashboard');
        }, 2000);
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                        <Check className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Work Order Created!</h2>
                    <p className="text-slate-600 mb-6">
                        Your request has been published. Manufacturers will start submitting offers shortly.
                    </p>
                    <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">Request Custom Manufacturing</h1>
                        <p className="text-slate-600">Upload your 3D model and specify requirements to receive quotes</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                3D Model File
                            </label>
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${dragActive
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : uploadedFile
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-slate-300 bg-slate-50 hover:border-indigo-400'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept=".stl,.obj"
                                    onChange={handleFileInput}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {uploadedFile ? (
                                    <>
                                        <FileUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                        <p className="text-green-700 font-semibold mb-1">{uploadedFile}</p>
                                        <p className="text-sm text-slate-600">File uploaded successfully</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-700 font-semibold mb-1">
                                            Drag and drop your 3D file here
                                        </p>
                                        <p className="text-sm text-slate-500">or click to browse</p>
                                        <p className="text-xs text-slate-400 mt-2">Supports .STL and .OBJ files</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Material
                                </label>
                                <select
                                    value={formData.material}
                                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                >
                                    <option value="PLA">PLA</option>
                                    <option value="ABS">ABS</option>
                                    <option value="PETG">PETG</option>
                                    <option value="Resin">Resin</option>
                                    <option value="Nylon">Nylon</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Color
                                </label>
                                <select
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                >
                                    <option value="Blue">Blue</option>
                                    <option value="Red">Red</option>
                                    <option value="Black">Black</option>
                                    <option value="White">White</option>
                                    <option value="Gray">Gray</option>
                                    <option value="Yellow">Yellow</option>
                                    <option value="Green">Green</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Tolerance
                                </label>
                                <select
                                    value={formData.tolerance}
                                    onChange={(e) => setFormData({ ...formData, tolerance: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                >
                                    <option value="±0.05mm">±0.05mm (High Precision)</option>
                                    <option value="±0.1mm">±0.1mm (Standard)</option>
                                    <option value="±0.2mm">±0.2mm (Economy)</option>
                                    <option value="±0.5mm">±0.5mm (Draft)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Additional Details
                            </label>
                            <textarea
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                rows={4}
                                placeholder="Describe specific requirements, intended use, or any special instructions..."
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                            />
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-amber-900 mb-2">Confidentiality Agreement</h3>
                                    <p className="text-sm text-amber-800 mb-4">
                                        All manufacturers must sign an NDA before accessing your design files. Your intellectual property is protected throughout the entire process.
                                    </p>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.acceptNDA}
                                            onChange={(e) => setFormData({ ...formData, acceptNDA: e.target.checked })}
                                            className="w-5 h-5 text-indigo-600 border-amber-300 rounded focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-amber-900">
                                            I accept the confidentiality terms and NDA requirements
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!uploadedFile || !formData.acceptNDA}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-lg"
                        >
                            Generate Work Order & Request Quotes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
