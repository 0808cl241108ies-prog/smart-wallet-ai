import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

function Navbar() {
  return (
    <header className="w-full bg-white border-b border-black">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">

        <div className="flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-lg">
              💰
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">
              Smart Wallet AI
            </h2>

            <p className="text-xs text-slate-500 hidden sm:block">
              Personal Finance Dashboard
            </p>
          </div>

        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">

          <div className="relative w-full">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />

          </div>

        </div>

        <div className="flex items-center gap-2 sm:gap-3">

          <button
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            title="Notifications"
          >
            <Bell size={19} />
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-2">

            <div className="text-right">

              <p className="text-sm font-semibold text-slate-900">
                Manohar
              </p>

              <p className="text-xs text-slate-500">
                Personal Account
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <UserCircle size={22} />
            </div>

          </div>

          <div className="sm:hidden w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <UserCircle size={22} />
          </div>

        </div>

      </div>
    </header>
  );
}

export default Navbar;