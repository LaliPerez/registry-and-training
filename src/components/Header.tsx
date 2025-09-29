// Fix: Replaced placeholder content with the actual Header component implementation.
import React from 'react';

interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-slate-100">{title}</h1>
      <p className="text-slate-400 mt-2">{subtitle}</p>
    </header>
  );
};

export default Header;
