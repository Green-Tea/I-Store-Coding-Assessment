import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentBooking: null,
      paymentData: null,
      bookingHistory: [],
      isLoading: false,

      setBookingData: (data: BookingData) => {
        set({ currentBooking: data })
      },

      setPaymentData: (data: PaymentData) => {
        set({ paymentData: data })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      addToHistory: (booking: BookingData) => {
        const history = get().bookingHistory
        set({ 
          bookingHistory: [booking, ...history],
          currentBooking: null,
          paymentData: null
        })
      },

      clearCurrentBooking: () => {
        set({ 
          currentBooking: null,
          paymentData: null
        })
      },

      reset: () => {
        set({
          currentBooking: null,
          paymentData: null,
          isLoading: false
        })
      }
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        bookingHistory: state.bookingHistory
      })
    }
  )
)