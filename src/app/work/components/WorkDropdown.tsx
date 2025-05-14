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

  // Listen for clicks outside the dropdown to close it
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

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      // Only close when explicitly clicked outside (handled by useEffect)
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
              className="block px-4 py-1.5 whitespace-nowrap text-sm hover:border-b"
              onClick={() => setIsOpen(false)}
            >
              {project.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 