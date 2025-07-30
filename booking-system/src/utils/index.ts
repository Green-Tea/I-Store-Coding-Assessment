import { format, parseISO, differenceInDays, isBefore, isEqual } from 'date-fns'
import { PaymentFormData, Room, SearchFilters } from '@/types'

export const formatPrice = (price: number, currency = 'THB'): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd/MM/yyyy')
}

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = parseISO(checkIn)
  const checkOutDate = parseISO(checkOut)
  return differenceInDays(checkOutDate, checkInDate)
}

export const isDateAvailable = (room: Room, date: string): boolean => {
  return room.availability.includes(date)
}

export const isRoomAvailable = (room: Room, checkIn: string, checkOut: string): boolean => {
  const checkInDate = parseISO(checkIn)
  const checkOutDate = parseISO(checkOut)
  
  // Generate all dates between check-in and check-out (excluding check-out)
  const requiredDates: string[] = []
  let currentDate = checkInDate
  
  while (isBefore(currentDate, checkOutDate)) {
    requiredDates.push(format(currentDate, 'yyyy-MM-dd'))
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
  }
  
  // Check if all required dates are available
  return requiredDates.every(date => room.availability.includes(date))
}

export const filterRooms = (rooms: Room[], filters: SearchFilters): Room[] => {
  return rooms.filter(room => {
    // Check availability for the date range
    if (filters.checkIn && filters.checkOut) {
      if (!isRoomAvailable(room, filters.checkIn, filters.checkOut)) {
        return false
      }
    }
    
    // Check capacity
    if (filters.guests > room.capacity) {
      return false
    }
    
    // Check room type
    if (filters.roomType && filters.roomType !== 'all' && room.type !== filters.roomType) {
      return false
    }
    
    // Check price range
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange
      if (room.price < minPrice || room.price > maxPrice) {
        return false
      }
    }
    
    // Check amenities
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        room.amenities.includes(amenity)
      )
      if (!hasAllAmenities) {
        return false
      }
    }
    
    return true
  })
}

export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TXN${timestamp}${random}`
}

export const generateBookingId = (): string => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BK${timestamp}${random}`
}

export const simulatePayment = async (data: PaymentFormData): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
  
  const isSuccess = Math.random() < 0.8
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: generateTransactionId()
    }
  } else {
    const errors = [
      'ข้อมูลบัตรเครดิตไม่ถูกต้อง',
      'บัตรเครดิตหมดอายุ',
      'ยอดเงินในบัตรไม่เพียงพอ',
      'การเชื่อมต่อกับธนาคารขัดข้อง',
      'บัตรถูกปฏิเสธโดยธนาคาร'
    ]
    
    return {
      success: false,
      error: errors[Math.floor(Math.random() * errors.length)]
    }
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9-+().\s]+$/
  return phoneRegex.test(phone) && phone.length >= 10
}

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv)
}

export const validateExpiryDate = (expiryDate: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false
  }
  
  const [month, year] = expiryDate.split('/').map(Number)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  if (month < 1 || month > 12) {
    return false
  }
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }
  
  return true
}