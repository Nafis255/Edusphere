import React, { ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'text-white shadow-lg gradient-primary hover:gradient-primary-hover border-none', // Default Biru
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent',
        ghost: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-transparent',
        outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
        
        // 👇 TAMBAHKAN DUA VARIAN INI:
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border-none',
        success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm border-none',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-sm',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={twMerge(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };