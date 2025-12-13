import React from 'react';

// This component now renders null to definitively remove the paw print 
// icon from the entire application, even if other components still import it.
export const PawPrintIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
    return null;
};
