import React from 'react';

export type BoundaryContextValue = { showBoundary: (error: Error) => void };

export const BoundaryContext = React.createContext<BoundaryContextValue | null>(null);
