import React, { useState, forwardRef } from 'react';

// Using named export to match the import { Textarea } syntax
export const Textarea = forwardRef(({
  value,
  onChange,
  placeholder = "Type something...",
  rows = 4,
  disabled = false,
  label = "",
  error = false,
  errorMessage = "",
  success = false,
  successMessage = "",
  helperText = "",
  icon = null,
  className = "",
  maxLength,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);
  
  const handleChange = (e) => {
    onChange(e);
    setCharCount(e.target.value.length);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Dynamic classes based on state
  const baseClasses = "w-full px-4 py-3 rounded-xl border-2 bg-white transition-all duration-300 ease-in-out shadow-sm";
  
  const stateClasses = 
    disabled ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" :
    error ? "border-red-500 focus:border-red-600" :
    success ? "border-emerald-500 focus:border-emerald-600" :
    isFocused ? "border-blue-500 ring-4 ring-blue-500/20" : 
    "border-gray-300 hover:border-blue-400";
  
  const labelClasses = 
    `block mb-2 text-sm font-medium transition-colors duration-300 ${
      error ? "text-red-600" : 
      success ? "text-emerald-600" : 
      isFocused ? "text-blue-600" : "text-gray-700"
    }`;
  
  const iconClasses = 
    `absolute left-4 transition-colors duration-300 ${
      error ? "text-red-500" : 
      success ? "text-emerald-500" : 
      isFocused ? "text-blue-500" : "text-gray-400"
    }`;

  return (
    <div className={`${className} transition-all duration-300`}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`${iconClasses} top-3`}>
            {icon}
          </div>
        )}
        
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          className={`${baseClasses} ${stateClasses} ${
            icon ? "pl-12" : ""
          } resize-none focus:outline-none focus:ring-0 placeholder-gray-400`}
          {...props}
        />
        
        {maxLength && (
          <div className="absolute bottom-3 right-4 text-xs text-gray-500">
            {charCount}/{maxLength}
          </div>
        )}
      </div>
      
      {/* Helper text area */}
      <div className="mt-2 min-h-[20px]">
        {error && errorMessage && (
          <p className="text-red-600 text-sm animate-pulse">{errorMessage}</p>
        )}
        {success && successMessage && (
          <p className="text-emerald-600 text-sm">{successMessage}</p>
        )}
        {helperText && !error && !success && (
          <p className="text-gray-500 text-sm">{helperText}</p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = "Textarea";

// Also provide default export for flexibility
export default Textarea;