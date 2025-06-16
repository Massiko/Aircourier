'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plane, Package, Shield, Users, Star, MapPin, Calendar, Weight, DollarSign, Search, ArrowRight, CheckCircle, Globe } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

interface PackageRequest {
  id: string
  title: string
  from_country: string
  from_city: string
  to_country: string
  to_city: string
  compensation: number
  currency: string
  deadline: string
  weight: number
  profiles: {
    full_name: string
    rating: number
    is_verified: boolean
  }
}

interface Trip {
  id: string
  from_country: string
  from_city: string
  to_country: string
  to_city: string
  departure_date: string
  price_per_kg: number
  currency: string
  available_weight: number
  profiles: {
    full_name: string
    rating: number
    is_verified: boolean
  }
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'France', 'Germany', 'Spain', 'Italy',
  'Japan', 'Australia', 'Brazil', 'India', 'China', 'Russia', 'Mexico', 'Argentina'
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<'packages' | 'trips'>('packages')
  const [fromCountry, setFromCountry] = useState('')
  const [toCountry, setToCountry] = useState('')
  const [packages, setPackages] = useState<PackageRequest[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFeaturedContent()
  }, [])

  const fetchFeaturedContent = async () => {
    // Fetch recent packages
    const { data: packageData } = await supabase
      .from('package_requests')
      .select(`
        id, title, from_country, from_city, to_country, to_city,
        compensation, currency, deadline, weight,
        profiles!package_requests_sender_id_fkey (full_name, rating, is_verified)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6)

    // Fetch recent trips
    const { data: tripData } = await supabase
      .from('trips')
      .select(`
        id, from_country, from_city, to_country, to_city,
        departure_date, price_per_kg, currency, available_weight,
        profiles!trips_traveler_id_fkey (full_name, rating, is_verified)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6)

    if (packageData) setPackages(packageData as any)
    if (tripData) setTrips(tripData as any)
  }

  const handleSearch = () => {
    if (fromCountry && toCountry) {
      window.location.href = `/browse?from=${encodeURIComponent(fromCountry)}&to=${encodeURIComponent(toCountry)}&type=${activeTab}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-blue-600/20 backdrop-blur-3xl" />
        <div className="relative container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Connect Globally, Ship Personally
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Send packages worldwide through trusted travelers. Safe, affordable, and personal delivery 
              that connects people across borders.
            </p>
            
            {/* Search Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="bg-slate-100 rounded-full p-1 flex">
                  <button
                    onClick={() => setActiveTab('packages')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === 'packages'
                        ? 'bg-sky-600 text-white shadow-lg'
                        : 'text-slate-600 hover:text-sky-600'
                    }`}
                  >
                    <Package className="w-4 h-4 inline mr-2" />
                    Send Package
                  </button>
                  <button
                    onClick={() => setActiveTab('trips')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === 'trips'
                        ? 'bg-sky-600 text-white shadow-lg'
                        : 'text-slate-600 hover:text-sky-600'
                    }`}
                  >
                    <Plane className="w-4 h-4 inline mr-2" />
                    Offer Trip
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
                  <Select value={fromCountry} onValueChange={setFromCountry}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                  <Select value={toCountry} onValueChange={setToCountry}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch} size="lg" className="h-12 bg-sky-600 hover:bg-sky-700">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-sky-600">50K+</div>
              <div className="text-slate-600">Packages Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-sky-600">25K+</div>
              <div className="text-slate-600">Trusted Travelers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-sky-600">150+</div>
              <div className="text-slate-600">Countries</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-sky-600">4.9★</div>
              <div className="text-slate-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              How AirCourier Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple, secure, and personal international shipping through our community of verified travelers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-sky-600" />
                </div>
                <CardTitle className="text-xl">1. Post Your Package</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Describe what you need to send, where it's going, and how much you're willing to pay. Add photos and details to attract the right travelers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">2. Connect & Match</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Browse verified travelers going your route or wait for them to find you. Chat securely to arrange pickup and delivery details.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">3. Safe Delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600">
                  Track your package's journey and receive confirmation upon delivery. Rate your experience and build trust in our community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Recent Package Requests</h2>
              <p className="text-slate-600">People looking for travelers to help deliver their packages</p>
            </div>
            <Link href="/browse?type=packages">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold line-clamp-1">{pkg.title}</CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      {pkg.currency} {pkg.compensation}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{pkg.from_city}, {pkg.from_country}</span>
                    <ArrowRight className="w-4 h-4 mx-2" />
                    <span>{pkg.to_city}, {pkg.to_country}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-sm text-slate-600 mb-3">
                    <span className="flex items-center">
                      <Weight className="w-4 h-4 mr-1" />
                      {pkg.weight}kg
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      By {new Date(pkg.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {pkg.profiles?.full_name?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600">{pkg.profiles?.full_name}</span>
                      {pkg.profiles?.is_verified && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-slate-600">
                        {pkg.profiles?.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Available Trips</h2>
              <p className="text-slate-600">Travelers offering to carry packages on their journeys</p>
            </div>
            <Link href="/browse?type=trips">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center text-sm text-slate-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{trip.from_city}, {trip.from_country}</span>
                    <ArrowRight className="w-4 h-4 mx-2" />
                    <span>{trip.to_city}, {trip.to_country}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-sky-600 border-sky-600">
                      <Plane className="w-3 h-3 mr-1" />
                      {new Date(trip.departure_date).toLocaleDateString()}
                    </Badge>
                    <Badge variant="secondary">
                      {trip.currency} {trip.price_per_kg}/kg
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-sm text-slate-600 mb-3">
                    <span className="flex items-center">
                      <Weight className="w-4 h-4 mr-1" />
                      Up to {trip.available_weight}kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {trip.profiles?.full_name?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600">{trip.profiles?.full_name}</span>
                      {trip.profiles?.is_verified && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-slate-600">
                        {trip.profiles?.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 px-4 bg-gradient-to-r from-sky-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Your Trust & Safety Matter
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've built comprehensive safety measures to ensure every transaction is secure and every user is protected
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Users</h3>
              <p className="text-slate-600">
                ID verification, phone confirmation, and background checks for all active community members
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Insurance</h3>
              <p className="text-slate-600">
                Comprehensive insurance coverage for packages during transit with full compensation protection
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Reviews</h3>
              <p className="text-slate-600">
                Transparent rating system with detailed reviews to help you make informed decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Connect the World?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of people already using AirCourier to send packages and earn money while traveling
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages">
              <Button size="lg" variant="secondary" className="px-8">
                <Package className="w-5 h-5 mr-2" />
                Send a Package
              </Button>
            </Link>
            <Link href="/trips">
              <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-sky-600">
                <Plane className="w-5 h-5 mr-2" />
                Offer a Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AirCourier</span>
              </div>
              <p className="text-slate-400 mb-4">
                Connecting people across borders through trusted package delivery
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/browse" className="hover:text-white transition-colors">Browse</Link></li>
                <li><Link href="/packages" className="hover:text-white transition-colors">Send Package</Link></li>
                <li><Link href="/trips" className="hover:text-white transition-colors">Offer Trip</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors">Safety</Link></li>
                <li><Link href="/insurance" className="hover:text-white transition-colors">Insurance</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/legal" className="hover:text-white transition-colors">Legal</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 AirCourier. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-400 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}