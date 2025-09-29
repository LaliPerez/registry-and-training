// Fix: Replaced placeholder content with the actual AdminPanel component implementation.
import React, { useState, useEffect } from 'react';
import { CompletedRegistration } from '../types';

declare const jspdf: any;

interface AdminPanelProps {
  driveLinks: string[];
  registrations: CompletedRegistration[];
  onAddLinks: (links: string[]) => void;
  onRemoveLink: (index: number) => void;
  onClearLinks: () => void;
  onClearRegistrations: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ driveLinks, registrations, onAddLinks, onRemoveLink, onClearLinks, onClearRegistrations }) => {
    const [linksInput, setLinksInput] = useState('');
    const [shareableLink, setShareableLink] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (driveLinks.length > 0) {
            const baseUrl = window.location.href.split('?')[0].split('#')[0];
            // btoa expects a string, so we JSON.stringify the array first.
            // encodeURIComponent makes the base64 string safe for URLs.
            const encodedLinks = encodeURIComponent(btoa(JSON.stringify(driveLinks)));
            setShareableLink(`${baseUrl}?links=${encodedLinks}`);
        } else {
            setShareableLink('');
        }
    }, [driveLinks]);

    const handleAddClick = () => {
        const links = linksInput
            .split('\n')
            .map(link => link.trim())
            .filter(link => link.length > 0 && (link.startsWith('http://') || link.startsWith('https://')));

        if (links.length > 0) {
            onAddLinks(links);
            setLinksInput('');
        }
    };
    
    const handleDownloadPdf = () => {
        const doc = new jspdf.jsPDF();
        
        doc.text("Registros de Capacitación", 14, 16);
        
        doc.autoTable({
            startY: 22,
            head: [['Nombre y Apellido', 'Empresa', 'DNI', 'Celular', 'Email', 'Fecha Registro']],
            body: registrations.map(r => [
                r.fullName,
                r.company,
                r.dni,
                r.phone,
                r.email,
                r.registrationDate,
            ]),
        });

        doc.save('registros_capacitacion.pdf');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };

    return (
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-8">
            {/* Link Management Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-2">1. Gestionar Enlaces de Documentos</h2>
                <textarea
                    value={linksInput}
                    onChange={(e) => setLinksInput(e.target.value)}
                    placeholder="Pegue los enlaces aquí, uno por línea..."
                    className="w-full h-24 px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows={4}
                />
                <button
                    onClick={handleAddClick}
                    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition whitespace-nowrap"
                >
                    Añadir Enlaces
                </button>
                {driveLinks.length > 0 && (
                     <div className="space-y-2 pt-2">
                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {driveLinks.map((link, index) => (
                                <li key={index} className="flex items-center justify-between bg-slate-700 p-2 rounded-md">
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 truncate hover:underline text-sm pr-2">{link}</a>
                                    <button onClick={() => onRemoveLink(index)} className="text-red-400 hover:text-red-300 font-bold text-xl">&times;</button>
                                </li>
                            ))}
                        </ul>
                         <button onClick={onClearLinks} className="text-sm text-red-400 hover:underline">
                           Reiniciar carga de enlaces
                         </button>
                    </div>
                )}
            </div>

             {/* Shareable Link Section */}
            {shareableLink && (
                 <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-2">2. Compartir Capacitación</h2>
                    <p className="text-sm text-slate-400">Copie y envíe este enlace a los participantes para que se registren.</p>
                    <div className="flex space-x-2">
                        <input type="text" readOnly value={shareableLink} className="w-full px-3 py-2 bg-slate-700 text-slate-300 border border-slate-600 rounded-md shadow-sm" />
                        <button onClick={handleCopyLink} className="bg-slate-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-600 transition whitespace-nowrap">
                            {copied ? '¡Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Registrations Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-2">3. Registros</h2>
                {registrations.length > 0 ? (
                    <div className="text-center space-y-4">
                         <p className="text-slate-400">
                            Hay <span className="font-bold text-slate-100">{registrations.length}</span> participante(s) registrado(s).
                        </p>
                         <button
                            onClick={handleDownloadPdf}
                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                        >
                            Descargar Informe (PDF)
                        </button>
                        <div className="pt-2">
                            <p className="text-xs text-slate-500 mb-2">Para iniciar una nueva capacitación con una lista limpia.</p>
                             <button
                                onClick={onClearRegistrations}
                                className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                            >
                                Limpiar Registros
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400 text-center py-4">Aún no hay participantes registrados.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
