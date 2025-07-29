'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { CreditCard, Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { PaymentFormData } from '@/types'
import { formatPrice, simulatePayment, validateCVV, validateExpiryDate } from '@/utils'
import BookingSection from '@/components/ui/BookingSection'

const PaymentPage = () => {
  const router = useRouter()
  const { currentBooking, setPaymentData, setLoading, isLoading } = useBookingStore()
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [paymentError, setPaymentError] = useState<string>('')

  const { register, handleSubmit, formState: { errors }, watch } = useForm<PaymentFormData>()

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
    const visa = /^4/
    const mastercard = /^5[1-5]/
    const amex = /^3[47]/

    if (visa.test(number)) return 'Visa'
    if (mastercard.test(number)) return 'Mastercard'
    if (amex.test(number)) return 'American Express'
    return 'Unknown'
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

        // Redirect to receipt page with transaction ID
        setTimeout(() => {
          router.push(`/booking/receipt?transactionId=${result.transactionId}`)
        }, 2000)
      } else {
        setPaymentStatus('error')
        setPaymentError(result.error || 'การชำระเงินล้มเหลว')
      }
    } catch (error) {
      setPaymentStatus('error')
      setPaymentError('เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  if (!currentBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>กลับไปแก้ไขข้อมูล</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ชำระเงิน
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Order Summary */}
          <BookingSection title='สรุปคำสั่งซื้อ'>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky">
                <div className="space-y-3 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {currentBooking.roomName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentBooking.checkIn} ถึง {currentBooking.checkOut}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentBooking.nights} คืน, {currentBooking.guests} คน
                    </p>
                  </div>

                  <hr />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ค่าที่พัก</span>
                      <span>{formatPrice(currentBooking.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ภาษีและค่าธรรมเนียม</span>
                      <span>รวมแล้ว</span>
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>ยอดรวมทั้งหมด</span>
                    <span className="text-primary-600">
                      {formatPrice(currentBooking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </BookingSection>

          <BookingSection title='ข้อมูลบัตรเครดิต'>
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Payment Status Messages */}
                {paymentStatus === 'processing' && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="loading-spinner w-5 h-5 mr-3"></div>
                      <p className="text-blue-700">กำลังดำเนินการชำระเงิน...</p>
                    </div>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <p className="text-green-700">ชำระเงินสำเร็จ! กำลังเปลี่ยนหน้าไปยังใบเสร็จ...</p>
                    </div>
                  </div>
                )}

                {paymentStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                      <div>
                        <p className="text-red-700 font-medium">การชำระเงินล้มเหลว</p>
                        <p className="text-red-600 text-sm mt-1">{paymentError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      หมายเลขบัตร *
                    </label>
                    <div className="relative">
                      <input
                        {...register('cardNumber', {
                          required: 'กรุณากรอกหมายเลขบัตร',
                          validate: (value) => {
                            const cleaned = value.replace(/\s/g, '')
                            return cleaned
                          }
                        })}
                        className="input-field pr-16"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        onChange={(e) => {
                          e.target.value = formatCardNumber(e.target.value)
                        }}
                      />
                      {cardNumber && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600">
                          {getCardType(cardNumber.replace(/\s/g, ''))}
                        </div>
                      )}
                    </div>
                    {errors.cardNumber && (
                      <p className="error-text">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  <div className="flex">
                    {/* Expiry Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        วันหมดอายุ *
                      </label>
                      <input
                        {...register('expiryDate', {
                          required: 'กรุณากรอกวันหมดอายุ',
                          validate: (value) => validateExpiryDate(value) || 'วันหมดอายุไม่ถูกต้อง'
                        })}
                        className="input-field"
                        placeholder="MM/YY"
                        maxLength={5}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4)
                          }
                          e.target.value = value
                        }}
                      />
                      {errors.expiryDate && (
                        <p className="error-text">{errors.expiryDate.message}</p>
                      )}
                    </div>

                    {/* CVV */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        {...register('cvv', {
                          required: 'กรุณากรอก CVV',
                          validate: (value) => validateCVV(value) || 'CVV ไม่ถูกต้อง'
                        })}
                        className="input-field"
                        placeholder="123"
                        maxLength={4}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '')
                        }}
                      />
                      {errors.cvv && (
                        <p className="error-text">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Card Holder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อผู้ถือบัตร *
                    </label>
                    <input
                      {...register('cardHolder', {
                        required: 'กรุณากรอกชื่อผู้ถือบัตร',
                        minLength: {
                          value: 2,
                          message: 'ชื่อผู้ถือบัตรต้องมีความยาวอย่างน้อย 2 ตัวอักษร'
                        }
                      })}
                      className="input-field uppercase"
                      placeholder="JOHN DOE"
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase()
                      }}
                    />
                    {errors.cardHolder && (
                      <p className="error-text">{errors.cardHolder.message}</p>
                    )}
                  </div>

                  <br />

                  <button
                    type="submit"
                    disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
                    className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentStatus === 'processing' ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner w-5 h-5 mr-2"></div>
                        กำลังดำเนินการ...
                      </div>
                    ) : (
                      `ชำระเงิน ${formatPrice(currentBooking.totalPrice)}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </BookingSection>


        </div>
      </div>
    </div>
  )
}

export default PaymentPage