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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        // Prevent click event from bubbling up
        e.stopPropagation();
      }}
    >
      <div 
        className={`flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 hover:border-b ${isOpen ? 'border-b' : ''}`}
        onClick={toggleDropdown}
      >
        <Link
          href="/work"
          rel="noopener noreferrer"
          onClick={(e) => {
            // Only follow the link if dropdown is not open
            if (isOpen) {
              e.preventDefault();
            }
          }}
        >
          Work
        </Link>
      </div>
      
      <div 
        className={`absolute top-full mt-1 lg:left-0 lg:right-auto right-0 lg:transform-none min-w-[150px] 
                    bg-white dark:bg-black z-20 py-1 shadow-sm
                    transition-all duration-200 ease-in-out transform 
                    ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        {projects.map((project) => (
          <div 
            key={project.id}
            className="transition-all duration-200 ease-in-out"
            style={{ 
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateX(0)' : 'translateX(-5px)',
              transitionDelay: '0.05s'
            }}
          >
            <Link
              href={`/work/${project.id}`}
              className="block px-4 py-1.5 whitespace-nowrap hover:border-b border-transparent text-sm"
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