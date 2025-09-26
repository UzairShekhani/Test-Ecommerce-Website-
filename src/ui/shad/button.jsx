import { cva } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const styles = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white hover:bg-gray-800',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
      },
      size: {
        md: 'h-10 px-4',
        sm: 'h-9 px-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export function Button({ className = '', variant, size, ...props }) {
  return <button className={twMerge(styles({ variant, size }), className)} {...props} />
}



