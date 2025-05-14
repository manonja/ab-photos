'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface WorkDropdownProps {
  projects: {
    id: string;
    title: string;
  }[];
}

export default function WorkDropdown({ projects }: WorkDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Set up a global click handler to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set up event listeners for other navbar items
  useEffect(() => {
    // Find all navbar links except our own
    const findNavbarLinks = () => {
      const allNavLinks = document.querySelectorAll('a[href="/news"], a[href="/about"], a[href="/contact"], a[href="/subscribe"]');
      return Array.from(allNavLinks);
    };

    // When hovering any other navbar item, close our dropdown
    const handleNavLinkHover = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    // Attach listeners to all other nav links
    const navLinks = findNavbarLinks();
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', handleNavLinkHover);
    });

    return () => {
      // Clean up listeners
      navLinks.forEach(link => {
        link.removeEventListener('mouseenter', handleNavLinkHover);
      });
    };
  }, [isOpen]);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Work header that toggles dropdown */}
      <div 
        className={`flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 ${isOpen ? 'border-b' : 'hover:border-b'}`}
        onClick={toggleDropdown}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span className="cursor-pointer">Work</span>
      </div>
      
      {/* Dropdown menu */}
      <div 
        className={`absolute top-full left-0 mt-1 lg:transform-none min-w-[150px] 
                  z-20 py-1 transition-all duration-200 ease-in-out transform
                  ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        {projects.map((project) => (
          <div key={project.id} className="transition-all duration-200 ease-in-out">
            <Link
              href={`/work/${project.id}`}
              className="block px-4 py-1.5 whitespace-nowrap text-sm"
              onClick={() => setIsOpen(false)}
            >
              <span className="inline-block border-b border-transparent hover:border-black dark:hover:border-white">
                {project.title}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 