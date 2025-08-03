'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Room, BookingFormData } from '@/types'
import { formatPrice, calculateNights, isRoomAvailable } from '@/utils'
import { useBookingStore } from '@/store/bookingStore'
import RoomCard from '@/components/ui/RoomCard'
import BookingSection from '@/components/ui/BookingSection'
import roomsData from '@/data/rooms.json'
import 'react-datepicker/dist/react-datepicker.css'
import { useAuthStore } from '@/store/authStore'

const RoomDetailPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const roomId = params.id as string

  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(2)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const { setBookingData } = useBookingStore()
  const { user } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>()

  useEffect(() => {
    const loadRoom = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      const foundRoom = roomsData.rooms.find(r => r.id === roomId)
      setRoom(foundRoom || null)
      setIsLoading(false)
    }

    loadRoom()

    const initialCheckIn = searchParams.get('checkIn')
    const initialCheckOut = searchParams.get('checkOut')
    const initialGuests = searchParams.get('guests')

    if (initialCheckIn) setCheckIn(new Date(initialCheckIn))
    if (initialCheckOut) setCheckOut(new Date(initialCheckOut))
    if (initialGuests) setGuests(parseInt(initialGuests))
  }, [roomId, searchParams])

  const handleBooking = (formData: BookingFormData) => {
    if (!room || !checkIn || !checkOut) return

    const nights = calculateNights(
      checkIn.toISOString().split('T')[0],
      checkOut.toISOString().split('T')[0]
    )

    const bookingData = {
      roomId: room.id,
      roomName: room.name,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      guests,
      nights,
      totalPrice: room.price * nights,
      guestInfo: formData,
      userId: user?.id || null
    }

    setBookingData(bookingData)
    router.push('/booking/confirmation')
  }

  const canBook = room && checkIn && checkOut &&
    isRoomAvailable(room, checkIn.toISOString().split('T')[0], checkOut.toISOString().split('T')[0])

  const nights = checkIn && checkOut ?
    calculateNights(
      checkIn.toISOString().split('T')[0],
      checkOut.toISOString().split('T')[0]
    ) : 0

  const totalPrice = room && nights ? room.price * nights : 0

  const isDateUnavailable = (date: Date) => {
    if (!room) return true
    const dateStr = date.toISOString().split('T')[0]
    return !room.availability.includes(dateStr)
  }

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="h2 mb-3">Room not found</h1>
          <p className="text-muted mb-4">The room you&apos;re looking for may not exist or has been removed</p>
          <button
            onClick={() => router.back()}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Go back</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            {/* Carousel for Images */}
            {room.images && room.images.length > 0 && (
              <div id="roomCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
                {/* Carousel Indicators */}
                {room.images.length > 1 && (
                  <div className="carousel-indicators">
                    {room.images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#roomCarousel"
                        data-bs-slide-to={index}
                        className={index === activeImageIndex ? 'active' : ''}
                        aria-current={index === activeImageIndex ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => setActiveImageIndex(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Carousel Images */}
                <div className="carousel-inner rounded-3 overflow-hidden">
                  {room.images.map((image, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === activeImageIndex ? 'active' : ''}`}
                    >
                      <div style={{ position: 'relative', height: '400px' }}>
                        <Image
                          src={image}
                          alt={`${room.name} ${index + 1}`}
                          fill
                          className="object-fit-cover"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Controls */}
                {room.images.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      onClick={() => {
                        const newIndex = activeImageIndex === 0 ? room.images.length - 1 : activeImageIndex - 1
                        setActiveImageIndex(newIndex)
                      }}
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      onClick={() => {
                        const newIndex = activeImageIndex === room.images.length - 1 ? 0 : activeImageIndex + 1
                        setActiveImageIndex(newIndex)
                      }}
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Room Details Card */}
            <RoomCard room={room} showButton={false} />
          </div>

          {/* Booking Form */}
          <div className="col-lg-6">
            <BookingSection title="Book this room">
              {/* Check-in and Check-out */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Check-in Date</label>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    minDate={new Date()}
                    filterDate={(date) => !isDateUnavailable(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    placeholderText="Select date"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Check-out Date</label>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    minDate={checkIn || new Date()}
                    filterDate={(date) => !isDateUnavailable(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    placeholderText="Select date"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-3">
                <label className="form-label">Guests</label>
                <select
                  className="form-select"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking Summary */}
              {checkIn && checkOut && (
                <div className="bg-light p-3 rounded mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Price per night:</span>
                    <span>{formatPrice(room.price)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Number of nights:</span>
                    <span>{nights}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              )}

              {/* Availability Warning */}
              {checkIn && checkOut && !canBook && (
                <div className="alert alert-warning" role="alert">
                  <strong>Room not available for selected dates.</strong>
                  <br />
                  Please choose different dates.
                </div>
              )}

              <button
                onClick={() => setShowBookingForm(!showBookingForm)}
                disabled={!canBook}
                className="btn btn-primary w-100"
              >
                {canBook ? (showBookingForm ? 'Hide Form' : 'Book Now') : 'Select dates first'}
              </button>
            </BookingSection>

            {/* Guest Information Form */}
            {showBookingForm && (
              <BookingSection title="Guest Information" className="mt-3">
                <form onSubmit={handleSubmit(handleBooking)}>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        {...register('firstName', { required: 'Please enter first name' })}
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        placeholder="First Name"
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">
                          {errors.firstName.message}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        {...register('lastName', { required: 'Please enter last name' })}
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        placeholder="Last Name"
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">
                          {errors.lastName.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Please enter email',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email format'
                        }
                      })}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <input
                      {...register('phone', {
                        required: 'Please enter phone number',
                        pattern: {
                          value: /^[0-9-+().\s]+$/,
                          message: 'Invalid phone format'
                        }
                      })}
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Phone Number"
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">
                        {errors.phone.message}
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </form>
              </BookingSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetailPage