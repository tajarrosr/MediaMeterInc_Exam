import { ChevronDown, UserCircle, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <>
      <header className="bg-[#1E1E1E] text-white">
        <div className="flex items-center w-full px-4 sm:px-6 py-3">
          <h1
            className="flex-shrink-0 font-[Raleway] font-bold select-none
                         text-[28px] xs:text-[30px] sm:text-[32px] md:text-[36px] lg:text-[40px]"
          >
            Exam <span className="text-[#00FFFF]">track</span>
          </h1>

          <nav
            className="ml-auto hidden md:flex items-center gap-4 lg:gap-8
                       whitespace-nowrap text-sm font-medium"
          >
            <button className="flex items-center gap-1 hover:text-cyan-400">
              My Request <ChevronDown size={14} />
            </button>

            <button className="flex items-center gap-1 hover:text-cyan-400">
              Administration Tools <ChevronDown size={14} />
            </button>

            <button className="flex items-center gap-1 hover:text-cyan-400">
              <UserCircle size={22} className="text-[#00FFFF]" />
              <span>My Account</span>
              <ChevronDown size={14} />
            </button>
          </nav>

          {/* mobile hamburger */}
          <button className="ml-auto md:hidden p-2">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <div className="h-[3px] bg-[color:var(--color-primary)]" />
    </>
  );
}
