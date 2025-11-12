import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, MapPin, PlusCircle, Layers, Database, 
    Users, DollarSign, FileText, LogOut, ChevronLeft, Briefcase,
    Receipt as InvoiceIcon 
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
            
            // Destination List View
            { name: 'Add Destination', path: '/admin/dashboard/add-destination', icon: MapPin },
            
            // Activity (Placeholder route retained)
            { name: 'Add Activity', path: '/admin/dashboard/add-activity', icon: Layers },
            
            // Categories List View
            { name: 'Add Categories', path: '/admin/dashboard/add-categories', icon: Database },
            
            // { name: 'Destination Type', path: '/admin/dashboard/destination-type', icon: FileText },
        ]
    },
    {
        title: 'Travel CRM',
        modules: [
            { name: 'Lead Management', path: '/admin/dashboard/lead-management', icon: Users },
            { name: 'Quotation Management', path: '/admin/dashboard/quotation-management', icon: DollarSign },
            { name: 'Invoice Management', path: '/admin/dashboard/invoice-management', icon: InvoiceIcon },
        ]
    }
];

export default function Sidebar({ isOpen, toggleSidebar, onLogout }) {
    const location = useLocation();
    
    // Logic to highlight parent link when on a sub-route (e.g., highlighting 'Add Destination' when on '/destination-create/:id')
    const isActive = (path) => {
        if (location.pathname === path) return true;
        
        // Match Add Destination base path for sub-routes (create/edit)
        if (path === '/admin/dashboard/add-destination' && location.pathname.startsWith('/admin/dashboard/destination-create')) {
            return true;
        }
        
        // Match Add New Trip base path for sub-routes (create/edit)
        if (path === '/admin/dashboard/trip-management/list' && location.pathname.startsWith('/admin/dashboard/trip-management/create')) {
            return true;
        }

        return location.pathname.startsWith(path);
    };

    return (
        <div className={`sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {/* ... (Functionality remains the same) ... */}
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
            {/* ... */}
        </div>
    );
}