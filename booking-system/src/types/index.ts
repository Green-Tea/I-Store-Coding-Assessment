export interface Room {
  id: string
  name: string
  type: string
  price: number
  currency: string
  description: string
  image_url: string
  images: string[]
  capacity: number
  amenities: string[]
  size: string
  bed_type: string
  availability: string[]
}

export interface SearchFilters {
  checkIn: string
  checkOut: string
  guests: number
  roomType: string
  priceRange: [number, number]
  amenities: string[]
}

export interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface PaymentFormData {
  cardNumber: string
  cvv: string
  expiryDate: string
  cardHolder: string
}

export interface BookingConfirmation {
  id: string
  transactionId: string
  bookingData: BookingData
  paymentData: PaymentFormData
  status: 'success' | 'failed'
  timestamp: string
}

export interface BookingData {
  roomId: string
  roomName: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  totalPrice: number
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  userId: string | null
}

export interface PaymentData {
  cardNumber: string
  cvv: string
  expiryDate: string
  cardHolder: string
}

export interface BookingState {
  currentBooking: BookingData | null
  paymentData: PaymentData | null
  bookingHistory: BookingData[]
  isLoading: boolean
  
  setBookingData: (data: BookingData) => void
  setPaymentData: (data: PaymentData) => void
  setLoading: (loading: boolean) => void
  addToHistory: (booking: BookingData) => void
  clearCurrentBooking: () => void
  reset: () => void
}