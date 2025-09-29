// Fix: Replaced placeholder content with the actual PreRegistrationForm component implementation.
import React, { useState } from 'react';

interface PreRegistrationFormProps {
    onPreRegister: (fullName: string) => void;
}

const PreRegistrationForm: React.FC<PreRegistrationFormProps> = ({ onPreRegister }) => {
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName.trim()) {
            setError('Por favor, ingrese su nombre y apellido.');
            return;
        }

        onPreRegister(fullName);
    };
    
    return (
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-3">Bienvenido/a</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1">
                        Ingrese su Nombre y Apellido para comenzar
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Ej: Juan Pérez"
                        required
                    />
                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                    Continuar
                </button>
            </form>
        </div>
    );
};

export default PreRegistrationForm;
