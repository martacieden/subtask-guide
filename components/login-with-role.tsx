"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Phone } from "lucide-react"

interface LoginWithRoleProps {
  onLogin: (email: string, role: string, position: string, firstName?: string, lastName?: string, phone?: string) => void
}

const roles = [
  { value: "family-principal", label: "Family Principal / CEO" },
  { value: "operations-manager", label: "Operations Manager" },
  { value: "investment-advisor", label: "Investment Advisor" },
  { value: "cfo-accountant", label: "CFO / Accountant" },
  { value: "executive-assistant", label: "Executive Assistant" },
  { value: "team-collaborator", label: "Team Collaborator" },
  { value: "other", label: "Other" },
]


export function LoginWithRole({ onLogin }: LoginWithRoleProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("+1 (123) 456-7890")
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)

  const handleProfileContinue = () => {
    if (!firstName || !lastName || !selectedRole) return
    // Після профілю одразу завершуємо логін
    // Використовуємо email з firstName для унікальності
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@way2b1.com`
    onLogin(email, selectedRole, "executive", firstName, lastName, phone)
  }

  // Одразу показуємо форму профілю
  return (
    <div className="fixed inset-0 bg-white z-[10000] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col p-12 max-w-2xl relative">
        {/* Logo зліва вгорі */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-10 h-10 bg-[#4F7CFF] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">W</span>
          </div>
          <span className="text-sm font-bold text-gray-800">WAY2B1</span>
        </div>

        {/* Form content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Profile details
            </h2>
            <p className="text-gray-600 text-sm">
              Welcome! Let's personalize your profile for a better experience on our platform. You can make changes anytime in your settings.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium mb-2 block text-gray-700">
                  First name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder=""
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-gray-300 focus:border-[#4F7CFF] focus:ring-[#4F7CFF]"
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm font-medium mb-2 block text-gray-700">
                  Last name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder=""
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-gray-300 focus:border-[#4F7CFF] focus:ring-[#4F7CFF]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium mb-2 block text-gray-700">
                Phone
              </Label>
              <div className="flex gap-2">
                {/* Country code dropdown */}
                <div className="border border-gray-300 rounded-md px-3 h-9 flex items-center gap-2 bg-white">
                  <span className="text-lg">🇺🇸</span>
                  <select className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer h-full">
                    <option>+1</option>
                  </select>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 h-9 border-gray-300 focus:border-[#4F7CFF] focus:ring-[#4F7CFF]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium mb-2 block text-gray-700">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
                <SelectTrigger id="role" className="w-full border-gray-300 focus:border-[#4F7CFF] focus:ring-[#4F7CFF]">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[10001]">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleProfileContinue}
              disabled={!firstName || !lastName || !selectedRole}
              className="w-full bg-[#4F7CFF] text-white hover:bg-[#4F7CFF]/90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        {/* SVG Illustration */}
        <div className="w-full h-full flex items-center justify-center p-12">
          <img 
            src="/profile-illustration.svg" 
            alt="Profile illustration" 
            className="w-full h-full object-contain max-w-2xl"
          />
        </div>
      </div>
    </div>
  )
}

