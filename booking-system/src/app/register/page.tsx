'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, UserPlus, User, Mail, Phone, Lock, AlertCircle } from 'lucide-react'
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
      setRegisterError('ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          สมัครสมาชิก
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          หรือ{' '}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {registerError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <p className="text-red-700 text-sm">{registerError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  ชื่อ
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('firstName', {
                      required: 'กรุณากรอกชื่อ',
                      minLength: {
                        value: 2,
                        message: 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร'
                      }
                    })}
                    type="text"
                    className="input-field pr-10"
                    placeholder="ชื่อ"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.firstName && (
                  <p className="error-text">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  นามสกุล
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('lastName', {
                      required: 'กรุณากรอกนามสกุล',
                      minLength: {
                        value: 2,
                        message: 'นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร'
                      }
                    })}
                    type="text"
                    className="input-field pr-10"
                    placeholder="นามสกุล"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.lastName && (
                  <p className="error-text">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                อีเมล
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('email', {
                    required: 'กรุณากรอกอีเมล',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'รูปแบบอีเมลไม่ถูกต้อง'
                    }
                  })}
                  type="email"
                  className="input-field pr-10"
                  placeholder="อีเมลของคุณ"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                เบอร์โทรศัพท์
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('phone', {
                    required: 'กรุณากรอกเบอร์โทรศัพท์',
                    pattern: {
                      value: /^[0-9-+().\s]{10,}$/,
                      message: 'รูปแบบเบอร์โทรไม่ถูกต้อง'
                    }
                  })}
                  type="tel"
                  className="input-field pr-10"
                  placeholder="เบอร์โทรศัพท์"
                />
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="error-text">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                รหัสผ่าน
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'กรุณากรอกรหัสผ่าน',
                    minLength: {
                      value: 6,
                      message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="รหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                ยืนยันรหัสผ่าน
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword', {
                    required: 'กรุณายืนยันรหัสผ่าน',
                    validate: (value) => value === password || 'รหัสผ่านไม่ตรงกัน'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="ยืนยันรหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                ฉันยอมรับ{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  ข้อกำหนดการใช้งาน
                </a>{' '}
                และ{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  นโยบายความเป็นส่วนตัว
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-5 h-5 mr-2"></div>
                    กำลังสมัครสมาชิก...
                  </div>
                ) : (
                  'สมัครสมาชิก'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">หรือ</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              ← กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage