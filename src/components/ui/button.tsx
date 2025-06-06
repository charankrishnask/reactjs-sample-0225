// src/components/ui/button.tsx
import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={classNames(
        'rounded px-4 py-2 font-semibold text-white shadow',
        {
          'bg-blue-600 hover:bg-blue-700': variant === 'primary',
          'bg-gray-600 hover:bg-gray-700': variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  );
}
