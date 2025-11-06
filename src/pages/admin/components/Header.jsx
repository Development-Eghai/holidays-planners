import React, { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import '../css/Sidebar.css'; 

export default function Header({ isSidebarOpen, toggleSidebar, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // Adjusted header width dynamically based on sidebar state
  const headerStyle = {
    marginLeft: isSidebarOpen ? '280px' : '80px',
    transition: 'margin-left 0.3s ease',
    width: `calc(100% - ${isSidebarOpen ? '280px' : '80px'})`,
  };

  return (
    <>
      <header 
        className="fixed top-0 right-0 h-20 bg-white shadow-md z-40 flex items-center justify-between px-4 lg:px-6"
        style={headerStyle}
      >
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="text-gray-700 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-xl font-bold text-gray-800 lg:hidden">WanderLux</span>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-lg relative mr-auto ml-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips, hotels, leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Actions (Notifications, Profile) */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="p-2 lg:hidden text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
          >
            {isMobileSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
          </button>
          
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Profile/Avatar */}
          <div 
            onClick={onLogout} 
            className="flex items-center gap-2 p-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              A
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </header>

      {/* Mobile Search Input Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-x-0 top-20 bg-white p-4 shadow-lg lg:hidden z-40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search trips, hotels, leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}