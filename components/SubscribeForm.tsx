'use client';

import { useState, FormEvent } from 'react';

export default function SubscribeForm() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage("You're in! Check your inbox for a welcome email.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return <p className="email-success">{message}</p>;
  }

  return (
    <>
      <form className="email-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your@email.com"
          required
          className="email-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === 'loading'}
        />
        <button type="submit" className="btn-primary email-submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className="email-error">{message}</p>}
    </>
  );
}
