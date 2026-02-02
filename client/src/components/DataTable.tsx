import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface Action {
  label: string;
  onClick: (item: any) => void;
  color?: 'blue' | 'red' | 'green';
  icon?: React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  searchable?: boolean;
  searchFields?: string[];
  sortable?: boolean;
  loading?: boolean;
  empty?: React.ReactNode;
  rowClick?: (item: any) => void;
  pagination?: boolean;
  itemsPerPage?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  actions,
  searchable = true,
  searchFields = ['name'],
  sortable = true,
  loading = false,
  empty,
  rowClick,
  pagination = true,
  itemsPerPage = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = searchTerm
    ? data.filter((item) =>
        searchFields.some((field) =>
          String(item[field] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Sort
  let sortedData = [...filteredData];
  if (sortBy && sortable) {
    sortedData.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal > bVal ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // Paginate
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData;

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        {empty || <p className="text-gray-500">No data found</p>}
      </div>
    );
  }

  const getActionColor = (color?: string) => {
    const colors: Record<string, string> = {
      blue: 'text-blue-600 hover:bg-blue-50',
      red: 'text-red-600 hover:bg-red-50',
      green: 'text-green-600 hover:bg-green-50'
    };
    return colors[color || 'blue'] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Search */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 ${
                    column.sortable && sortable ? 'cursor-pointer select-none' : ''
                  } ${column.width || ''}`}
                  onClick={() => column.sortable && sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortable && sortBy === column.key && (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
                onClick={() => rowClick && rowClick(item)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-700">
                    {item[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(item);
                          }}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${getActionColor(
                            action.color
                          )}`}
                        >
                          {action.icon || action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({sortedData.length} total)
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
