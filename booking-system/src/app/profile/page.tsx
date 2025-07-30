'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, CreditCard, Mail, Phone, Clock, Users, Home } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBookingStore } from '@/store/bookingStore'
import { formatPrice, formatDate } from '@/utils'
import BookingSection from '@/components/ui/BookingSection'

const ProfilePage = () => {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()
    const { bookingHistory } = useBookingStore()

    const userBookings = bookingHistory.filter(booking =>
        booking.userId && booking.userId === user?.id
    )

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
                    <div className="bg-primary-600 h-32"></div>
                    <div className="px-6 pb-6">
                        <div className="flex items-center -mt-12 mb-4">
                            <div className="ml-6 mt-12">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-gray-600">Member since 2024</p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-5 h-5 mr-3 text-primary-600" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone className="w-5 h-5 mr-3 text-primary-600" />
                                <span>{user.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking History */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold flex items-center">
                            <Calendar className="w-6 h-6 mr-2 text-primary-600" />
                            Booking History
                        </h2>
                    </div>

                    <div className="p-6">
                        {userBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <br />
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Home className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                                <p className="text-gray-600 mb-4">
                                    When you make your first booking, it will appear here.
                                </p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="btn-primary"
                                >
                                    Browse Rooms
                                </button>
                            </div>
                        ) : (
                            <div>
                                {userBookings.map((booking, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => router.push(`/rooms/${booking.roomId}`)}
                                    >
                                        <BookingSection
                                            key={index}
                                            title={booking.roomName}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                <div className="flex-1">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span>
                                                                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span>{booking.nights} nights</span>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span>{booking.guests} guests</span>
                                                        </div>

                                                        <div className="flex items-center">
                                                            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span className="font-medium">{formatPrice(booking.totalPrice)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </BookingSection>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <br />

                {/* Stats Summary */}
                {userBookings.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{userBookings.length}</h3>
                            <p className="text-gray-600">Total Bookings</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {userBookings.reduce((total, booking) => total + booking.nights, 0)}
                            </h3>
                            <p className="text-gray-600">Total Nights</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CreditCard className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {formatPrice(userBookings.reduce((total, booking) => total + booking.totalPrice, 0))}
                            </h3>
                            <p className="text-gray-600">Total Spent</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage