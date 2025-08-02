// src/app/booking/confirmation/page.tsx - Bootstrap version with vertical gaps
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, MapPin, User, Mail, Phone, ArrowLeft, CreditCard, Clock } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { formatPrice, formatDate } from '@/utils'
import RoomCard from '@/components/ui/RoomCard'
import roomsData from '@/data/rooms.json'
import { Room } from '@/types/index'
import BookingSection from '@/components/ui/BookingSection'

const BookingConfirmationPage = () => {
  const router = useRouter()
  const { currentBooking } = useBookingStore()
  const [roomDetails, setRoomDetails] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!currentBooking) {
      router.push('/')
    } else {
      const timer = setTimeout(() => {
        const foundRoom = roomsData.rooms.find(room => room.id === currentBooking.roomId)
        setRoomDetails(foundRoom || null)
        setIsLoading(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [currentBooking, router])

  if (!currentBooking) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <h1 className="h3 mb-0">Confirm Booking</h1>
      </div>
      
      <p className="text-muted mb-4">
        Please review your booking information before proceeding with payment.
      </p>

      <div className="row g-4">
        {/* Left Column - Booking Details */}
        <div className="col-lg-8">
          {/* Room Information Section */}
          <div className="mb-4">
            {isLoading ? (
              <div className="card">
                <div className="card-body">
                  <div className="placeholder-glow">
                    <div className="placeholder col-4 mb-3"></div>
                    <div className="placeholder col-6"></div>
                  </div>
                </div>
              </div>
            ) : roomDetails ? (
              <RoomCard room={roomDetails} showButton={false} />
            ) : (
              <div className="alert alert-warning">
                Room details not found
              </div>
            )}
          </div>

          {/* Guest Information Section */}
          <BookingSection title="Guest Information" className="mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <User size={18} />
                  <span className="fw-semibold">Name:</span>
                </div>
                <p className="ms-4 mb-0">
                  {currentBooking.guestInfo.firstName} {currentBooking.guestInfo.lastName}
                </p>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Phone size={18} />
                  <span className="fw-semibold">Phone:</span>
                </div>
                <p className="ms-4 mb-0">{currentBooking.guestInfo.phone}</p>
              </div>
              
              <div className="col-12">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Mail size={18} />
                  <span className="fw-semibold">Email:</span>
                </div>
                <p className="ms-4 mb-0">{currentBooking.guestInfo.email}</p>
              </div>
            </div>
          </BookingSection>

          {/* Booking Policies Section */}
          <BookingSection title="Booking Policies" className="mb-4">
            <div className="row">
              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">Check-in/Check-out</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Clock size={16} className="text-primary me-2" />
                    Check-in: 3:00 PM onwards
                  </li>
                  <li>
                    <Clock size={16} className="text-primary me-2" />
                    Check-out: Before 12:00 PM
                  </li>
                </ul>
              </div>
              
              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">Cancellation Policy</h6>
                <p className="mb-2">
                  Free cancellation up to 24 hours before check-in.
                </p>
                <p className="text-muted small">
                  Please bring your ID card or passport for check-in.
                </p>
              </div>
            </div>
          </BookingSection>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="col-lg-4">
          <BookingSection title="Booking Summary" className="sticky-top">
            {/* Summary Details */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Room Type</span>
                <span className="fw-medium">{currentBooking.roomName}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Check-in</span>
                <span className="fw-medium">{formatDate(currentBooking.checkIn)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Check-out</span>
                <span className="fw-medium">{formatDate(currentBooking.checkOut)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Nights</span>
                <span className="fw-medium">{currentBooking.nights} nights</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Guests</span>
                <span className="fw-medium">{currentBooking.guests} guests</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Room Rate</span>
                <span className="fw-medium">
                  {formatPrice(currentBooking.totalPrice / currentBooking.nights)} × {currentBooking.nights}
                </span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between">
                <span className="h5 mb-0">Total Price</span>
                <span className="h5 mb-0 text-primary">
                  {formatPrice(currentBooking.totalPrice)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <Link
                href="/booking/payment"
                className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2"
              >
                <CreditCard size={20} />
                Proceed to Payment
              </Link>
            </div>

            {/* Security Notice */}
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Your payment information is secure and encrypted
              </small>
            </div>
          </BookingSection>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationPage