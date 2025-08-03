// src/app/page.tsx - Improved search section design with auto-scroll
'use client'

import { useState, useEffect, useRef, JSX } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Wifi, Tv, Wind, Coffee, Waves, TreePine, Home as HomeIcon, Bath } from 'lucide-react'
import { Room } from '@/types'
import { formatPrice } from '@/utils'
import roomsData from '@/data/rooms.json'
import RoomCard from '@/components/ui/RoomCard'

const HomePage = () => {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000])
  const [searchResults, setSearchResults] = useState<Room[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  
  // Ref for the results section
  const resultsRef = useRef<HTMLDivElement>(null)

  const amenityIcons: { [key: string]: JSX.Element } = {
    'WiFi': <Wifi size={16} />,
    'TV': <Tv size={16} />,
    'Air Conditioning': <Wind size={16} />,
    'Mini Fridge': <Coffee size={16} />,
    'Ocean View': <Waves size={16} />,
    'Garden View': <TreePine size={16} />,
    'Balcony': <HomeIcon size={16} />,
    'Bathtub': <Bath size={16} />
  }

  const allAmenities = ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge', 'Ocean View', 'Garden View', 'Balcony', 'Bathtub']

  useEffect(() => {
    setRooms(roomsData.rooms as Room[])
  }, [])

  // Auto-search when filters change (but only if already searched)
  useEffect(() => {
    if (hasSearched && rooms.length > 0) {
      performSearch()
    }
  }, [priceRange, selectedAmenities, hasSearched])

  // Function to scroll to results
  const scrollToResults = () => {
    if (resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const performSearch = () => {
    const exactMatch = rooms.find(room =>
      room.name.toLowerCase() === searchTerm.toLowerCase()
    )
    if (exactMatch && searchTerm.trim()) {
      router.push(`/rooms/${exactMatch.id}`)
      return
    }

    let filtered = rooms

    if (searchTerm.trim()) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(room =>
        selectedAmenities.every(amenity => room.amenities.includes(amenity))
      )
    }

    filtered = filtered.filter(room =>
      room.price >= priceRange[0] && room.price <= priceRange[1]
    )

    setSearchResults(filtered)
  }

  const handleSearch = () => {
    setHasSearched(true)
    performSearch()
    scrollToResults()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedAmenities([])
    setPriceRange([0, 6000])
    setHasSearched(false)
  }

  return (
    <>
      {/* Hero Section with Search */}
      <div className="bg-primary bg-gradient text-white py-5 mb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-3">Find Your Perfect Stay</h1>
              <p className="lead mb-4">Discover comfort and luxury in our carefully selected rooms</p>
              
              {/* Main Search Bar */}
              <div className="bg-white rounded-pill shadow-lg p-2 mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 rounded-pill ps-4"
                    placeholder="Search by room name or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ fontSize: '1.1rem' }}
                  />
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
                  >
                    <Search size={20} />
                    <span className="d-none d-sm-inline">Search</span>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="row g-3 text-center mt-3">
                <div className="col-4">
                  <div className="bg-white bg-opacity-10 rounded p-2">
                    <div className="h4 mb-0">{rooms.length}</div>
                    <small>Total Rooms</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-white bg-opacity-10 rounded p-2">
                    <div className="h4 mb-0">4.8</div>
                    <small>Average Rating</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-white bg-opacity-10 rounded p-2">
                    <div className="h4 mb-0">24/7</div>
                    <small>Service</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mb-5">
        <div className="card">
          <div className="card-body">
            <div className="row g-4">
              {/* Amenities Filter */}
              <div className="col-lg-8">
                <h5 className="mb-3">Filter by Amenities</h5>
                <div className="row g-2">
                  {allAmenities.map(amenity => (
                    <div key={amenity} className="col-6 col-md-3">
                      <button
                        onClick={() => toggleAmenity(amenity)}
                        className={`btn w-100 d-flex align-items-center gap-2 ${
                          selectedAmenities.includes(amenity)
                            ? 'btn-primary'
                            : 'btn-outline-secondary'
                        }`}
                      >
                        {amenityIcons[amenity]}
                        <span className="text-truncate">{amenity}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="col-lg-4">
                <h5 className="mb-3">Price Range</h5>
                <div className="bg-light rounded p-3">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="badge bg-primary">{formatPrice(priceRange[0])}</span>
                    <span className="text-muted">to</span>
                    <span className="badge bg-primary">{formatPrice(priceRange[1])}</span>
                  </div>
                  
                  <div className="mb-2">
                    <label className="form-label small text-muted mb-1">Min Price</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="6000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label small text-muted mb-1">Max Price</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="6000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                  </div>

                  {/* Quick Price Filters */}
                  <div className="mt-3">
                    <small className="text-muted d-block mb-2">Quick Select:</small>
                    <div className="btn-group btn-group-sm w-100" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setPriceRange([0, 3000])}
                      >
                        Budget
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setPriceRange([3000, 4500])}
                      >
                        Mid
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setPriceRange([4500, 6000])}
                      >
                        Luxury
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                onClick={clearFilters}
                className="btn btn-outline-secondary"
                disabled={selectedAmenities.length === 0 && priceRange[0] === 0 && priceRange[1] === 6000}
              >
                Clear All Filters
              </button>
              <button
                onClick={handleSearch}
                className="btn btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container" ref={resultsRef}>
        {hasSearched ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0">
                {searchResults.length} {searchResults.length === 1 ? 'Room' : 'Rooms'} Found
              </h2>
              {searchResults.length > 0 && (
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Sort By
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Price: Low to High</a></li>
                    <li><a className="dropdown-item" href="#">Price: High to Low</a></li>
                    <li><a className="dropdown-item" href="#">Name: A to Z</a></li>
                  </ul>
                </div>
              )}
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <Search size={64} className="text-muted" />
                </div>
                <h3 className="h4 mb-2">No rooms found</h3>
                <p className="text-muted mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters & Search Again
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {searchResults.map((room) => (
                  <div key={room.id} className="col-md-6 col-lg-4">
                    <RoomCard room={room} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <div className="mb-4">
              <HomeIcon size={64} className="text-muted" />
            </div>
            <h3 className="h4 mb-2">Start Your Search</h3>
            <p className="text-muted">
              Use the search bar above to find your perfect room
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage