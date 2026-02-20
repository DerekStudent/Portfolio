export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo / branding */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-off-white tracking-tight">D.</span>
            <span className="text-xs text-text-dim">Built with React, Tailwind & passion.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/DerekStudent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dim hover:text-off-white transition-colors duration-300"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a
              href="mailto:hello@derek.dev"
              className="text-text-dim hover:text-off-white transition-colors duration-300"
              aria-label="Email"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center my-6">
          <span className="block w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-text-dim text-center">
          &copy; {new Date().getFullYear()} Derek. All rights reserved. Designed & built from scratch.
        </p>
      </div>
    </footer>
  )
}
