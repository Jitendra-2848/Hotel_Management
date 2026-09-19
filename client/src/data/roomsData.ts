import { CompactRoomItem } from "../components/RoomCard";
import { Room } from "../lib/api";

// All sanctuary and suite inventory is dynamically loaded directly from the PostgreSQL database API (/rooms).
export const CURATED_ROOMS: (Room & CompactRoomItem)[] = [];
