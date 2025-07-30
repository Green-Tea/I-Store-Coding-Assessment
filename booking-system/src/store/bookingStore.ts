import { BookingData, BookingState, PaymentData } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
        const history = get().bookingHistory;
        const exists = history.some(
          item => item.roomId === booking.roomId &&
            item.checkIn === booking.checkIn &&
            item.checkOut === booking.checkOut
        );
        if (!exists) {
          set({
            bookingHistory: [booking, ...history],
          });
        }
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