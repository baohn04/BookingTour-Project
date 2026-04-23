import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../../../utils/cookie';

function PrivateRoutesAdmin() {
    const token = getCookie('accessToken');

    return token ? <Outlet /> : <Navigate to="/admin/login" />;
}

export default PrivateRoutesAdmin;
