import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import LogoutButton from "@/components/organisms/LogoutButton";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigation = [
    { name: "Inicio", href: "/", icon: "Home" },
    { name: "Propiedades", href: "/properties", icon: "Building" },
    { name: "Calculadora", href: "/mortgage", icon: "Calculator" }
  ];

  const adminNavigation = [
    { name: "Panel Admin", href: "/admin", icon: "Settings" },
    { name: "CRM", href: "/crm", icon: "Users" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Home" className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold gradient-text">Casa Vista</h1>
              <p className="text-xs text-secondary-600">Premium Real Estate</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-secondary-700 hover:text-primary-600"
                }`}
              >
                <ApperIcon name={item.icon} size={16} className="mr-2" />
                {item.name}
              </Link>
            ))}
            
            {isAdmin && adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-secondary-700 hover:text-primary-600"
                }`}
              >
                <ApperIcon name={item.icon} size={16} className="mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

{/* Admin Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button
              variant={isAdmin ? "primary" : "outline"}
              size="sm"
              onClick={() => setIsAdmin(!isAdmin)}
              className="hidden sm:flex"
            >
              <ApperIcon name="Shield" size={16} className="mr-2" />
              {isAdmin ? "Admin" : "Usuario"}
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="Phone" size={16} className="mr-2" />
              Contacto
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-secondary-200 py-4"
          >
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-600"
                      : "text-secondary-700 hover:bg-secondary-50"
                  }`}
                >
                  <ApperIcon name={item.icon} size={16} className="mr-3" />
                  {item.name}
                </Link>
              ))}
              
              {isAdmin && adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-600"
                      : "text-secondary-700 hover:bg-secondary-50"
                  }`}
>
                  <ApperIcon name={item.icon} size={16} className="mr-3" />
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 space-y-2 border-t border-secondary-200">
                <Button
                  variant={isAdmin ? "primary" : "outline"}
                  onClick={() => {
                    setIsAdmin(!isAdmin);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  <ApperIcon name="Shield" size={16} className="mr-2" />
                  {isAdmin ? "Modo Admin" : "Modo Usuario"}
                </Button>
                <Button variant="outline" className="w-full">
                  <ApperIcon name="Phone" size={16} className="mr-2" />
                  Contacto
                </Button>
                <div className="w-full">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;