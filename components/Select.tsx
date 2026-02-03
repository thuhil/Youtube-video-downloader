import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          className={`
            w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 px-3
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
            transition-all duration-200 appearance-none cursor-pointer
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};