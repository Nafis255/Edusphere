import React, { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

// Terapkan props standar Input
export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        // Style dasar untuk input
        className={twMerge(
          'flex h-10 w-full rounded-md border border-gray-300',
          'bg-white py-2 text-sm',
          'text-gray-900',
          'placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };