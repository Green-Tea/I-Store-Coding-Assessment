'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Room } from '@/types'
import { formatPrice } from '@/utils'
import roomsData from '@/data/rooms.json'
import RoomCard from '@/components/ui/RoomCard'

const HomePage = () => {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000])
  const [searchResults, setSearchResults] = useState<Room[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const allAmenities = ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge', 'Ocean View', 'Garden View', 'Balcony', 'Bathtub']

  useEffect(() => {
    setRooms(roomsData.rooms as Room[])
  }, [])

  // Auto-search when price range changes (but only if already searched)
  useEffect(() => {
    if (hasSearched && rooms.length > 0) {
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
  }, [priceRange, rooms, searchTerm, selectedAmenities, hasSearched])

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const handleSearch = () => {
    setHasSearched(true)
    setShowSuggestions(false)

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1>
        Press search to start displaying rooms
      </h1>
      <div className='flex justify-center'>
        <input
          type="text"
          placeholder="Search by room name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="input-field w-1/4"
        />
        <button
          onClick={handleSearch}
          className="btn-primary"
        >
          <Search />
        </button>
      </div>
      <br />
      <div className="my-32 max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex flex-wrap gap-3 justify-center">
            {allAmenities.map(amenity => (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`amenity-tag ${selectedAmenities.includes(amenity)
                  ? 'amenity-tag-primary'
                  : 'amenity-tag-secondary'
                  }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className='text-center'>
            Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </h3>
          <div className="flex items-center space-x-4 max-w-md mx-auto w-1/3">
            <span className="text-sm text-gray-600">{formatPrice(0)}</span>
            <input
              type="range"
              min="0"
              max="6000"
              step="100"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="6000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
            <span className="text-sm text-gray-600">{formatPrice(6000)}</span>
          </div>
        </div>
      </div>

      <div className="mt-12">
        {hasSearched ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results ({searchResults.length} rooms found)
              </h2>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <br />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No rooms found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <br />
            <p className="text-xl">Use the search bar and filters above to find rooms</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage