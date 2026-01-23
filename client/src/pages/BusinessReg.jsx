import { motion } from "framer-motion";

export default function BusinessReg() {
  return (
    <div className="relative min-h-screen w-full bg-linear-to-br from-white via-orange-50 to-orange-100 overflow-hidden">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[460px] h-[460px] bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/4 w-[380px] h-[380px] bg-orange-100/40 rounded-full blur-3xl" />
      </div>

      {/* Decorative Wave */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M -100 120 C 300 40, 600 220, 900 360 S 1300 720, 1600 920"
          fill="none"
          stroke="rgba(251,146,60,0.22)"
          strokeWidth="2"
        />
      </svg>

      {/* Top Left Navigation */}
      <div className="absolute top-6 left-8 z-40">
        <nav className="flex items-center text-sm text-gray-600">
          <span className="mr-1">←</span>
          <span>Home</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-medium text-gray-700">Business Registration</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center text-center px-4 pt-[clamp(5rem,12vh,8rem)]">

        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(2.6rem,4.5vw,3.2rem)] font-semibold tracking-tight text-gray-800 mb-2"
        >
          Rapid<span className="text-orange-500">X</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(1.7rem,2.6vw,2.1rem)] font-semibold text-gray-800"
        >
          Business Details
        </motion.h2>

        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          Provide your business information to continue with RapidX registration.
        </p>

        {/* Form Card */}
        <div className="mt-12 w-full flex justify-center pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl bg-white rounded-3xl px-10 py-10 shadow-[0_24px_48px_rgba(0,0,0,0.1)]"
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Business Info */}
              <div className="md:col-span-2 text-left">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Business Information</h3>
              </div>

              <input className="input" placeholder="Company Name *" />
              <input className="input" placeholder="Type of Business *" />
              <input className="input md:col-span-2" placeholder="Company Registration No. *" />

              {/* Address */}
              <div className="md:col-span-2 text-left mt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Business Address Details</h3>
              </div>

              <input className="input md:col-span-2" placeholder="Company Address *" />
              <input className="input" placeholder="City *" />
              <input className="input" placeholder="State *" />
              <input className="input" placeholder="Pincode *" />

              {/* Contact */}
              <div className="md:col-span-2 text-left mt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Business Contact Details</h3>
              </div>

              <input className="input" placeholder="Contact Person Name *" />
              <input className="input" placeholder="Business Phone Number *" />

              {/* Actions */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                <button
                  type="reset"
                  className="px-6 py-2 rounded-xl border border-gray-300 text-gray-600 hover:border-gray-400"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 rounded-xl bg-linear-to-r from-orange-400 to-orange-500 text-white font-medium shadow-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Input Styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          border-color: #fb923c;
          box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.25);
        }
      `}</style>
    </div>
  );
}
