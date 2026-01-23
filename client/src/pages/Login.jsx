import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-white via-orange-50 to-orange-100 flex flex-col">
      
      {/* Brand */}
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
          Rapid<span className="text-orange-500">X</span>
        </h1>
      </div>

      {/* Login Card */}
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-3xl 
                     shadow-[0_20px_40px_rgba(0,0,0,0.08)] 
                     px-8 py-9"
        >
          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-800 leading-snug">
              Let’s get you <br /> back on track
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              Sign in to RapidX and continue managing everything from one place.
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
                <span className="absolute inset-y-0 left-3 flex items-center 
                                 text-gray-600 group-focus-within:text-orange-500 transition">
                  {/* Filled User Icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                    <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8v1H4v-1z" />
                  </svg>
                </span>

                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-gray-300 
                             pl-11 pr-4 py-3 text-sm 
                             placeholder-gray-400
                             focus:outline-none focus:ring-2 
                             focus:ring-orange-200 focus:border-orange-400 
                             transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-500 mb-1">
                PASSWORD
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-3 flex items-center 
                                 text-gray-600 group-focus-within:text-orange-500 transition">
                  {/* Filled Lock Icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8h-1V6a4 4 0 00-8 0v2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2zm-7-2a2 2 0 114 0v2h-4V6z" />
                  </svg>
                </span>

                <input
                  type="password"
                  placeholder="••••••••••"
                  className="w-full rounded-xl border border-gray-300 
                             pl-11 pr-4 py-3 text-sm 
                             placeholder-gray-400
                             focus:outline-none focus:ring-2 
                             focus:ring-orange-200 focus:border-orange-400 
                             transition"
                />
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-3 rounded-2xl 
                         bg-linear-to-r from-orange-400 to-orange-500
                         py-3.5 text-white font-medium 
                         shadow-[0_10px_20px_rgba(249,115,22,0.35)]
                         hover:shadow-[0_15px_30px_rgba(249,115,22,0.45)]
                         transition"
            >
              Continue to RapidX
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-7 flex justify-between text-sm text-gray-500">
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
  );
}
