// src/components/ui/BookingSection.tsx
import { ReactNode } from 'react'

interface BookingSectionProps {
  title?: string
  children: ReactNode
  className?: string
}

const BookingSection = ({ title, children, className = '' }: BookingSectionProps) => {
  return (
    <div className={`card border-primary shadow-sm ${className}`} style={{
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      borderWidth: '2px'
    }}>
      <div className="card-body">
        {title && <h2 className="card-title text-primary fw-semibold mb-3">{title}</h2>}
        {children}
      </div>
    </div>
  )
}

export default BookingSection