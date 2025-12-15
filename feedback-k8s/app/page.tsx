'use client'

import { useEffect, useState } from 'react'

type Feedback = {
  id: string
  name: string
  message: string
  createdAt: string
}

export default function Home() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [items, setItems] = useState<Feedback[]>([])
  const [status, setStatus] = useState<string>('')

  async function load() {
    const res = await fetch('/api/feedback', { cache: 'no-store' })
    const data = await res.json()
    setItems(data.items ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Submitting...')
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    })
    if (!res.ok) {
      setStatus('Failed')
      return
    }
    setName('')
    setMessage('')
    setStatus('Submitted')
    await load()
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Feedback Collector</h1>

      <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Your feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
        />
        <button type="submit">Submit</button>
        <div>{status}</div>
      </form>

      <h2 style={{ marginTop: 32 }}>Latest feedback</h2>
      <ul style={{ display: 'grid', gap: 8, paddingLeft: 16 }}>
        {items.map((x) => (
          <li key={x.id}>
            <strong>{x.name}</strong>: {x.message}
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(x.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}
