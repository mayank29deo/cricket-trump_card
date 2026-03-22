import React from 'react'

const variantClasses = {
  primary: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 shadow-lg shadow-emerald-900/40',
  secondary: 'bg-transparent hover:bg-emerald-900/30 text-emerald-400 border border-emerald-600',
  danger: 'bg-red-700 hover:bg-red-600 text-white border border-red-600',
  ghost: 'bg-transparent hover:bg-white/10 text-slate-300 border border-transparent',
  gold: 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-500 shadow-lg shadow-amber-900/40'
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
  xl: 'px-9 py-4 text-xl'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        font-rajdhani font-semibold tracking-wide rounded-lg
        transition-all duration-200 transform
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed transform-none' : 'hover:scale-105 active:scale-95'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
