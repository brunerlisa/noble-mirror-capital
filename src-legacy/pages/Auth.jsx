export default function Auth() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-[#070a1b] px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold mb-3">Interactive Prime Trade</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Sign in and sign up are handled by the live Next.js app at{' '}
          <a className="text-primary" href="/auth/sign-in">
            /auth/sign-in
          </a>
          .
        </p>
      </div>
    </div>
  )
}
