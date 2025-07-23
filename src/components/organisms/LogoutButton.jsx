import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logout();
    }
  };

  return (
    <div className="flex items-center gap-3">
      {user && (
        <span className="text-sm text-secondary-600 hidden md:block">
          Hola, {user.firstName || user.name || 'Usuario'}
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2 text-secondary-600 hover:text-secondary-800"
      >
        <ApperIcon name="LogOut" size={16} />
        <span className="hidden md:inline">Cerrar Sesión</span>
      </Button>
    </div>
  );
};

export default LogoutButton;