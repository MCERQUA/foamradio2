"use client"

import { useState } from "react"

const WEBHOOK_URL = "https://josh.jam-bot.com/social-api/api/leads/webhook/netlify?tenant=josh&site=sprayfoamradio.com"

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const body = new URLSearchParams(data as Record<string, string>).toString()
      await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body })
      fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => {})
      setStatus("sent")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  const input = "w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"

  return (
    <section id="contact" className="py-16 px-6 border-t border-border">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Contact / Advertise</h2>
        <p className="text-muted-foreground mb-8">Interested in advertising or have a question? Reach out below.</p>

        {status === "sent" ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <h3 className="text-xl font-bold mb-2">Message Received!</h3>
            <p className="text-muted-foreground">We'll be in touch within one business day.</p>
          </div>
        ) : (
          <form
            name="quote"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input type="hidden" name="form-name" value="quote" />
            <p className="hidden"><label>Don't fill this out: <input name="bot-field" /></label></p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input required name="name" type="text" className={input} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input required name="email" type="email" className={input} placeholder="you@company.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Phone</label>
              <input name="phone" type="tel" className={input} placeholder="(555) 123-4567" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Inquiry Type</label>
              <select name="inquiryType" className={input}>
                <option value="">Select…</option>
                <option value="advertising">Advertising / Sponsorship</option>
                <option value="content">Content Submission</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Message</label>
              <textarea name="message" rows={4} className={input} placeholder="Tell us about your interest…" />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>

            {status === "error" && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
