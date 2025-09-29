// Fix: Replaced placeholder content with the actual FileViewer component implementation.
import React, { useState } from 'react';

interface FileViewerProps {
    userName: string;
    driveLinks: string[];
    onFinishedViewing: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ userName, driveLinks, onFinishedViewing }) => {
    const [visitedLinks, setVisitedLinks] = useState<Set<string>>(new Set());

    const handleLinkClick = (link: string) => {
        setVisitedLinks(prev => new Set(prev).add(link));
    };
    
    const allLinksVisited = visitedLinks.size === driveLinks.length;

    return (
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-slate-100 mb-2 border-b border-slate-700 pb-3">Documentos de Capacitación</h2>
            <p className="text-slate-400 mb-6">
                <span className="font-semibold text-slate-200">{userName}</span>, por favor, revise los siguientes documentos antes de continuar.
            </p>
            {driveLinks.length > 0 ? (
                <ul className="space-y-3 mb-8">
                    {driveLinks.map((link, index) => (
                        <li key={index} className="flex items-center bg-slate-700 p-3 rounded-md">
                            {visitedLinks.has(link) && <span className="text-green-400 font-bold mr-3">✅</span>}
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleLinkClick(link)}
                                className="text-blue-400 hover:underline font-medium break-all"
                            >
                                {`Documento ${index + 1}: Ver aquí`}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-slate-400 my-8">No hay documentos para mostrar. Puede continuar directamente.</p>
            )}
             <button
                onClick={onFinishedViewing}
                disabled={driveLinks.length > 0 && !allLinksVisited}
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {allLinksVisited ? 'He revisado los documentos, continuar' : 'Debe revisar todos los documentos'}
            </button>
        </div>
    );
};

export default FileViewer;
