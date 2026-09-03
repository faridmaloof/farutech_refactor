import React, { useState } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: string | number;
  permission?: string;
}

export interface UserMenu {
  name: string;
  email: string;
  avatar?: string;
  items: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    path?: string;
  }[];
}

export interface TopNavProps {
  logo?: React.ReactNode;
  brandName?: string;
  menuItems: MenuItem[];
  userMenu?: UserMenu;
  onMenuClick?: (item: MenuItem) => void;
  onUserAction?: (action: string) => void;
  className?: string;
  permissions?: string[];
}

/**
 * TopNav - Menú horizontal basado en permisos
 * 
 * Características:
 * - Basado en permisos para mostrar/ocultar items
 * - Soporte para submenús anidados
 * - Menú de usuario con perfil y configuración
 * - Responsive con menú hamburguesa en móvil
 * - Badges para notificaciones
 * - Psicología del color aplicada
 */
export const TopNav: React.FC<TopNavProps> = ({
  logo,
  brandName = 'Farutech',
  menuItems = [],
  userMenu,
  onMenuClick,
  onUserAction,
  className = '',
  permissions = [],
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtrar items por permisos
  const filterByPermissions = (items: MenuItem[]): MenuItem[] => {
    return items.filter((item) => {
      if (!item.permission) return true;
      return permissions.includes(item.permission);
    }).map((item) => ({
      ...item,
      children: item.children ? filterByPermissions(item.children) : undefined,
    }));
  };

  const filteredMenuItems = filterByPermissions(menuItems);

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;
    
    if (item.children && item.children.length > 0) {
      setActiveMenu(activeMenu === item.id ? null : item.id);
    } else {
      onMenuClick?.(item);
      setMobileMenuOpen(false);
    }
  };

  const handleUserAction = (action: string) => {
    onUserAction?.(action);
    setShowUserDropdown(false);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeMenu === item.id;

    return (
      <div key={item.id} style={{ position: 'relative' }}>
        <div
          className={`topnav__item ${isActive ? 'topnav__item--active' : ''} ${item.disabled ? 'topnav__item--disabled' : ''}`}
          style={{ paddingLeft: `${level * 1 + 0.75}rem` }}
          onClick={() => handleItemClick(item)}
        >
          {item.icon && <span className="topnav__item-icon">{item.icon}</span>}
          <span className="topnav__item-label">{item.label}</span>
          {item.badge && (
            <span className="topnav__badge">{item.badge}</span>
          )}
          {hasChildren && (
            <svg
              className={`topnav__chevron ${isActive ? 'topnav__chevron--rotated' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </div>
        
        {hasChildren && isActive && (
          <div className="topnav__submenu">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`topnav ${className}`}>
      <style>{`
        .topnav {
          background: white;
          border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
          box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .topnav__container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .topnav__left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .topnav__logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--color-gray-900, #111827);
        }

        .topnav__logo-img {
          height: 36px;
          width: auto;
        }

        .topnav__brand {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary-600, #10b981);
        }

        .topnav__menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .topnav__item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md, 0.375rem);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-gray-600, #4b5563);
          position: relative;
        }

        .topnav__item:hover:not(.topnav__item--disabled) {
          background: var(--color-gray-50, #f9fafb);
          color: var(--color-gray-900, #111827);
        }

        .topnav__item--active {
          background: var(--color-primary-50, #ecfdf5);
          color: var(--color-primary-700, #047857);
        }

        .topnav__item--disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .topnav__item-icon {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .topnav__badge {
          background: var(--color-error, #ef4444);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          min-width: 20px;
          text-align: center;
        }

        .topnav__chevron {
          transition: transform 0.2s ease;
        }

        .topnav__chevron--rotated {
          transform: rotate(180deg);
        }

        .topnav__submenu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: var(--radius-md, 0.375rem);
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
          min-width: 200px;
          z-index: 1001;
          overflow: hidden;
        }

        .topnav__right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .topnav__user {
          position: relative;
        }

        .topnav__user-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-full, 9999px);
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
        }

        .topnav__user-button:hover {
          background: var(--color-gray-50, #f9fafb);
        }

        .topnav__avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-primary-200, #a7f3d0);
        }

        .topnav__user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .topnav__user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-gray-900, #111827);
        }

        .topnav__user-email {
          font-size: 0.75rem;
          color: var(--color-gray-500, #6b7280);
        }

        .topnav__dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: var(--radius-md, 0.375rem);
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
          min-width: 220px;
          z-index: 1001;
          overflow: hidden;
        }

        .topnav__dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 0.875rem;
          color: var(--color-gray-700, #374151);
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .topnav__dropdown-item:hover {
          background: var(--color-gray-50, #f9fafb);
        }

        .topnav__dropdown-divider {
          height: 1px;
          background: var(--color-gray-200, #e5e7eb);
          margin: 0.5rem 0;
        }

        .topnav__mobile-toggle {
          display: none;
          padding: 0.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius-md, 0.375rem);
        }

        .topnav__mobile-toggle:hover {
          background: var(--color-gray-50, #f9fafb);
        }

        .topnav__mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
          padding: 1rem;
          max-height: 80vh;
          overflow-y: auto;
        }

        .topnav__mobile-menu--open {
          display: block;
        }

        @media (max-width: 768px) {
          .topnav__menu {
            display: none;
          }

          .topnav__mobile-toggle {
            display: block;
          }

          .topnav__user-info {
            display: none;
          }
        }
      `}</style>

      <div className="topnav__container">
        {/* Left: Logo + Menu */}
        <div className="topnav__left">
          {/* Logo */}
          <a href="/" className="topnav__logo">
            {logo || (
              <>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: 'var(--radius-md, 0.375rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.25rem',
                  }}
                >
                  F
                </div>
                <span className="topnav__brand">{brandName}</span>
              </>
            )}
          </a>

          {/* Menú desktop */}
          <div className="topnav__menu">
            {filteredMenuItems.map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* Right: User menu */}
        <div className="topnav__right">
          {userMenu && (
            <div className="topnav__user">
              <button
                className="topnav__user-button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                {userMenu.avatar ? (
                  <img src={userMenu.avatar} alt={userMenu.name} className="topnav__avatar" />
                ) : (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                    }}
                  >
                    {userMenu.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="topnav__user-info">
                  <span className="topnav__user-name">{userMenu.name}</span>
                  <span className="topnav__user-email">{userMenu.email}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {showUserDropdown && (
                <div className="topnav__dropdown">
                  {userMenu.items.map((item) => (
                    <React.Fragment key={item.id}>
                      {item.id === 'divider' ? (
                        <div className="topnav__dropdown-divider" />
                      ) : (
                        <button
                          className="topnav__dropdown-item"
                          onClick={() => handleUserAction(item.id)}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="topnav__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="topnav__mobile-menu topnav__mobile-menu--open">
          {filteredMenuItems.map((item) => renderMenuItem(item))}
        </div>
      )}
    </nav>
  );
};

export default TopNav;
