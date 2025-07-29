import Link from 'next/link'
import { Users, MapPin, Star } from 'lucide-react'
import { Room } from '@/types'
import { formatPrice } from '@/utils'

interface RoomCardProps {
  room: Room
  showButton?: boolean
}

const RoomCard = ({ room, showButton = true }: RoomCardProps) => {
  return (
    <div className="card card-hover">
      <h3>{room.name}</h3>
      <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
        {formatPrice(room.price)}/night
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {room.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Users className="w-4 h-4 mr-1" />
          {room.capacity} guests
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <MapPin className="w-4 h-4 mr-1" />
          {room.size}
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span style={{ color: '#4b5563' }}>4.8</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {room.amenities.map((amenity) => (
          <span
            key={amenity}
            className="amenity-tag amenity-tag-primary amenity-tag-small" style={{ marginRight: '8px', marginBottom: '16px' }}
          >
            {amenity}
          </span>
        ))}
      </div>

      {showButton && (
        <Link
          href={`/rooms/${room.id}`}
          className="btn-primary"
        >
          View Details & Book
        </Link>
      )}
    </div>
  )
}

export default RoomCard