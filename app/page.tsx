'use client'

import { useState } from 'react'
import PlanAdvisor from './components/PlanAdvisor'

export default function Home() {
  const [advisorOpen, setAdvisorOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('My Plans')

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Announcement Bar */}
      <div className="bg-black text-white text-sm py-3 text-center flex items-center justify-center gap-4">
        <span>✨ Meet your AI Plan Advisor — find the perfect eSIM plan in seconds</span>
        <button
          onClick={() => setAdvisorOpen(true)}
          className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
          Try it now
        </button>
      </div>

      {/* Nav */}
      <nav className="border-b border-gray-100 px-12 py-4 flex items-center justify-between sticky top-0 bg-white z-40">
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight leading-none">Saily</span>
            <div className="h-[2px] w-full bg-black rounded mt-0.5" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500 font-medium">
            <button className="hover:text-black transition-colors">Product</button>
            <button className="hover:text-black transition-colors">Resources</button>
            <button className="hover:text-black transition-colors">Offers</button>
            <button className="hover:text-black transition-colors">Help</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-sm text-gray-500 font-medium hover:text-black transition-colors">Sign in</button>
          <button className="flex items-center gap-2 border border-gray-200 text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
            🔍 Destinations
          </button>
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">A</div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#F5F7FA] border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-12 py-20 flex items-center justify-between gap-16">
          <div className="flex-1 max-w-xl">
            <p className="text-gray-400 text-sm font-semibold mb-3">Welcome back, Alex 👋</p>
            <h1 className="text-5xl font-black leading-tight text-gray-900">
              Stay connected<br />wherever you go.
            </h1>
            <p className="text-gray-500 mt-5 text-lg leading-relaxed">
              Worldwide eSIM data service. No roaming fees, no plastic SIMs.
            </p>
            <div className="flex gap-3 mt-8">
              <button className="bg-[#FFE600] text-gray-900 font-bold px-7 py-3.5 rounded-full text-sm hover:bg-yellow-400 transition-colors shadow-sm">
                + Add data
              </button>
              <button className="border border-gray-200 bg-white text-gray-700 font-medium px-7 py-3.5 rounded-full text-sm hover:bg-gray-50 transition-colors">
                View all destinations
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 w-52 text-center">
              <p className="text-4xl font-black text-gray-900">3</p>
              <p className="text-gray-400 text-sm mt-2 font-medium">Total trips</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 w-52 text-center">
              <p className="text-4xl font-black text-gray-900">14 GB</p>
              <p className="text-gray-400 text-sm mt-2 font-medium">Data used total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-12 py-12">

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-10">
          {['My Plans', 'Past Trips'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* My Plans Tab */}
        {activeTab === 'My Plans' && (
          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center text-4xl mb-6">
              📡
            </div>
            <p className="text-2xl font-black text-gray-900">No data plans yet</p>
            <p className="text-gray-400 mt-2 text-base">Purchase a plan for it to appear here</p>
            <div className="flex gap-3 mt-8">
              <button className="bg-[#FFE600] text-gray-900 font-bold px-10 py-3.5 rounded-full text-sm hover:bg-yellow-400 transition-colors">
                + Add data
              </button>
              <button
                onClick={() => setAdvisorOpen(true)}
                className="border border-gray-200 text-gray-700 font-bold px-10 py-3.5 rounded-full text-sm hover:bg-gray-50 transition-colors">
                ✨ Get AI recommendation
              </button>
            </div>
          </div>
        )}

        {/* Past Trips Tab */}
        {activeTab === 'Past Trips' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black">Past Trips</h2>
                <p className="text-gray-400 text-sm font-medium mt-1">Based on your Saily usage history</p>
              </div>
              <button
                onClick={() => setAdvisorOpen(true)}
                className="flex items-center gap-2 bg-gray-900 text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-gray-700 transition-colors">
                ✨ Plan next trip
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  destination: 'Europe',
                  flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/4x3/eu.svg',
                  days: 5,
                  used: '3.2 GB',
                  date: 'Mar 2025',
                  daily: '0.64 GB/day',
                  color: 'bg-blue-50',
                },
                {
                  destination: 'Asia',
                  flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/4x3/jp.svg',
                  days: 10,
                  used: '7.8 GB',
                  date: 'Jan 2025',
                  daily: '0.78 GB/day',
                  color: 'bg-red-50',
                },
                {
                  destination: 'Americas',
                  flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/4x3/us.svg',
                  days: 7,
                  used: '4.1 GB',
                  date: 'Nov 2024',
                  daily: '0.59 GB/day',
                  color: 'bg-green-50',
                },
              ].map((trip, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`${trip.color} rounded-2xl p-2`}>
                      <img
                        src={trip.flag}
                        alt={trip.destination}
                        className="w-10 h-7 rounded object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full font-medium">
                      Expired
                    </span>
                  </div>
                  <p className="font-black text-gray-900 text-xl">{trip.destination}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {trip.days} days · {trip.date}
                  </p>
                  <div className="border-t border-gray-100 mt-5 pt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Data used</p>
                      <p className="font-black text-gray-900 text-lg mt-0.5">{trip.used}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium">Daily avg</p>
                      <p className="font-bold text-gray-600 text-sm mt-0.5">{trip.daily}</p>
                    </div>
                  </div>
                  <button className="w-full mt-5 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all group-hover:border-gray-300">
                    View details →
                  </button>
                </div>
              ))}
            </div>

            {/* AI Nudge Banner */}
            <div className="mt-8 bg-gray-900 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <p className="text-white font-black text-lg">Planning another trip?</p>
                <p className="text-gray-400 text-sm mt-1">
                  Let AI analyse your past usage and recommend the perfect plan.
                </p>
              </div>
              <button
                onClick={() => setAdvisorOpen(true)}
                className="bg-[#FFE600] text-gray-900 font-black px-6 py-3 rounded-2xl text-sm hover:bg-yellow-400 transition-colors whitespace-nowrap">
                ✨ Try Plan Advisor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom padding */}
      <div className="h-24" />

      {/* Plan Advisor */}
      <PlanAdvisor open={advisorOpen} setOpen={setAdvisorOpen} />
    </main>
  )
}