// src/components/ui/RoomCard.tsx - Bootstrap version
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
    <div className="card room-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="card-title mb-0">{room.name}</h5>
          <span className="badge bg-primary">
            {formatPrice(room.price)}/night
          </span>
        </div>

        <p className="card-text text-muted mb-3">
          {room.description}
        </p>

        <div className="d-flex align-items-center gap-3 text-muted small mb-3">
          <span className="d-flex align-items-center">
            <Users size={16} className="me-1" />
            {room.capacity} guests
          </span>
          <span className="d-flex align-items-center">
            <MapPin size={16} className="me-1" />
            {room.size}
          </span>
          <div className="d-flex align-items-center">
            <Star size={16} className="text-warning me-1" fill="currentColor" />
            <span>4.8</span>
          </div>
        </div>

        <div className="mb-3">
          {room.amenities.map((amenity) => (
            <span
              key={amenity}
              className="badge bg-light text-secondary me-2 mb-2"
            >
              {amenity}
            </span>
          ))}
        </div>

        {showButton && (
          <Link
            href={`/rooms/${room.id}`}
            className="btn btn-primary w-100"
          >
            View Details & Book
          </Link>
        )}
      </div>
    </div>
  )
}

export default RoomCard