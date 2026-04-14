# Saily AI Plan Optimizer ✈️

An AI-powered eSIM data plan recommendation tool built for [Saily](https://saily.com) — a travel eSIM app by Nord Security.

🔗 **Live Demo:** [saily-plan-optimizer.vercel.app](https://saily-plan-optimizer.vercel.app)

---

## The Problem

Saily users consistently pick the wrong data plan for their trips running out of data mid-journey or overpaying for data they don't use. This pain point was identified directly from App Store reviews and Trustpilot feedback.

Saily already has a generic data usage calculator on their website but it's not personalised, not inside the app, and doesn't use the user's actual history.

---

## The Solution

An in-app AI Plan Advisor that:

- Analyses the user's **full past usage history** across all previous trips
- Runs an **interactive data usage calculator** (browsing, streaming, video calls, maps)
- Uses **Groq AI (Llama 3.3)** to generate a personalised natural language recommendation
- Recommends the best plan with a clear explanation referencing the user's actual data

Example AI output:
> *"Last time you were in Europe you used 3.2GB over 5 days. With your streaming habits on this 7-day trip, we recommend the 5GB plan at €7.99, it gives you a comfortable buffer without overpaying."*

---

## Features

- 📊 **Usage history analysis** — calculates average, highest, and lowest daily usage across all past trips
- 🎚️ **Interactive data calculator** — sliders for browsing, streaming, video calls, and navigation
- 🤖 **Real AI recommendations** — Groq API generates personalised explanations per user
- 🌍 **Country + region search** — search specific countries or pick a continent
- ⬅️ **Back navigation** — step back through the flow without starting over
- ⚠️ **Saily Ultra upsell** — detects heavy users and recommends the unlimited plan
- 💛 **Saily-style UI** — matches Saily's actual design language (white, yellow, clean cards)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Groq API — Llama 3.3 70B |
| Deployment | Vercel |

> Built on Saily's exact production frontend stack.

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/trinayanswarup/saily-plan-optimizer.git
cd saily-plan-optimizer

# Install dependencies
npm install

# Add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Get a free Groq API key at [console.groq.com](https://console.groq.com).

---

## How It Works

1. User opens the **Plan Advisor** widget (bottom right)
2. Enters their **trip length** (number input + quick selects)
3. Searches a **country** or picks a **region**
4. Adjusts **usage sliders** — live GB estimate updates in real time
5. AI analyses past trips + calculator input → generates personalised recommendation
6. User sees **Top Pick** with AI explanation + option to explore all plans

---

## Why I Built This

This project was built as a side project to solve a real customer problem I found in Saily's reviews. It demonstrates:

- Product thinking — identifying a gap from real user feedback
- Full-stack development — Next.js API routes + frontend in one app
- AI integration — Groq API for natural language generation
- Real deployment — live on Vercel, not just a local demo

---


