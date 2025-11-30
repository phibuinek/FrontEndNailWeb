import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  const variants = {
    primary: 'bg-vintage-gold text-white hover:bg-vintage-gold-hover',
    outline: 'border-2 border-vintage-gold text-vintage-gold hover:bg-vintage-gold hover:text-white',
    ghost: 'hover:bg-vintage-paper text-vintage-brown',
    rose: 'bg-vintage-rose text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'rounded-sm transition-all duration-200 font-serif tracking-wide cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
