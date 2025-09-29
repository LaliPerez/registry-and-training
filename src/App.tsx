// Fix: Replaced placeholder content with the actual App component implementation.
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import PreRegistrationForm from './components/PreRegistrationForm';
import FileViewer from './components/FileViewer';
import RegistrationForm from './components/RegistrationForm';
import SignaturePad from './components/SignaturePad';
import { RegistrationData, CompletedRegistration } from './types';

type View = 'user' | 'admin';
type UserStep = 'pre-registration' | 'file-view' | 'registration' | 'signature' | 'completed';

const App: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
    const [userStep, setUserStep] = useState<UserStep>('pre-registration');
    
    // Links are loaded from URL first, then localStorage, then default to empty
    const [driveLinks, setDriveLinks] = useState<string[]>([]);
    const [registrations, setRegistrations] = useState<CompletedRegistration[]>(() => {
        const saved = localStorage.getItem('registrations');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentRegistration, setCurrentRegistration] = useState<Partial<RegistrationData> | null>(null);

    // Effect to handle URL hash changes for navigation
    useEffect(() => {
        const handleHashChange = () => {
            setIsAdmin(window.location.hash === '#admin');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Effect to load links from URL or localStorage on initial load
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const linksParam = searchParams.get('links');
        if (linksParam) {
            try {
                const decodedLinks = JSON.parse(atob(decodeURIComponent(linksParam)));
                setDriveLinks(decodedLinks);
            } catch (error) {
                console.error("Failed to parse links from URL", error);
                // Fallback to localStorage if URL parsing fails
                const savedLinks = localStorage.getItem('driveLinks');
                if (savedLinks) {
                    setDriveLinks(JSON.parse(savedLinks));
                }
            }
        } else {
            const savedLinks = localStorage.getItem('driveLinks');
            if (savedLinks) {
                setDriveLinks(JSON.parse(savedLinks));
            }
        }
    }, []);

    // Effect to save admin data to localStorage
    useEffect(() => {
        if(isAdmin) {
            localStorage.setItem('driveLinks', JSON.stringify(driveLinks));
        }
        localStorage.setItem('registrations', JSON.stringify(registrations));
    }, [driveLinks, registrations, isAdmin]);


    const handleNavigate = (path: View) => {
        window.location.hash = path === 'admin' ? '#admin' : '';
    };

    // Admin Panel handlers
    const handleAddLinks = (links: string[]) => {
        setDriveLinks(prevLinks => [...new Set([...prevLinks, ...links])]);
    };
    
    const handleRemoveLink = (index: number) => {
        setDriveLinks(prevLinks => prevLinks.filter((_, i) => i !== index));
    };

    const handleClearLinks = () => {
        setDriveLinks([]);
    };

    const handleClearRegistrations = () => {
        if (window.confirm('¿Está seguro de que desea eliminar todos los registros? Esta acción no se puede deshacer.')) {
            setRegistrations([]);
        }
    };

    // User Flow handlers
    const handlePreRegistrationSuccess = (fullName: string) => {
        setCurrentRegistration({ fullName });
        if (driveLinks.length > 0) {
            setUserStep('file-view');
        } else {
            // Skip file view if no links are provided
            setUserStep('registration');
        }
    };
    
    const handleFilesViewed = () => {
        setUserStep('registration');
    };

    const handleRegistrationSubmit = (data: RegistrationData) => {
        setCurrentRegistration(data);
        setUserStep('signature');
    };
    
    const handleSignatureSave = (signatureDataUrl: string) => {
        if (currentRegistration && currentRegistration.fullName && currentRegistration.company && currentRegistration.dni) {
            const completedRegistration: CompletedRegistration = {
                fullName: currentRegistration.fullName,
                company: currentRegistration.company,
                dni: currentRegistration.dni,
                phone: currentRegistration.phone || '',
                email: currentRegistration.email || '',
                signatureDataUrl,
                registrationDate: new Date().toLocaleString('es-ES'),
            };
            setRegistrations(prev => [...prev, completedRegistration]);
            setUserStep('completed');
            setCurrentRegistration(null);
        }
    };
    
    const handleStartOver = () => {
        setUserStep('pre-registration');
    };

    const renderUserView = () => {
        switch (userStep) {
            case 'pre-registration':
                return <PreRegistrationForm onPreRegister={handlePreRegistrationSuccess} />;
            case 'file-view':
                return <FileViewer 
                            userName={currentRegistration?.fullName || ''} 
                            driveLinks={driveLinks} 
                            onFinishedViewing={handleFilesViewed} 
                        />;
            case 'registration':
                return <RegistrationForm initialData={currentRegistration} onSubmit={handleRegistrationSubmit} />;
            case 'signature':
                return <SignaturePad onSave={handleSignatureSave} />;
            case 'completed':
                return (
                    <div className="bg-slate-800 p-8 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-green-400 mb-4">¡Registro Completado!</h2>
                        <p className="text-slate-400 mb-6">Gracias por registrarse. Su asistencia ha sido confirmada.</p>
                        <button
                            onClick={handleStartOver}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition"
                        >
                            Realizar otro registro
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
            <div className="w-full max-w-2xl">
                <Header 
                    title={isAdmin ? "Panel de Administración" : "Registro de Capacitación"} 
                    subtitle={isAdmin ? "Gestione enlaces y vea los registros" : "Complete los pasos para confirmar su asistencia"} 
                />
                <main>
                    {!isAdmin ? renderUserView() : (
                        <AdminPanel 
                            driveLinks={driveLinks}
                            registrations={registrations}
                            onAddLinks={handleAddLinks}
                            onRemoveLink={handleRemoveLink}
                            onClearLinks={handleClearLinks}
                            onClearRegistrations={handleClearRegistrations}
                        />
                    )}
                </main>
                <Footer isAdmin={isAdmin} onNavigate={handleNavigate} />
            </div>
        </div>
    );
};

export default App;
