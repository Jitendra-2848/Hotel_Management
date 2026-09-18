import { CompactRoomItem } from "../components/RoomCard";
import { Room } from "../lib/api";

export const DEFAULT_ADMIN_EMAIL = "prajapatijitendra2848@gmail.com";
export const DEFAULT_ADMIN_NAME = "Jitendra Prajapati";

// All predefined static data has been migrated and shifted to the PostgreSQL database under host prajapatijitendra2848@gmail.com.
// Applications fetch dynamic rooms directly from the database API (/rooms).
export const CURATED_ROOMS: (Room & CompactRoomItem)[] = [];
