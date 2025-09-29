import React from 'react';

interface FooterProps {
    isAdmin: boolean;
    onNavigate: (path: 'user' | 'admin') => void;
}

const Footer: React.FC<FooterProps> = ({ isAdmin, onNavigate }) => {

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: 'user' | 'admin') => {
      e.preventDefault();
      onNavigate(path);
  };

  return (
    <footer className="w-full mt-12 text-center text-slate-400 text-sm">
      <p>&copy; {new Date().getFullYear()} Mi Empresa S.A. Todos los derechos reservados.</p>
      <div className="mt-2">
        {isAdmin ? (
          <a 
            href="#" 
            onClick={(e) => handleLinkClick(e, 'user')} 
            className="text-blue-400 hover:underline"
          >
            Ir a la vista de usuario
          </a>
        ) : (
          <a 
            href="#admin" 
            onClick={(e) => handleLinkClick(e, 'admin')} 
            className="text-blue-400 hover:underline"
          >
            Ir al panel de administrador
          </a>
        )}
      </div>
    </footer>
  );
};

export default Footer;