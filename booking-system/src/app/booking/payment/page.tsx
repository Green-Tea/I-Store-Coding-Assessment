// src/app/booking/payment/page.tsx - Bootstrap version with improved styling
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft, AlertCircle, CheckCircle, CreditCard, Lock, Calendar, Shield } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { PaymentFormData } from '@/types'
import { formatPrice, simulatePayment, validateCVV, validateExpiryDate } from '@/utils'
import BookingSection from '@/components/ui/BookingSection'

const PaymentPage = () => {
  const router = useRouter()
  const { currentBooking, setPaymentData, setLoading } = useBookingStore()
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [paymentError, setPaymentError] = useState<string>('')

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<PaymentFormData>()

  const cardNumber = watch('cardNumber', '')

  useEffect(() => {
    if (!currentBooking) {
      router.push('/')
    }
  }, [currentBooking, router])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    const visa = /^4/
    const mastercard = /^5[1-5]/
    const amex = /^3[47]/

    if (visa.test(cleaned)) return { type: 'Visa', icon: '💳' }
    if (mastercard.test(cleaned)) return { type: 'Mastercard', icon: '💳' }
    if (amex.test(cleaned)) return { type: 'American Express', icon: '💳' }
    return { type: '', icon: '' }
  }

  const onSubmit = async (data: PaymentFormData) => {
    if (!currentBooking) return

    setPaymentStatus('processing')
    setLoading(true)
    setPaymentError('')

    try {
      const result = await simulatePayment(data)

      if (result.success) {
        setPaymentData(data)
        setPaymentStatus('success')
        setLoading(false)

        setTimeout(() => {
          router.push(`/booking/receipt?transactionId=${result.transactionId}`)
        }, 1500)
      } else {
        setPaymentStatus('error')
        setPaymentError(result.error || 'Payment failed')
      }
    } catch (error) {
      setPaymentStatus('error')
      setPaymentError('System error occurred')
    } finally {
      setLoading(false)
    }
  }

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

  const cardType = getCardType(cardNumber)

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <h1 className="h3 mb-0">Payment</h1>
        </div>

        <div className="row g-4">
          {/* Payment Form Section */}
          <div className="col-lg-8">
            <BookingSection title="Credit Card Information" className="mb-4">
              {/* Payment Status Messages */}
              {paymentStatus === 'processing' && (
                <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                  <div className="spinner-border spinner-border-sm me-3" role="status">
                    <span className="visually-hidden">Processing...</span>
                  </div>
                  <div>
                    <strong>Processing Payment...</strong>
                    <br />
                    <small>Please wait while we securely process your payment.</small>
                  </div>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                  <CheckCircle size={20} className="me-2" />
                  <div>
                    <strong>Payment Successful!</strong>
                    <br />
                    <small>Redirecting to your receipt...</small>
                  </div>
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                  <AlertCircle size={20} className="me-2" />
                  <div>
                    <strong>Payment Failed</strong>
                    <br />
                    <small>{paymentError}</small>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Card Number */}
                <div className="mb-4">
                  <label className="form-label">
                    Card Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      {...register('cardNumber', {
                        required: 'Please enter card number',
                        validate: (value) => {
                          const cleaned = value.replace(/\s/g, '')
                          return (cleaned.length >= 13 && cleaned.length <= 16) || 'Invalid card number'
                        }
                      })}
                      className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value)
                        setValue('cardNumber', formatted)
                      }}
                    />
                    {cardType.type && (
                      <span className="input-group-text">
                        {cardType.icon} {cardType.type}
                      </span>
                    )}
                    {errors.cardNumber && (
                      <div className="invalid-feedback">
                        {errors.cardNumber.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expiry Date and CVV Row */}
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label className="form-label">
                      Expiry Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Calendar size={16} />
                      </span>
                      <input
                        {...register('expiryDate', {
                          required: 'Please enter expiry date',
                          validate: (value) => validateExpiryDate(value) || 'Invalid expiry date'
                        })}
                        className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                        placeholder="MM/YY"
                        maxLength={5}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4)
                          }
                          setValue('expiryDate', value)
                        }}
                      />
                      {errors.expiryDate && (
                        <div className="invalid-feedback">
                          {errors.expiryDate.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label className="form-label">
                      CVV <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={16} />
                      </span>
                      <input
                        {...register('cvv', {
                          required: 'Please enter CVV',
                          validate: (value) => validateCVV(value) || 'Invalid CVV'
                        })}
                        className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                        placeholder="123"
                        maxLength={4}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '')
                        }}
                      />
                      {errors.cvv && (
                        <div className="invalid-feedback">
                          {errors.cvv.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Holder Name */}
                <div className="mb-4">
                  <label className="form-label">
                    Cardholder Name <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register('cardHolder', {
                      required: 'Please enter cardholder name',
                      minLength: {
                        value: 2,
                        message: 'Cardholder name must be at least 2 characters'
                      }
                    })}
                    className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                    placeholder="JOHN DOE"
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase()
                    }}
                  />
                  {errors.cardHolder && (
                    <div className="invalid-feedback">
                      {errors.cardHolder.message}
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="alert alert-light border d-flex align-items-center mb-4">
                  <Shield size={20} className="text-success me-2" />
                  <small className="text-muted">
                    Your payment information is encrypted and secure. We never store your card details.
                  </small>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
                  className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Processing...</span>
                      </div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Pay {formatPrice(currentBooking.totalPrice)}</span>
                    </>
                  )}
                </button>
              </form>
            </BookingSection>

            {/* Accepted Payment Methods */}
            <div className="text-center text-muted">
              <small>We accept</small>
              <div className="d-flex justify-content-center gap-3 mt-2">
                <span className="badge bg-light text-dark">Visa</span>
                <span className="badge bg-light text-dark">Mastercard</span>
                <span className="badge bg-light text-dark">American Express</span>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="col-lg-4">
            <BookingSection title="Order Summary" className="sticky-top">
              {/* Room Details */}
              <div className="mb-4">
                <h6 className="fw-semibold">{currentBooking.roomName}</h6>
                <small className="text-muted">
                  {currentBooking.nights} nights • {currentBooking.guests} guests
                </small>
              </div>

              {/* Price Breakdown */}
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Room rate</span>
                  <span>{formatPrice(currentBooking.totalPrice / currentBooking.nights)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Number of nights</span>
                  <span>× {currentBooking.nights}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Taxes & fees</span>
                  <span className="text-success">Included</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <span className="h5 mb-0">Total</span>
                  <span className="h5 mb-0 text-primary">
                    {formatPrice(currentBooking.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-semibold mb-3">Booking Details</h6>
                <div className="small">
                  <div className="mb-2">
                    <Calendar size={14} className="me-2 text-muted" />
                    Check-in: {new Date(currentBooking.checkIn).toLocaleDateString()}
                  </div>
                  <div>
                    <Calendar size={14} className="me-2 text-muted" />
                    Check-out: {new Date(currentBooking.checkOut).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </BookingSection>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage