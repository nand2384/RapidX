import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="relative min-h-screen w-full bg-linear-to-br from-white via-orange-50 to-orange-100 overflow-hidden">

      {/* ================= BACKGROUND DECORATION ================= */}

      {/* Soft blurred blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-105 h-105 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-115 h-115 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-30 left-1/4 w-95 h-95 bg-orange-100/40 rounded-full blur-3xl" />
      </div>

      {/* Decorative symbols */}
      <div className="pointer-events-none absolute inset-0 text-orange-400/30">
        <span className="absolute top-[18%] left-[10%] text-5xl">✦</span>
        <span className="absolute top-[32%] right-[16%] text-4xl">✕</span>
        <span className="absolute bottom-[28%] left-[18%] text-5xl">✦</span>
        <span className="absolute bottom-[20%] right-[22%] text-6xl">✕</span>
        <span className="absolute top-[55%] right-[6%] text-3xl">◦</span>
      </div>

      {/* Wavy diagonal line */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="
            M -100 120
            C 300 40, 600 220, 900 360
            S 1300 720, 1600 920
          "
          fill="none"
          stroke="rgba(251, 146, 60, 0.25)"
          strokeWidth="2"
        />
      </svg>

      {/* ================= TOP LEFT NAV (REPLACED RapidX) ================= */}
      <div className="fixed top-0 left-0 z-50 px-8 py-6">
        <nav className="flex items-center text-lg font-medium text-gray-600">
          <span className="mr-1">←</span>
          <span className="hover:text-orange-500 hover:cursor-pointer">Home</span>
          <span className="mx-2 text-gray-400"></span>
        </nav>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="relative min-h-screen grid grid-rows-[auto_1fr] px-4">

        {/* Page Heading */}
        <div className="text-center pt-[clamp(5rem,10vh,9rem)] pb-[clamp(2rem,4vh,4rem)]">

          {/* CENTERED RapidX (BIGGER) */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[clamp(2.6rem,4.5vw,3.2rem)] font-semibold tracking-tight text-gray-800 mb-3"
          >
            Rapid<span className="text-orange-500">X</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-tight text-gray-800"
          >
            Let’s get you back into the flow
          </motion.h2>

          <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto">
            Everything you need is right where you left it — projects, orders,
            and insights, all in one calm, powerful workspace.
          </p>
        </div>

        {/* Login Card */}
        <div className="flex justify-center items-start pb-[clamp(2rem,6vh,6rem)]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-md bg-white rounded-3xl px-8 py-8
                       shadow-[0_24px_48px_rgba(0,0,0,0.10)] backdrop-blur-sm"
          >
            {/* Card Intro */}
            <div className="mb-6 text-center">
              <h3 className="text-lg font-medium text-gray-800">
                Sign in to continue
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Access your RapidX workspace securely.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium tracking-wide text-gray-500 mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-600 group-focus-within:text-orange-500 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                      <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8v1H4v-1z" />
                    </svg>
                  </span>

                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium tracking-wide text-gray-500 mb-1">
                  PASSWORD
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-600 group-focus-within:text-orange-500 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <rect x="6" y="10" width="12" height="11" rx="2" fill="currentColor" />
                      <path
                        d="M9 10V7a3 3 0 116 0v3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <input
                    type="password"
                    placeholder="••••••••••"
                    className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full mt-4 rounded-2xl bg-linear-to-r from-orange-400 to-orange-500
                           py-3.5 text-white font-medium
                           shadow-[0_14px_28px_rgba(249,115,22,0.45)]"
              >
                Take me in
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 flex justify-between text-sm text-gray-500">
              <button className="hover:text-orange-500 transition">
                Forgot password?
              </button>
              <button className="hover:text-orange-500 transition">
                Create account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
