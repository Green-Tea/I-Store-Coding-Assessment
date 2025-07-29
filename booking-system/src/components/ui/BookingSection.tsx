import { ReactNode } from 'react'

interface BookingSectionProps {
  title?: string
  children: ReactNode
  className?: string
}

const BookingSection = ({ title, children, className = '' }: BookingSectionProps) => {
  return (
    <div className={`booking-section ${className}`}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  )
}

export default BookingSection