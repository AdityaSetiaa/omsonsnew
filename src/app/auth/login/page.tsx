"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ROLE_OPTIONS = [
  { label: "Staff", value: "1" },
  { label: "Dealer", value: "2" },
  { label: "Admin", value: "3" },
]

export default function Login() {
  const router = useRouter()

  const [roletype, setRoletype] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const body = new URLSearchParams()
      body.append("roletype", roletype)
      body.append("email", email)
      body.append("password", password)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login/login_verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body
        }
      )

      const data = await res.json()

      if (data.status) {
        localStorage.setItem("user", JSON.stringify(data.data))
        router.push("/home")
      } else {
        setError(data.msg || "Invalid login")
      }
    } catch (err) {
      setError("Server error. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 dark:bg-black text-gray-900 dark:text-white">
      <form className="w-full max-w-sm" onSubmit={handleLogin}>
        <div className="mb-10">
          <h1 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
            Sign in
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your details to continue
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Role Type */}
          <div className="relative">
            <select
              value={roletype}
              onChange={e => setRoletype(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-0 py-3 text-sm bg-transparent border-b border-gray-200 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors duration-200 appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="" disabled className="text-gray-400">
                Role
              </option>
              {ROLE_OPTIONS.map(opt => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="text-gray-900 dark:text-white dark:bg-black"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            {/* Custom chevron */}
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-0 py-3 text-sm bg-transparent border-b border-gray-200 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors duration-200"
            disabled={isLoading}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-0 py-3 text-sm bg-transparent border-b border-gray-200 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors duration-200"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  )
}