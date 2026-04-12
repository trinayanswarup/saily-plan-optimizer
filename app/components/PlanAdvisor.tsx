'use client'

import { useState } from 'react'

const COUNTRIES: { name: string; region: Region }[] = [
  { name: 'France', region: 'Europe' },
  { name: 'Germany', region: 'Europe' },
  { name: 'Italy', region: 'Europe' },
  { name: 'Spain', region: 'Europe' },
  { name: 'Portugal', region: 'Europe' },
  { name: 'Netherlands', region: 'Europe' },
  { name: 'Greece', region: 'Europe' },
  { name: 'United Kingdom', region: 'Europe' },
  { name: 'Switzerland', region: 'Europe' },
  { name: 'Poland', region: 'Europe' },
  { name: 'Turkey', region: 'Europe' },
  { name: 'Lithuania', region: 'Europe' },
  { name: 'Latvia', region: 'Europe' },
  { name: 'Estonia', region: 'Europe' },
  { name: 'Thailand', region: 'Asia' },
  { name: 'Japan', region: 'Asia' },
  { name: 'South Korea', region: 'Asia' },
  { name: 'Singapore', region: 'Asia' },
  { name: 'Vietnam', region: 'Asia' },
  { name: 'Indonesia', region: 'Asia' },
  { name: 'Malaysia', region: 'Asia' },
  { name: 'Philippines', region: 'Asia' },
  { name: 'India', region: 'Asia' },
  { name: 'China', region: 'Asia' },
  { name: 'Hong Kong', region: 'Asia' },
  { name: 'UAE', region: 'Asia' },
  { name: 'USA', region: 'Americas' },
  { name: 'Canada', region: 'Americas' },
  { name: 'Mexico', region: 'Americas' },
  { name: 'Brazil', region: 'Americas' },
  { name: 'Argentina', region: 'Americas' },
  { name: 'Colombia', region: 'Americas' },
  { name: 'Peru', region: 'Americas' },
  { name: 'Chile', region: 'Americas' },
]

const PAST_USAGE = [
  { destination: 'Europe', days: 5, gbUsed: 3.2 },
  { destination: 'Asia', days: 10, gbUsed: 7.8 },
  { destination: 'Americas', days: 7, gbUsed: 4.1 },
]

const PLANS = {
  Europe: [
    { name: 'Europe 3GB', data: '3 GB', validity: '5 days', price: '€4.99' },
    { name: 'Europe 5GB', data: '5 GB', validity: '7 days', price: '€7.99' },
    { name: 'Europe 10GB', data: '10 GB', validity: '15 days', price: '€12.99' },
    { name: 'Europe 20GB', data: '20 GB', validity: '30 days', price: '€22.99' },
  ],
  Asia: [
    { name: 'Asia 3GB', data: '3 GB', validity: '5 days', price: '€5.99' },
    { name: 'Asia 5GB', data: '5 GB', validity: '7 days', price: '€7.99' },
    { name: 'Asia 8GB', data: '8 GB', validity: '10 days', price: '€10.99' },
    { name: 'Asia 15GB', data: '15 GB', validity: '20 days', price: '€16.99' },
  ],
  Americas: [
    { name: 'Americas 3GB', data: '3 GB', validity: '5 days', price: '€5.99' },
    { name: 'Americas 6GB', data: '6 GB', validity: '10 days', price: '€9.99' },
    { name: 'Americas 12GB', data: '12 GB', validity: '20 days', price: '€15.99' },
    { name: 'Americas 20GB', data: '20 GB', validity: '30 days', price: '€24.99' },
  ],
  Global: [
    { name: 'Global 5GB', data: '5 GB', validity: '7 days', price: '€12.99' },
    { name: 'Global 10GB', data: '10 GB', validity: '15 days', price: '€19.99' },
    { name: 'Global 20GB', data: '20 GB', validity: '30 days', price: '€34.99' },
    { name: 'Global 30GB', data: '30 GB', validity: '30 days', price: '€44.99' },
  ],
}

const USAGE_MULTIPLIER: Record<string, number> = {
  Light: 0.7,
  Medium: 1.0,
  Heavy: 1.5,
}

type Step = 'intro' | 'days' | 'region' | 'usage' | 'loading' | 'result'
type Region = 'Europe' | 'Asia' | 'Americas' | 'Global'

interface Recommendation {
  topPick: (typeof PLANS.Europe)[0]
  alternative: (typeof PLANS.Europe)[0]
  pastTrip: (typeof PAST_USAGE)[0] | null
  estimatedGB: number
  days: number
  region: string
  usage: string
  explanation: string
  overallAvgDaily: number
  highestTrip: (typeof PAST_USAGE)[0]
  lowestTrip: (typeof PAST_USAGE)[0]
  tripsAnalysed: number
  calculatedDailyGB: number
}

export default function PlanAdvisor({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const [step, setStep] = useState<Step>('intro')
  const [days, setDays] = useState('7')
  const [region, setRegion] = useState<Region | ''>('')
  const [countrySearch, setCountrySearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [usage, setUsage] = useState('')
  const [sliders, setSliders] = useState({
  browsing: 2,
  streaming: 0.5,
  videocalls: 0.5,
  maps: 1,
  })
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)

  function openAdvisor() {
    setOpen(true)
    setStep('intro')
    setDays('7')
    setRegion('')
    setUsage('')
    setRecommendation(null)
  }

  function handleDaysSubmit() {
    if (!days || isNaN(Number(days)) || Number(days) < 1) return
    setStep('region')
  }

  function handleRegionSelect(r: Region) {
    setRegion(r)
    setStep('usage')
  }

  function handleUsageSelect(u: string) {
  setUsage(u)
  setStep('loading')
  generateRecommendation(Number(days), region as Region, u, undefined)
  }

  function handleUsageCalculator() {
  const dailyGB = (sliders.browsing * 40 + sliders.streaming * 300 + sliders.videocalls * 200 + sliders.maps * 15) / 1024
  const level = dailyGB < 0.5 ? 'Light' : dailyGB < 1.2 ? 'Medium' : 'Heavy'
  setUsage(level)
  setStep('loading')
  generateRecommendation(Number(days), region as Region, level, dailyGB)
  }

  async function generateRecommendation(tripDays: number, tripRegion: Region, tripUsage: string, calculatedDailyGB?: number) {
    const pastTrip = PAST_USAGE.find(t => t.destination === tripRegion) || PAST_USAGE[0]

    // Calculate across ALL trips
    const allDailyAvgs = PAST_USAGE.map(t => t.gbUsed / t.days)
    const overallAvgDaily = allDailyAvgs.reduce((a, b) => a + b, 0) / allDailyAvgs.length
    const highestTrip = PAST_USAGE.reduce((a, b) => (a.gbUsed / a.days > b.gbUsed / b.days ? a : b))
    const lowestTrip = PAST_USAGE.reduce((a, b) => (a.gbUsed / a.days < b.gbUsed / b.days ? a : b))

    const multiplier = USAGE_MULTIPLIER[tripUsage] || 1
    // Use slider calculation if available, otherwise fall back to history average
    const estimatedGB = calculatedDailyGB
      ? parseFloat((calculatedDailyGB * tripDays).toFixed(1))
      : parseFloat((overallAvgDaily * tripDays * multiplier).toFixed(1))
    
      const plans = PLANS[tripRegion]

    // Top pick — smallest plan that covers the estimate
    const coveringPlans = plans.filter(p => parseFloat(p.data) >= estimatedGB)
    const topPick = coveringPlans.length > 0
      ? coveringPlans.sort((a, b) => parseFloat(a.data) - parseFloat(b.data))[0]
      : plans.sort((a, b) => parseFloat(b.data) - parseFloat(a.data))[0]

    // Alternative — always the plan one size smaller than top pick
    const allSorted = [...plans].sort((a, b) => parseFloat(a.data) - parseFloat(b.data))
    const topPickIndex = allSorted.findIndex(p => p.name === topPick.name)
    const alternative = topPickIndex > 0
      ? allSorted[topPickIndex - 1]
      : allSorted[topPickIndex + 1]

    // Get AI explanation from Groq
    let explanation = 'This plan perfectly matches your usage pattern.'
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        days: tripDays,
        region: tripRegion,
        dailyGB: calculatedDailyGB || overallAvgDaily,
        pastTrip,
        topPick,
        alternative,
        tripsAnalysed: PAST_USAGE.length,
        calculatedDailyGB: calculatedDailyGB || overallAvgDaily,
        highestTrip,
        lowestTrip,
      }),
      })
      const data = await res.json()
      explanation = data.explanation || explanation
    } catch (e) {
      console.error('Groq API error:', e)
    }

    setRecommendation({
    topPick,
    alternative,
    pastTrip,
    estimatedGB,
    days: tripDays,
    region: tripRegion,
    usage: tripUsage,
    explanation,
    overallAvgDaily: parseFloat(overallAvgDaily.toFixed(2)),
    highestTrip,
    lowestTrip,
    tripsAnalysed: PAST_USAGE.length,
    calculatedDailyGB: calculatedDailyGB || overallAvgDaily,
  })
    setStep('result')
  }

  function reset() {
    setStep('intro')
    setDays('7')
    setRegion('')
    setUsage('')
    setRecommendation(null)
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={openAdvisor}
          className="fixed bottom-8 right-8 flex items-center gap-2 bg-gray-900 text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-gray-700 transition-all hover:scale-105 z-50"
        >
          <span className="text-lg">✨</span>
          <span className="text-sm font-bold">Plan Advisor</span>
        </button>
      )}

      {/* Widget Panel */}
      {open && (
        <div className="fixed bottom-8 right-8 w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden"
          style={{ height: '580px', maxWidth: 'calc(100vw - 32px)' }}>

          {/* Header */}
          <div className="bg-gray-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFE600] flex items-center justify-center text-base">✨</div>
              <div>
                <p className="font-black text-white text-sm">Plan Advisor</p>
                <p className="text-green-400 text-xs">● Powered by AI</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-sm">
              ✕
            </button>
          </div>

          {/* Progress bar + back button */}
          <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0">
            {/* Back button */}
            {['days', 'region', 'usage', 'result'].includes(step) && (
              <button
                onClick={() => {
                  if (step === 'days') setStep('intro')
                  else if (step === 'region') setStep('days')
                  else if (step === 'usage') setStep('region')
                  else if (step === 'result') setStep('usage')
                }}
                className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors flex-shrink-0 text-gray-600 text-sm">
                ←
              </button>
            )}
            {/* Progress dots */}
            <div className="flex gap-1 flex-1">
              {(['intro', 'days', 'region', 'usage', 'loading', 'result'] as Step[]).map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-all ${
                  ['intro', 'days', 'region', 'usage', 'loading', 'result'].indexOf(step) >= i
                    ? 'bg-gray-900'
                    : 'bg-gray-200'
                }`} />
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">

            {/* INTRO */}
            {step === 'intro' && (
              <div className="flex flex-col gap-4 h-full justify-between">
                <div className="flex flex-col gap-4">
                  <div className="bg-[#F5F7FA] rounded-2xl p-5">
                    <p className="font-black text-gray-900 text-base">Hey! I'm your Data Planner ✈️</p>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      I'll analyse your past usage and recommend the perfect Saily plan for your next trip. Just 3 quick questions!
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: '📅', label: 'Trip length' },
                      { icon: '🌍', label: 'Destination' },
                      { icon: '📱', label: 'Usage type' },
                    ].map(item => (
                      <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                        <span className="text-xl">{item.icon}</span>
                        <p className="text-xs text-gray-500 mt-1 font-medium">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setStep('days')}
                  className="w-full py-4 bg-[#FFE600] text-gray-900 font-black rounded-2xl text-sm hover:bg-yellow-400 transition-colors">
                  Let's find my plan →
                </button>
              </div>
            )}

            {/* STEP 1 — DAYS */}
            {step === 'days' && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-black text-gray-900 text-base">How long is your trip? 📅</p>
                  <p className="text-gray-400 text-sm mt-1">Type a number or use quick selects below</p>
                </div>

                <div className="bg-[#F5F7FA] rounded-2xl p-6 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setDays(d => String(Math.max(1, Number(d) - 1)))}
                      className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-gray-900 text-xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                      −
                    </button>
                    <div className="text-center">
                      <input
                        type="number"
                        value={days}
                        onChange={e => setDays(e.target.value)}
                        className="w-20 text-center text-4xl font-black text-gray-900 bg-transparent outline-none border-b-2 border-[#FFE600] pb-1"
                        min={1}
                      />
                      <p className="text-gray-400 text-xs mt-2">days</p>
                    </div>
                    <button
                      onClick={() => setDays(d => String(Number(d) + 1))}
                      className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-gray-900 text-xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                      +
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {['3', '5', '7', '10', '14', '30'].map(d => (
                      <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                          days === d
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}>
                        {d} days
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDaysSubmit}
                  className="w-full py-4 bg-[#FFE600] text-gray-900 font-black rounded-2xl text-sm hover:bg-yellow-400 transition-colors">
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 2 — DESTINATION */}
            {step === 'region' && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-black text-gray-900 text-base">Where are you headed? 🌍</p>
                  <p className="text-gray-400 text-sm mt-1">Search a country or pick a region</p>
                </div>

                {/* Selected country state */}
                {selectedCountry ? (
                  <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Destination</p>
                      <p className="text-white font-black text-lg">{selectedCountry}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{region}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCountry('')
                        setCountrySearch('')
                        setRegion('')
                      }}
                      className="text-gray-400 text-xs underline hover:text-white transition-colors">
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Search box */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search country... e.g. Thailand"
                        value={countrySearch}
                        onChange={e => {
                          setCountrySearch(e.target.value)
                          setShowDropdown(true)
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full border-2 border-gray-200 focus:border-gray-900 rounded-2xl px-4 py-3 text-sm font-medium outline-none transition-colors"
                      />

                      {/* Dropdown */}
                      {showDropdown && countrySearch.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-48 overflow-y-auto">
                          {COUNTRIES.filter(c =>
                            c.name.toLowerCase().includes(countrySearch.toLowerCase())
                          ).length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400">No countries found</div>
                          ) : (
                            COUNTRIES.filter(c =>
                              c.name.toLowerCase().includes(countrySearch.toLowerCase())
                            ).map(c => (
                              <button
                                key={c.name}
                                onClick={() => {
                                  setSelectedCountry(c.name)
                                  setRegion(c.region)
                                  setCountrySearch(c.name)
                                  setShowDropdown(false)
                                }}
                                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0">
                                <span>{c.name}</span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.region}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium">or pick a region</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Region buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { region: 'Europe', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/4x3/eu.svg', desc: 'EU, UK & more' },
                        { region: 'Asia', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/4x3/jp.svg', desc: 'East & Southeast Asia' },
                        { region: 'Americas', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/4x3/us.svg', desc: 'North & South America' },
                        { region: 'Global', icon: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/4x3/un.svg', desc: '200+ destinations' },
                      ] as { region: Region; icon: string; desc: string }[]).map(r => (
                        <button
                          key={r.region}
                          onClick={() => handleRegionSelect(r.region)}
                          className="bg-white border-2 border-gray-100 hover:border-gray-900 rounded-2xl p-4 text-left transition-all hover:shadow-md active:scale-95">
                          <img src={r.icon} alt={r.region} className="w-8 h-6 rounded object-cover mb-2" />
                          <p className="font-black text-gray-900 text-sm">{r.region}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{r.desc}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Continue button — only show when country selected */}
                {selectedCountry && (
                  <button
                    onClick={() => setStep('usage')}
                    className="w-full py-4 bg-[#FFE600] text-gray-900 font-black rounded-2xl text-sm hover:bg-yellow-400 transition-colors">
                    Continue →
                  </button>
                )}
              </div>
            )}

            {/* STEP 3 — USAGE CALCULATOR */}
            {step === 'usage' && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-black text-gray-900 text-base">How do you use data? 📱</p>
                  <p className="text-gray-400 text-sm mt-1">Adjust sliders to match your daily habits</p>
                </div>

                <div className="bg-[#F5F7FA] rounded-2xl p-4 flex flex-col gap-4">
                  {[
                    { key: 'browsing', label: '🌐 Browsing & social', unit: 'hrs/day', max: 8, mbPerHour: 40 },
                    { key: 'streaming', label: '📺 Video streaming', unit: 'hrs/day', max: 6, mbPerHour: 300 },
                    { key: 'videocalls', label: '📹 Video calls', unit: 'hrs/day', max: 4, mbPerHour: 200 },
                    { key: 'maps', label: '🗺️ Maps & navigation', unit: 'hrs/day', max: 4, mbPerHour: 15 },
                  ].map(activity => (
                    <div key={activity.key}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold text-gray-700">{activity.label}</p>
                        <span className="text-sm font-black text-gray-900">
                          {sliders[activity.key as keyof typeof sliders]} {activity.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={activity.max}
                        step={0.5}
                        value={sliders[activity.key as keyof typeof sliders]}
                        onChange={e => {
                          const newVal = parseFloat(e.target.value)
                          const otherTotal = Object.entries(sliders)
                            .filter(([k]) => k !== activity.key)
                            .reduce((sum, [, v]) => sum + v, 0)
                          if (otherTotal + newVal <= 16) {
                            setSliders(s => ({ ...s, [activity.key]: newVal }))
                          }
                        }}
                        className="w-full accent-gray-900 h-1.5 rounded-full"
                      />
                    </div>
                  ))}

                  {/* Hours used indicator */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                    <p className="text-xs text-gray-400">Total hours/day</p>
                    <p className={`text-xs font-black ${
                      Object.values(sliders).reduce((a, b) => a + b, 0) >= 14
                        ? 'text-orange-500'
                        : 'text-gray-600'
                    }`}>
                      {Object.values(sliders).reduce((a, b) => a + b, 0).toFixed(1)} / 16 hrs
                    </p>
                  </div>
                </div>

                {/* Live estimate */}
                {(() => {
                  const dailyGB = (sliders.browsing * 40 + sliders.streaming * 300 + sliders.videocalls * 200 + sliders.maps * 15) / 1024
                  const totalGB = dailyGB * Number(days)
                  const isVeryHigh = totalGB > 20

                  return (
                    <div className={`rounded-2xl p-4 flex items-center justify-between border-2 ${
                      isVeryHigh ? 'border-orange-400 bg-orange-50' : 'border-gray-900 bg-white'
                    }`}>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Estimated daily usage</p>
                        <p className={`text-2xl font-black mt-0.5 ${isVeryHigh ? 'text-orange-500' : 'text-gray-900'}`}>
                          {dailyGB.toFixed(2)} GB/day
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-medium">For {days} days</p>
                        <p className={`text-2xl font-black mt-0.5 ${isVeryHigh ? 'text-orange-500' : 'text-gray-900'}`}>
                          {totalGB.toFixed(1)} GB total
                        </p>
                      </div>
                    </div>
                  )
                })()}

                <button
                  onClick={() => handleUsageCalculator()}
                  className="w-full py-4 bg-[#FFE600] text-gray-900 font-black rounded-2xl text-sm hover:bg-yellow-400 transition-colors">
                  Find my plan →
                </button>
              </div>
            )}

            {/* LOADING */}
            {step === 'loading' && (
              <div className="flex flex-col items-center justify-center gap-4 h-full">
                <div className="w-16 h-16 rounded-2xl bg-[#FFE600] flex items-center justify-center text-3xl animate-pulse">✨</div>
                <p className="font-black text-gray-900 text-base">Analysing your usage...</p>
                <p className="text-gray-400 text-sm text-center max-w-48">Checking your past trips and finding the best match</p>
                <div className="flex gap-1.5 mt-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* RESULT */}
            {step === 'result' && recommendation && (
              <div className="flex flex-col gap-3">

                {/* Usage history */}
                <div className="bg-[#F5F7FA] rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">📊 Your Usage History</p>
                    <span className="text-xs bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                      {recommendation.tripsAnalysed} trips analysed
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5">
                    <p className="text-gray-500 text-xs">Your history avg</p>
                    <p className="text-gray-900 font-bold text-xs text-right">{recommendation.overallAvgDaily} GB/day</p>
                    <p className="text-gray-500 text-xs">Highest usage trip</p>
                    <p className="text-gray-900 font-bold text-xs text-right">{recommendation.highestTrip.destination} · {(recommendation.highestTrip.gbUsed / recommendation.highestTrip.days).toFixed(2)} GB/day</p>
                    <p className="text-gray-500 text-xs">Lowest usage trip</p>
                    <p className="text-gray-900 font-bold text-xs text-right">{recommendation.lowestTrip.destination} · {(recommendation.lowestTrip.gbUsed / recommendation.lowestTrip.days).toFixed(2)} GB/day</p>
                    <div className="col-span-2 border-t border-gray-200 my-1" />
                    <p className="text-gray-500 text-xs font-semibold">Your calculator usage</p>
                    <p className="text-gray-900 font-bold text-xs text-right">{(recommendation.calculatedDailyGB || recommendation.overallAvgDaily).toFixed(2)} GB/day</p>
                    <p className="text-gray-500 text-xs">This trip</p>
                    <p className="text-gray-900 font-bold text-xs text-right">{recommendation.days} days · {recommendation.usage}</p>
                    <p className="text-gray-500 text-xs">Estimated need</p>
                    <p className="text-gray-900 font-black text-sm text-right">~{recommendation.estimatedGB} GB</p>
                  </div>
                </div>

                {/* Ultra plan warning for very high usage */}
                {recommendation.estimatedGB > 20 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                    <p className="text-orange-700 font-black text-sm">⚠️ High data need detected</p>
                    <p className="text-orange-600 text-xs mt-1 leading-relaxed">
                      You're estimating {recommendation.estimatedGB}GB — more than our standard plans cover. Consider <span className="font-black">Saily Ultra</span> for unlimited data across 113 countries.
                    </p>
                    <button className="mt-3 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-xs transition-colors">
                      Learn about Saily Ultra →
                    </button>
                  </div>
                )}

                {/* Top Pick */}
                {recommendation.estimatedGB <= 20 && (
                  <div className="bg-gray-900 rounded-2xl p-4">
                    <p className="text-[#FFE600] text-xs font-black uppercase tracking-wider mb-3">⭐ Top Pick</p>
                    <p className="font-black text-white text-lg">{recommendation.topPick.name}</p>
                    <div className="flex gap-2 mt-3">
                      <div className="bg-white/10 rounded-xl px-3 py-2 text-center flex-1">
                        <p className="text-gray-400 text-xs">Data</p>
                        <p className="text-white font-black text-sm">{recommendation.topPick.data}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl px-3 py-2 text-center flex-1">
                        <p className="text-gray-400 text-xs">Validity</p>
                        <p className="text-white font-black text-sm">{recommendation.topPick.validity}</p>
                      </div>
                      <div className="bg-[#FFE600]/20 rounded-xl px-3 py-2 text-center flex-1">
                        <p className="text-gray-400 text-xs">Price</p>
                        <p className="text-[#FFE600] font-black text-sm">{recommendation.topPick.price}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-3 italic leading-relaxed">"{recommendation.explanation}"</p>
                    <button className="w-full mt-4 py-3 bg-[#FFE600] text-gray-900 font-black rounded-xl text-sm hover:bg-yellow-400 transition-colors">
                      Buy the Plan →
                    </button>
                  </div>
                )}

                {/* Also show top pick for high usage but with caveat */}
                {recommendation.estimatedGB > 20 && (
                  <div className="bg-gray-900 rounded-2xl p-4">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-3">📦 Largest Available Plan</p>
                    <p className="font-black text-white text-lg">{recommendation.topPick.name}</p>
                    <div className="flex gap-2 mt-3">
                      <div className="bg-white/10 rounded-xl px-3 py-2 text-center flex-1">
                        <p className="text-gray-400 text-xs">Data</p>
                        <p className="text-white font-black text-sm">{recommendation.topPick.data}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl px-3 py-2 text-center flex-1">
                        <p className="text-gray-400 text-xs">Validity</p>
                        <p className="text-white font-black text-sm">{recommendation.topPick.validity}</p>
                      </div>
                      <div className="bg-[#FFE600]/20 rounded-xl px-3 py-2 text-center flex-1">
                        <p className="text-gray-400 text-xs">Price</p>
                        <p className="text-[#FFE600] font-black text-sm">{recommendation.topPick.price}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-3 italic">Note: This may not fully cover your estimated usage. Consider Saily Ultra for unlimited data.</p>
                    <button className="w-full mt-4 py-3 bg-[#FFE600] text-gray-900 font-black rounded-xl text-sm hover:bg-yellow-400 transition-colors">
                      Buy the Plan →
                    </button>
                  </div>
                )}

                {/* Explore other plans */}
                <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-black text-gray-900 text-sm">Not quite right?</p>
                    <p className="text-gray-400 text-xs mt-0.5">Browse all {recommendation.region} plans and pick your own.</p>
                  </div>
                  <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-900 font-black px-4 py-2.5 rounded-xl text-xs hover:bg-gray-50 transition-colors shadow-sm">
                    Explore plans →
                  </button>
                </div>

                {/* Start over */}
                <button
                  onClick={reset}
                  className="text-gray-400 text-xs text-center hover:text-gray-600 transition-colors py-1 font-medium">
                  ↩ Start over
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}