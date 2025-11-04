"use client"

import { Home, Users2, Briefcase, Workflow, CheckSquare, DollarSign, FolderTree, Settings, Building2, Users, PlugZap, Tag, Shield, FileText } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"

interface SidebarProps {
  onStartTutorial: () => void
  onOpenTutorialCenter?: () => void
  onLogoClick?: () => void
}

export function Sidebar({ onStartTutorial, onOpenTutorialCenter, onLogoClick }: SidebarProps) {
  const pathname = usePathname()
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  // Auto-expand Admin section if on admin pages
  useEffect(() => {
    const adminPaths = ["/team", "/more/organization", "/settings"]
    setIsAdminOpen(adminPaths.some(path => pathname?.startsWith(path)))
  }, [pathname])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onLogoClick) {
      e.preventDefault()
      onLogoClick()
    }
  }

  return (
    <div className="flex">
      {/* Main Sidebar */}
      <aside className="w-[80px] bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="pt-6 pb-4 flex items-center justify-center">
          {onLogoClick ? (
            <button
              onClick={handleLogoClick}
              className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <svg width="94" height="133" viewBox="0 0 94 133" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto">
                <path d="M4.93133 114.69L0.771484 99.7663H2.85141L6.07784 111.641L9.29412 99.7663H11.374L14.5903 111.641L17.8167 99.7663H19.8966L15.7368 114.69H13.454L10.3392 103.502L7.2142 114.69H4.93133ZM30.477 99.7663L36.0877 114.69H34.0078L32.7192 111.256H26.1548L24.8662 114.69H22.7863L28.397 99.7663H30.477ZM26.9461 109.122H31.9177L29.4421 102.545L26.9461 109.122ZM40.3572 99.7663L44.5881 106.739L48.8291 99.7663H51.2437L45.6331 108.768V114.69H43.5532V108.768L37.9424 99.7663H40.3572ZM57.8876 101.9V103.825H55.8077V101.9C55.8077 101.608 55.8616 101.334 55.97 101.078C56.0783 100.814 56.2267 100.588 56.4162 100.401C56.6057 100.207 56.8254 100.054 57.0757 99.9429C57.333 99.8252 57.6036 99.7663 57.8876 99.7663H64.472C64.7565 99.7663 65.0237 99.8252 65.274 99.9429C65.5308 100.054 65.7504 100.207 65.9335 100.401C66.1225 100.588 66.2714 100.814 66.3797 101.078C66.4945 101.334 66.5524 101.608 66.5524 101.9V104.626C66.5524 104.918 66.5252 105.178 66.4707 105.407C66.4168 105.636 66.3288 105.844 66.2071 106.032C66.0923 106.212 65.9434 106.375 65.7608 106.52C65.5782 106.666 65.3551 106.805 65.0909 106.937L57.8876 110.403V112.557H64.7362V110.642H66.8161V114.69H55.8077V110.767C55.8077 110.475 55.8344 110.215 55.8888 109.986C55.9497 109.757 56.0377 109.553 56.1525 109.372C56.2673 109.192 56.4162 109.029 56.5988 108.883C56.7883 108.73 57.0084 108.591 57.2583 108.467L64.472 104.991V101.9H57.8876ZM82.3068 106.906C82.611 107.003 82.8886 107.141 83.1389 107.322C83.3893 107.502 83.602 107.735 83.7781 108.019C83.9538 108.297 84.0893 108.626 84.1838 109.008C84.2788 109.39 84.3258 109.827 84.3258 110.319V111.068C84.3258 113.483 83.1488 114.69 80.7954 114.69H72.8306V99.7663H80.3793C82.7332 99.7663 83.9097 100.977 83.9097 103.398V103.669C83.9097 104.509 83.7781 105.195 83.5144 105.73C83.2572 106.257 82.8549 106.649 82.3068 106.906ZM74.8699 108.186V112.598H80.7345C81.2822 112.598 81.678 112.466 81.9214 112.203C82.1648 111.939 82.2865 111.527 82.2865 110.964V109.809C82.2865 109.24 82.1648 108.827 81.9214 108.571C81.678 108.314 81.2822 108.186 80.7345 108.186H74.8699ZM74.8699 101.858V106.104H80.4604C80.9611 106.083 81.3193 105.945 81.536 105.688C81.7591 105.424 81.8704 105.022 81.8704 104.481V103.502C81.8704 102.933 81.7487 102.517 81.5053 102.253C81.2619 101.99 80.8661 101.858 80.3184 101.858H74.8699ZM93.2424 99.7663V114.69H91.1626V101.9H88.6666V99.7663H93.2424Z" fill="#1C2024"/>
                <path d="M45.2221 14.1346C46.3422 13.5788 47.6578 13.5788 48.7779 14.1346L90.3894 34.7819C91.8707 35.517 91.8707 37.63 90.3894 38.3651L48.7779 59.0124C47.6578 59.5682 46.3422 59.5682 45.2221 59.0124L3.61065 38.3651C2.12927 37.63 2.12926 35.517 3.61064 34.7819L45.2221 14.1346Z" fill="#CAE0FF"/>
                <path d="M45.2221 33.7243C46.3422 33.1685 47.6578 33.1685 48.7779 33.7243L90.3894 54.3716C91.8707 55.1067 91.8707 57.2197 90.3894 57.9548L48.7779 78.6021C47.6578 79.1579 46.3422 79.1579 45.2221 78.6021L3.61065 57.9548C2.12927 57.2197 2.12926 55.1067 3.61064 54.3716L45.2221 33.7243Z" fill="#B5D3FF"/>
                <path d="M45.2224 33.7247C46.3425 33.169 47.658 33.1689 48.7781 33.7247L74.2595 46.3682L48.7781 59.0128C47.6581 59.5685 46.3424 59.5684 45.2224 59.0128L19.74 46.3682L45.2224 33.7247Z" fill="#005BE2"/>
                <path d="M84 121.797H92.9609V123.398H89.2812V133H87.6797V123.398H84V121.797Z" fill="#60646C"/>
                <path d="M59.0156 121.797L62.0078 125.992L65.0156 121.797H66.9531L62.9844 127.352L67.0391 133H65.1016L62.0078 128.695L58.9375 133H57L61.0547 127.352L57.0859 121.797H59.0156Z" fill="#60646C"/>
                <path d="M32 121.797H40.1641V123.398H33.6016V126.602H39.2031V128.203H33.6016V131.398H40.1641V133H32V121.797Z" fill="#60646C"/>
                <path d="M6.60156 133H5V121.797H6.60156L13.3359 130.484V121.797H14.9375V133H13.3359L6.60156 124.312V133Z" fill="#60646C"/>
              </svg>
            </button>
          ) : (
            <Link href="/" className="flex items-center justify-center">
              <svg width="94" height="133" viewBox="0 0 94 133" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto">
                <path d="M4.93133 114.69L0.771484 99.7663H2.85141L6.07784 111.641L9.29412 99.7663H11.374L14.5903 111.641L17.8167 99.7663H19.8966L15.7368 114.69H13.454L10.3392 103.502L7.2142 114.69H4.93133ZM30.477 99.7663L36.0877 114.69H34.0078L32.7192 111.256H26.1548L24.8662 114.69H22.7863L28.397 99.7663H30.477ZM26.9461 109.122H31.9177L29.4421 102.545L26.9461 109.122ZM40.3572 99.7663L44.5881 106.739L48.8291 99.7663H51.2437L45.6331 108.768V114.69H43.5532V108.768L37.9424 99.7663H40.3572ZM57.8876 101.9V103.825H55.8077V101.9C55.8077 101.608 55.8616 101.334 55.97 101.078C56.0783 100.814 56.2267 100.588 56.4162 100.401C56.6057 100.207 56.8254 100.054 57.0757 99.9429C57.333 99.8252 57.6036 99.7663 57.8876 99.7663H64.472C64.7565 99.7663 65.0237 99.8252 65.274 99.9429C65.5308 100.054 65.7504 100.207 65.9335 100.401C66.1225 100.588 66.2714 100.814 66.3797 101.078C66.4945 101.334 66.5524 101.608 66.5524 101.9V104.626C66.5524 104.918 66.5252 105.178 66.4707 105.407C66.4168 105.636 66.3288 105.844 66.2071 106.032C66.0923 106.212 65.9434 106.375 65.7608 106.52C65.5782 106.666 65.3551 106.805 65.0909 106.937L57.8876 110.403V112.557H64.7362V110.642H66.8161V114.69H55.8077V110.767C55.8077 110.475 55.8344 110.215 55.8888 109.986C55.9497 109.757 56.0377 109.553 56.1525 109.372C56.2673 109.192 56.4162 109.029 56.5988 108.883C56.7883 108.73 57.0084 108.591 57.2583 108.467L64.472 104.991V101.9H57.8876ZM82.3068 106.906C82.611 107.003 82.8886 107.141 83.1389 107.322C83.3893 107.502 83.602 107.735 83.7781 108.019C83.9538 108.297 84.0893 108.626 84.1838 109.008C84.2788 109.39 84.3258 109.827 84.3258 110.319V111.068C84.3258 113.483 83.1488 114.69 80.7954 114.69H72.8306V99.7663H80.3793C82.7332 99.7663 83.9097 100.977 83.9097 103.398V103.669C83.9097 104.509 83.7781 105.195 83.5144 105.73C83.2572 106.257 82.8549 106.649 82.3068 106.906ZM74.8699 108.186V112.598H80.7345C81.2822 112.598 81.678 112.466 81.9214 112.203C82.1648 111.939 82.2865 111.527 82.2865 110.964V109.809C82.2865 109.24 82.1648 108.827 81.9214 108.571C81.678 108.314 81.2822 108.186 80.7345 108.186H74.8699ZM74.8699 101.858V106.104H80.4604C80.9611 106.083 81.3193 105.945 81.536 105.688C81.7591 105.424 81.8704 105.022 81.8704 104.481V103.502C81.8704 102.933 81.7487 102.517 81.5053 102.253C81.2619 101.99 80.8661 101.858 80.3184 101.858H74.8699ZM93.2424 99.7663V114.69H91.1626V101.9H88.6666V99.7663H93.2424Z" fill="#1C2024"/>
                <path d="M45.2221 14.1346C46.3422 13.5788 47.6578 13.5788 48.7779 14.1346L90.3894 34.7819C91.8707 35.517 91.8707 37.63 90.3894 38.3651L48.7779 59.0124C47.6578 59.5682 46.3422 59.5682 45.2221 59.0124L3.61065 38.3651C2.12927 37.63 2.12926 35.517 3.61064 34.7819L45.2221 14.1346Z" fill="#CAE0FF"/>
                <path d="M45.2221 33.7243C46.3422 33.1685 47.6578 33.1685 48.7779 33.7243L90.3894 54.3716C91.8707 55.1067 91.8707 57.2197 90.3894 57.9548L48.7779 78.6021C47.6578 79.1579 46.3422 79.1579 45.2221 78.6021L3.61065 57.9548C2.12927 57.2197 2.12926 55.1067 3.61064 54.3716L45.2221 33.7243Z" fill="#B5D3FF"/>
                <path d="M45.2224 33.7247C46.3425 33.169 47.658 33.1689 48.7781 33.7247L74.2595 46.3682L48.7781 59.0128C47.6581 59.5685 46.3424 59.5684 45.2224 59.0128L19.74 46.3682L45.2224 33.7247Z" fill="#005BE2"/>
                <path d="M84 121.797H92.9609V123.398H89.2812V133H87.6797V123.398H84V121.797Z" fill="#60646C"/>
                <path d="M59.0156 121.797L62.0078 125.992L65.0156 121.797H66.9531L62.9844 127.352L67.0391 133H65.1016L62.0078 128.695L58.9375 133H57L61.0547 127.352L57.0859 121.797H59.0156Z" fill="#60646C"/>
                <path d="M32 121.797H40.1641V123.398H33.6016V126.602H39.2031V128.203H33.6016V131.398H40.1641V133H32V121.797Z" fill="#60646C"/>
                <path d="M6.60156 133H5V121.797H6.60156L13.3359 130.484V121.797H14.9375V133H13.3359L6.60156 124.312V133Z" fill="#60646C"/>
              </svg>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1" id="navigation">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Users2 className="w-5 h-5" />
            <span className="text-xs">Clients</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs">Projects</span>
          </Link>
          <Link
            id="sidebar-decisions-link"
            href="/decisions"
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname === "/decisions"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Workflow className="w-5 h-5" />
            <span className="text-xs">Decisions</span>
          </Link>
          <Link
            id="sidebar-tasks-link"
            href="/tasks"
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname === "/tasks"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs">Tasks</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Budgets</span>
          </Link>
          <Link
            href="/catalog"
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname === "/catalog"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FolderTree className="w-5 h-5" />
            <span className="text-xs">Catalog</span>
          </Link>
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`w-full flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors ${
              pathname?.startsWith("/team") || pathname?.startsWith("/more/organization") || pathname?.startsWith("/settings")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Admin</span>
          </button>
        </nav>
      </aside>

      {/* Admin Navigation Panel */}
      {isAdminOpen && (
        <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 pt-6 pb-4">
            <h2 className="text-sm font-semibold text-gray-900">Admin</h2>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <Link
              href="/more/organization"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === "/more/organization"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Organization profile</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Workflow className="w-4 h-4" />
              <span>Workflows</span>
            </Link>
            <Link
              href="/team"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === "/team"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teams</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Users2 className="w-4 h-4" />
              <span>Users</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <PlugZap className="w-4 h-4" />
              <span>Integration hub</span>
            </Link>
            <Link
              href="/catalog"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === "/catalog"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Task statuses</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Tag className="w-4 h-4" />
              <span>Tag management</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Permission sets</span>
            </Link>
          </nav>
        </aside>
      )}
    </div>
  )
}
