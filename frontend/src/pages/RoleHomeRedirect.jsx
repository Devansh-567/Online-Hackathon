import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRoleToNavKey, DEFAULT_PAGE_BY_NAV } from '../utils/constants.js';

/** Redirects `/` to the default prototype page for the signed-in role. */
export function RoleHomeRedirect() {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) return;
    const key = apiRoleToNavKey(user.role);
    nav(`/${DEFAULT_PAGE_BY_NAV[key]}`, { replace: true });
  }, [user, nav]);

  return null;
}
