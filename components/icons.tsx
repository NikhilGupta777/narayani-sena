
import React from 'react';

export const BrandLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
        <defs>
            <radialGradient id="g" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f1d88b" stopOpacity="1" />
                <stop offset="100%" stopColor="#f1d88b" stopOpacity="0" />
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="18" fill="url(#g)"></circle>
        <path d="M32 10l4 7 8 2-6 6 2 8-8-4-8 4 2-8-6-6 8-2z" fill="#f1d88b" />
    </svg>
);

export const FeatureIcon1: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="w-7 h-7 text-[#f1d88b]" viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fill="currentColor" d="M12 2l2.5 4.5L20 8l-4 3.5.9 5.5L12 14l-4.9 3 1-5.5L4 8l5.5-1.5L12 2z" />
    </svg>
);

export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="w-7 h-7 text-[#aeb3c7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

export const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="w-7 h-7 text-[#f1d88b]" viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fill="currentColor" d="M17 10.5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z" />
    </svg>
);

export const EmailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="w-7 h-7 text-[#8bb8ff]" viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="w-7 h-7 text-[#aeb3c7]" viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fill="currentColor" d="M5 20h14v-2H5v2zm7-18L5.33 9h3.5v6h4.34V9h3.5L12 2z" />
    </svg>
);

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="w-7 h-7 text-[#f1d88b]" viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path fill="currentColor" d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
    </svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M10.868 2.884c.321.64.321 1.415 0 2.055L7.83 10.521l3.038 5.581c.321.64.094 1.455-.546 1.776-.64.321-1.455.094-1.776-.546L5.48 11.521l-3.038-5.581c-.321-.64-.094-1.455.546-1.776.64-.321 1.455-.094 1.776.546L7.83 9.479l3.038-5.595c.321-.64 1.135-.865 1.776-.546zM15.48 11.521l-3.038-5.581c-.321-.64-.094-1.455.546-1.776.64-.321 1.455-.094 1.776.546l3.038 5.581c.321.64.094 1.455-.546 1.776-.64.321-1.455.094-1.776-.546L15.48 9.479l-3.038 5.595c-.321.64-1.135.865-1.776.546.321.64.321 1.415 0 2.055l-3.038 5.581c-.321.64-.094 1.455.546 1.776.64.321 1.455-.094 1.776-.546l3.038-5.581 3.038 5.581c.321.64 1.135.865 1.776.546.64-.321.865-1.135.546-1.776l-3.038-5.581z" clipRule="evenodd" />
    </svg>
);

export const NoSymbolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
    </svg>
);

export const BrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

export const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" />
    </svg>
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.75 10.25a.75.75 0 000-1.5h5.5a.75.75 0 000 1.5h-5.5z" clipRule="evenodd" />
    </svg>
);