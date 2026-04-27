export default function NotFound() {
  return (
    <html>
      <body className="flex items-center justify-center min-h-screen font-sans bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">404 - Page Not Found</h1>
          <p className="text-slate-500 mb-8">The page you are looking for does not exist or has been moved.</p>
          <a href="/" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg">
            Return Home
          </a>
        </div>
      </body>
    </html>
  );
}
