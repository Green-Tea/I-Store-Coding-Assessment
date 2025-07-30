'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, UserPlus, User, Mail, Phone, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const RegisterPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerError, setRegisterError] = useState('')
  
  const { register: registerUser, isLoading } = useAuthStore()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError('')
    
    if (data.password !== data.confirmPassword) {
      setRegisterError('รหัสผ่านไม่ตรงกัน')
      return
    }

    const success = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password
    })
    
    if (success) {
      router.push('/')
    } else {
      setRegisterError('Registration failed, please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-1/2">
        <div className="flex justify-center">
          <UserPlus />
        </div>
        <h2 className="text-center">
          Register
        </h2>

        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {registerError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <p className="text-red-700 text-sm">{registerError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 text-center">
                First Name
              </label>
              <div className="mt-1 flex justify-center">
                <div className="relative w-80">
                  <input
                    {...register('firstName', {
                      required: 'Please enter your first name',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    className="input-field pr-10 w-full"
                    placeholder="John"
                  />
                </div>
              </div>
              {errors.firstName && (
                <p className="error-text text-center">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 text-center">
                Surname
              </label>
              <div className="mt-1 flex justify-center">
                <div className="relative w-80">
                  <input
                    {...register('lastName', {
                      required: 'Please enter your surname',
                      minLength: {
                        value: 2,
                        message: 'Surname must be at least 2 characters'
                      }
                    })}
                    type="text"
                    className="input-field pr-10 w-full"
                    placeholder="Doe"
                  />
                </div>
              </div>
              {errors.lastName && (
                <p className="error-text text-center">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-center">
                Email
              </label>
              <div className="mt-1 flex justify-center">
                <div className="relative w-80">
                  <input
                    {...register('email', {
                      required: 'Please enter your email address',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="input-field pr-10 w-full"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              {errors.email && (
                <p className="error-text text-center">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-center">
                Phone Number
              </label>
              <div className="mt-1 flex justify-center">
                <div className="relative w-80">
                  <input
                    {...register('phone', {
                      required: 'Please enter your phone number',
                      pattern: {
                        value: /^[0-9-+().\s]{10,}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                    type="tel"
                    className="input-field pr-10 w-full"
                    placeholder="1234567890"
                  />
                </div>
              </div>
              {errors.phone && (
                <p className="error-text text-center">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-center">
                Password
              </label>
              <div className="mt-1 flex justify-center">
                <div className="relative w-80">
                  <input
                    {...register('password', {
                      required: 'Please enter your password',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters.'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-10 w-full"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-0"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="error-text text-center">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-center">
                Confirm Password
              </label>
              <div className="mt-1 flex justify-center">
                <div className="relative w-80">
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input-field pr-10 w-full"
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-0"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="error-text text-center">{errors.confirmPassword.message}</p>
              )}
            </div>

            <br />

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-80"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-5 h-5 mr-2"></div>
                    Registering User...
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Login
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              ← Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage