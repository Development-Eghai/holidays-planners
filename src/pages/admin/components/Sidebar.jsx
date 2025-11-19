import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, MapPin, PlusCircle, Layers, Database, 
    Users, DollarSign, FileText, LogOut, ChevronLeft, Briefcase,
    Receipt as InvoiceIcon, Trash2
} from 'lucide-react';
import '../css/Sidebar.css';

const sidebarGroups = [
    {
        title: 'OVERVIEW',
        modules: [
            { name: 'Dashboard', path: '/admin/dashboard/overview', icon: LayoutDashboard },
        ]
    },
    {
        title: 'Trip Management', 
        modules: [
            { name: 'Add New Trip', path: '/admin/dashboard/trip-management/list', icon: PlusCircle }, 
            { name: 'Add Destination', path: '/admin/dashboard/add-destination', icon: MapPin },
            { name: 'Add Activity', path: '/admin/dashboard/add-activity', icon: Layers },
            { name: 'Add Categories', path: '/admin/dashboard/add-categories', icon: Database },
        ]
    },
    {
        title: 'Travel CRM',
        modules: [
            { name: 'Lead Management', path: '/admin/dashboard/lead-management', icon: Users },
            { name: 'Lead Trash', path: '/admin/dashboard/lead-trash', icon: Trash2 },

            { name: 'Quotation Management', path: '/admin/dashboard/quotations', icon: DollarSign },
            { name: 'Quotation Trash', path: '/admin/dashboard/quotations/trash', icon: Trash2 },

            { name: 'Invoice Management', path: '/admin/dashboard/invoice-management', icon: InvoiceIcon },
        ]
    }
];

export default function Sidebar({ isOpen, toggleSidebar, onLogout }) {
    const location = useLocation();

    const isActive = (path) => {
        if (location.pathname === path) return true;

        if (path === '/admin/dashboard/add-destination' &&
            location.pathname.startsWith('/admin/dashboard/destination-create')) {
            return true;
        }

        if (path === '/admin/dashboard/trip-management/list' &&
            location.pathname.startsWith('/admin/dashboard/trip-management/create')) {
            return true;
        }

        return location.pathname.startsWith(path);
    };

    return (
        <div className={`sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <nav className="sidebar-menu">
                {sidebarGroups.map(group => (
                    <div key={group.title}>
                        <div className={`menu-group-title ${!isOpen ? 'text-center' : ''}`}>
                            {isOpen ? group.title : group.title.split(' ').map(w => w.charAt(0)).join('')}
                        </div>

                        {group.modules.map(module => (
                            <Link
                                key={module.path}
                                to={module.path}
                                className={`menu-item ${isActive(module.path) ? 'active' : ''}`}
                                title={!isOpen ? module.name : ''}
                            >
                                <module.icon className="menu-icon" />
                                {isOpen && <span className="menu-item-text">{module.name}</span>}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout}>
                    <LogOut className="menu-icon" />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}