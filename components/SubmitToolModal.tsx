
import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CATEGORIES = [
  'AI & Trends',
  'Ad Mockups',
  'Technical SEO',
  'Marketing Calculators',
  'SaaS & Business',
  'Tax & Finance',
  'Design & Creative',
  'Other'
];

const PRICING_TYPES = [
  'Free',
  'Freemium',
  'Paid',
  'Free Trial',
  'Contact for Pricing'
];

const SubmitToolModal: React.FC<SubmitToolModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    logoUrl: '',
    category: '',
    pricingType: '',
    highlights: '',
    twitterUrl: '',
    githubUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.length < 2) newErrors.name = 'Minimum 2 characters required';
    if (formData.description.length < 10) newErrors.description = 'Minimum 10 characters required';
    if (!formData.websiteUrl) newErrors.websiteUrl = 'Website URL is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.pricingType) newErrors.pricingType = 'Please select a pricing type';
    // Highlights optional for smoother testing
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Pass data to parent
    onSubmit(formData);

    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset after success
    setTimeout(() => {
        setIsSuccess(false);
        setFormData({
            name: '', description: '', websiteUrl: '', logoUrl: '', 
            category: '', pricingType: '', highlights: '', twitterUrl: '', githubUrl: ''
        });
        onClose();
    }, 1500);
  };

  const inputClass = (name: string) => `
    w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border rounded-xl text-brand-dark 
    focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all 
    ${errors[name] ? 'border-red-500' : 'border-brand-medium/40'}
  `;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-brand-medium/20">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-brand-medium/20 bg-brand-light/30">
          <div>
            <h2 className="text-xl font-bold text-brand-dark">Submit New Tool</h2>
            <p className="text-sm text-brand-dark/60 mt-1">Add a new tool to the directory (Local Simulation).</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-brand-dark/40 hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
            {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-2">Tool Added!</h3>
                    <p className="text-brand-dark/60">Your tool has been added to the local list.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-brand-dark mb-2">Tool Name *</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter tool name"
                            className={inputClass('name')}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-brand-dark mb-2">Description *</label>
                        <textarea 
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the tool..."
                            className={`${inputClass('description')} resize-none`}
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">Website URL *</label>
                            <input 
                                type="url" 
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className={inputClass('websiteUrl')}
                            />
                            {errors.websiteUrl && <p className="text-xs text-red-500 mt-1">{errors.websiteUrl}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">Category *</label>
                            <div className="relative">
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`${inputClass('category')} appearance-none`}
                                >
                                    <option value="">Select a category</option>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-brand-dark/50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">Pricing Type *</label>
                            <div className="relative">
                                <select 
                                    name="pricingType"
                                    value={formData.pricingType}
                                    onChange={handleChange}
                                    className={`${inputClass('pricingType')} appearance-none`}
                                >
                                    <option value="">Select pricing type</option>
                                    {PRICING_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-brand-dark/50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {errors.pricingType && <p className="text-xs text-red-500 mt-1">{errors.pricingType}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">Highlights</label>
                            <input 
                                type="text" 
                                name="highlights"
                                value={formData.highlights}
                                onChange={handleChange}
                                placeholder="Free plan, API access (comma separated)"
                                className={inputClass('highlights')}
                            />
                        </div>
                    </div>
                </form>
            )}
        </div>

        {/* Footer */}
        {!isSuccess && (
            <div className="p-6 border-t border-brand-medium/20 bg-brand-light/30 flex justify-end gap-3">
                <button 
                    onClick={onClose}
                    className="px-6 py-2.5 bg-brand-surface border border-brand-medium/30 rounded-xl text-brand-dark font-bold hover:bg-brand-light transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                        </>
                    ) : (
                        'Add Tool'
                    )}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SubmitToolModal;
