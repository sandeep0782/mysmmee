"use client";

export default function BookLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-200 bg-opacity-80 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-24 h-24 animate-spin-slow"
        >
          <defs>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF156D" />
              <stop offset="100%" stopColor="#FF7D00" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#spinnerGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="70 50"
          />
        </svg>

        {/* Loading Text */}
        <p className="text-xl font-semibold text-gray-800">
          Loading Books...
        </p>
        <p className="text-sm text-gray-600">
          Your next favorite read is on its way!
        </p>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
