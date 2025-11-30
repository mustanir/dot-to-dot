
import React from 'react';
import { BookMarked } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <BookMarked className="h-8 w-8 text-blue-600" />
                        <h1 className="ml-3 text-2xl font-bold text-slate-800 tracking-tight">
                            KDP Dot-to-Dot Book Generator
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
