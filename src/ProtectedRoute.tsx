import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    role: string;
    element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, element }) => {
    const authRole = localStorage.getItem('auth');

    if (authRole !== role) {
        return <Navigate to="/login" replace />;
    }

    return <>{element}</>;
};

export default ProtectedRoute;
