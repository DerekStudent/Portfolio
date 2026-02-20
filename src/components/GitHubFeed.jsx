import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from './useInView'

const GITHUB_USERNAME = 'DerekStudent'

function timeAgo(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const seconds = Math.floor((now - then) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function eventDescription(event) {
  const repo = event.repo?.name?.split('/')[1] || event.repo?.name || ''
  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload?.commits?.length || 0
      return { action: 'Pushed', detail: `${commits} commit${commits !== 1 ? 's' : ''} to`, repo }
    }
    case 'CreateEvent': {
      const refType = event.payload?.ref_type || 'repository'
      return { action: 'Created', detail: `${refType}`, repo }
    }
    case 'DeleteEvent': {
      const refType = event.payload?.ref_type || 'branch'
      return { action: 'Deleted', detail: `${refType} in`, repo }
    }
    case 'WatchEvent':
      return { action: 'Starred', detail: '', repo }
    case 'ForkEvent':
      return { action: 'Forked', detail: '', repo }
    case 'IssuesEvent':
      return { action: event.payload?.action === 'opened' ? 'Opened issue in' : 'Updated issue in', detail: '', repo }
    case 'PullRequestEvent':
      return { action: event.payload?.action === 'opened' ? 'Opened PR in' : 'Updated PR in', detail: '', repo }
    case 'IssueCommentEvent':
      return { action: 'Commented on', detail: 'issue in', repo }
    default:
      return { action: event.type?.replace('Event', ''), detail: 'in', repo }
  }
}

function eventIcon(type) {
  switch (type) {
    case 'PushEvent':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
      )
    case 'CreateEvent':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    case 'ForkEvent':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
          <line x1="12" y1="12" x2="12" y2="15" />
        </svg>
      )
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
  }
}

export default function GitHubFeed() {
  const [ref, inView] = useInView(0.08)
  const [events, setEvents] = useState([])
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!inView) return

    const fetchData = async () => {
      try {
        const [eventsRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=4`),
        ])

        if (!eventsRes.ok || !reposRes.ok) throw new Error('GitHub API error')

        const [eventsData, reposData] = await Promise.all([
          eventsRes.json(),
          reposRes.json(),
        ])

        setEvents(eventsData.slice(0, 8))
        setRepos(reposData)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [inView])

  return (
    <section id="github" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-off-white tracking-tight mb-2"
      >
        GitHub Activity
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-text-muted text-sm mb-10 max-w-md"
      >
        Recent activity from my GitHub profile — live from the API.
      </motion.p>

      {loading && inView && (
        <div className="flex justify-center py-12">
          <div className="w-5 h-5 border-2 border-border dark:border-border border-t-accent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-text-dim text-sm">Couldn&apos;t load GitHub data. Check back later.</p>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs text-accent hover:text-accent-hover transition-colors underline underline-offset-4"
          >
            View profile on GitHub →
          </a>
        </div>
      )}

      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-[1fr_320px] gap-5"
        >
          {/* Activity Feed */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-dim">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span className="text-xs font-semibold text-text-main uppercase tracking-widest">Recent Activity</span>
            </div>
            <div className="divide-y divide-border">
              {events.map((event, i) => {
                const { action, detail, repo } = eventDescription(event)
                return (
                  <motion.div
                    key={event.id || i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="px-5 py-3.5 flex items-start gap-3 hover:bg-bg-elevated/40 transition-colors duration-200"
                  >
                    <div className="mt-0.5 text-text-dim shrink-0">{eventIcon(event.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-main leading-snug">
                        <span className="font-medium text-off-white">{action}</span>{' '}
                        {detail && <span className="text-text-muted">{detail} </span>}
                        <span className="font-medium text-accent">{repo}</span>
                      </p>
                      {event.type === 'PushEvent' && event.payload?.commits?.[0] && (
                        <p className="text-[11px] text-text-dim mt-0.5 truncate">
                          &quot;{event.payload.commits[0].message}&quot;
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-text-dim tracking-wider whitespace-nowrap mt-0.5">
                      {timeAgo(event.created_at)}
                    </span>
                  </motion.div>
                )
              })}
              {events.length === 0 && (
                <div className="px-5 py-8 text-center text-text-dim text-sm">No recent activity found.</div>
              )}
            </div>
          </div>

          {/* Top Repos */}
          <div className="flex flex-col gap-2.5">
            <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-dim">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-xs font-semibold text-text-main uppercase tracking-widest">Repositories</span>
              </div>
              <div className="divide-y divide-border">
                {repos.map((repo, i) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-5 py-3.5 hover:bg-bg-elevated/40 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-off-white truncate">{repo.name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        {repo.language && (
                          <span className="text-[10px] text-text-dim uppercase tracking-wider">{repo.language}</span>
                        )}
                        <span className="flex items-center gap-1 text-text-dim text-[10px]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          {repo.stargazers_count}
                        </span>
                      </div>
                    </div>
                    {repo.description && (
                      <p className="text-[11px] text-text-dim leading-snug truncate">{repo.description}</p>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Profile link */}
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-bg-card border border-border rounded-xl hover:border-border-hover transition-all duration-300 group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-text-dim group-hover:text-text-main transition-colors">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-xs font-medium text-text-muted group-hover:text-off-white transition-colors tracking-wider">
                View Full Profile
              </span>
            </a>
          </div>
        </motion.div>
      )}
    </section>
  )
}
