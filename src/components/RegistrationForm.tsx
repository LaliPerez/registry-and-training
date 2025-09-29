// Fix: Replaced placeholder content with the actual RegistrationForm component implementation.
import React, { useState, useEffect } from 'react';
import { RegistrationData, FormErrors } from '../types';

interface RegistrationFormProps {
    initialData: Partial<RegistrationData> | null;
    onSubmit: (data: RegistrationData) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<RegistrationData>({
        fullName: '',
        company: '',
        dni: '',
        phone: '',
        email: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.company.trim()) newErrors.company = 'La empresa es requerida.';
        if (!/^\d{7,8}$/.test(formData.dni)) newErrors.dni = 'DNI inválido (debe contener 7 u 8 dígitos).';
        
        // Optional fields validation: only validate if not empty
        if (formData.phone && !/^\d{8,15}$/.test(formData.phone)) {
            newErrors.phone = 'Número de celular inválido.';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-3">Complete sus Datos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Read Only) */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1">Nombre y Apellido</label>
                    <input type="text" name="fullName" value={formData.fullName} className="w-full px-4 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-slate-300 transition" readOnly />
                </div>
                
                {/* Company (Required) */}
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">Empresa</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Ingrese el nombre de la empresa" />
                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>

                {/* DNI (Required) */}
                 <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-slate-300 mb-1">DNI</label>
                    <input type="text" name="dni" value={formData.dni} onChange={handleChange} className="w-full px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Sin puntos ni espacios" />
                    {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
                </div>

                {/* Phone (Optional) */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Celular <span className="text-slate-400">(Opcional)</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Email (Optional) */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email <span className="text-slate-400">(Opcional)</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="pt-4">
                     <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                        Confirmar Datos e Ir a Firmar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
