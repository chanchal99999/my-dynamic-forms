// src/components/Sidebar.tsx

import React, { useState, useMemo } from 'react';
import SearchBar from './SearchBar';

// Re-defining interfaces here for self-containment, but ideally from a types.ts file
interface FormField {
  id: string; label: string; type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';
  options?: { value: string; label: string }[]; required?: boolean; defaultValue?: any;
}

interface ApiItem {
  id: string; name: string; formFields: FormField[];
}

interface SidebarProps {
  items: ApiItem[];
  onItemSelected: (item: ApiItem) => void;
  selectedItemId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ items, onItemSelected, selectedItemId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <div className="sidebar">
      <h2>EOS/OSP API</h2>
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {filteredItems.length === 0 && !searchTerm && (
        <p style={{ textAlign: 'center', color: '#bdc3c7' }}>No items loaded.</p>
      )}
      {filteredItems.length === 0 && searchTerm && (
        <p style={{ textAlign: 'center', color: '#bdc3c7' }}>No matching items found.</p>
      )}

      <ul className="item-list">
        {filteredItems.map(item => (
          <li
            key={item.id}
            onClick={() => onItemSelected(item)}
            className={selectedItemId === item.id ? 'selected' : ''}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;