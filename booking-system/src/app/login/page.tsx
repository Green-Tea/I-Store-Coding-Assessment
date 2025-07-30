'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, User, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface LoginFormData {
  email: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const { login, isLoading } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('')

    const success = await login(data.email, data.password)

    if (success) {
      router.push('/')
    } else {
      setLoginError('Incorrect email or password')
    }
  }

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-1/2">
        <div className="flex justify-center">
          <User />
        </div>
        <h2 className="text-center">
          Login
        </h2>

        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <div className="border text-center">
            <h3>
              Demo Accounts
            </h3>
            <div>
              <p>admin@example.com / admin123</p>
              <p>john@example.com / john123</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <p className="text-red-700 text-sm">{loginError}</p>
              </div>
            </div>
          )}

          <br />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-center">
                Email
              </label>
              <div className="mt-1 flex justify-center">
                <div className="relative w-80">
                  <input
                    {...register('email', {
                      required: 'Please enter email address',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format'
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
                        message: 'Password should be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-10 w-full"
                    placeholder="123456"
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
                    Logging In...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage