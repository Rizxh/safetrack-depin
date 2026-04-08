export interface ShipmentRecord {
  id: string;
  boxId: string;
  timestamp: string;
  gForcePeak: number;
  aiDamageLikelihood: number;
  storageHash: string;
  status: "healthy" | "warning" | "critical";
  battery: number;
  signalStrength: number;
  location: string;
}

export const shipmentData: ShipmentRecord[] = [
  {
    id: "1",
    boxId: "BOX-7A12",
    timestamp: "2026-04-08T08:12:00Z",
    gForcePeak: 2.1,
    aiDamageLikelihood: 5,
    storageHash:
      "0x3f8a1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
    status: "healthy",
    battery: 92,
    signalStrength: 87,
    location: "Hamburg, DE",
  },
  {
    id: "2",
    boxId: "BOX-3K49",
    timestamp: "2026-04-08T09:45:00Z",
    gForcePeak: 5.8,
    aiDamageLikelihood: 42,
    storageHash:
      "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    status: "warning",
    battery: 78,
    signalStrength: 65,
    location: "Rotterdam, NL",
  },
  {
    id: "3",
    boxId: "BOX-9M22",
    timestamp: "2026-04-08T10:30:00Z",
    gForcePeak: 1.4,
    aiDamageLikelihood: 2,
    storageHash:
      "0xf0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0",
    status: "healthy",
    battery: 95,
    signalStrength: 92,
    location: "Antwerp, BE",
  },
  {
    id: "4",
    boxId: "BOX-1P87",
    timestamp: "2026-04-08T11:15:00Z",
    gForcePeak: 8.3,
    aiDamageLikelihood: 78,
    storageHash:
      "0x1234abcd5678efab9012cdef3456abcd7890efab1234cdef5678abcd9012efab",
    status: "critical",
    battery: 45,
    signalStrength: 34,
    location: "Shanghai, CN",
  },
  {
    id: "5",
    boxId: "BOX-5T63",
    timestamp: "2026-04-08T12:00:00Z",
    gForcePeak: 3.2,
    aiDamageLikelihood: 15,
    storageHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    status: "healthy",
    battery: 88,
    signalStrength: 76,
    location: "Singapore, SG",
  },
  {
    id: "6",
    boxId: "BOX-8R41",
    timestamp: "2026-04-08T13:22:00Z",
    gForcePeak: 6.1,
    aiDamageLikelihood: 55,
    storageHash:
      "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    status: "warning",
    battery: 62,
    signalStrength: 48,
    location: "Dubai, AE",
  },
  {
    id: "7",
    boxId: "BOX-2V98",
    timestamp: "2026-04-08T14:05:00Z",
    gForcePeak: 1.8,
    aiDamageLikelihood: 3,
    storageHash:
      "0xdeadbeef12345678deadbeef12345678deadbeef12345678deadbeef12345678",
    status: "healthy",
    battery: 97,
    signalStrength: 95,
    location: "Tokyo, JP",
  },
  {
    id: "8",
    boxId: "BOX-6W15",
    timestamp: "2026-04-08T15:40:00Z",
    gForcePeak: 9.7,
    aiDamageLikelihood: 91,
    storageHash:
      "0xcafebabe87654321cafebabe87654321cafebabe87654321cafebabe87654321",
    status: "critical",
    battery: 31,
    signalStrength: 22,
    location: "Lagos, NG",
  },
  {
    id: "9",
    boxId: "BOX-4X77",
    timestamp: "2026-04-08T16:18:00Z",
    gForcePeak: 2.5,
    aiDamageLikelihood: 8,
    storageHash:
      "0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff",
    status: "healthy",
    battery: 85,
    signalStrength: 81,
    location: "New York, US",
  },
  {
    id: "10",
    boxId: "BOX-0Y34",
    timestamp: "2026-04-08T17:55:00Z",
    gForcePeak: 4.6,
    aiDamageLikelihood: 28,
    storageHash:
      "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    status: "warning",
    battery: 71,
    signalStrength: 59,
    location: "São Paulo, BR",
  },
];

export const gForceChartData = [
  { time: "06:00", gForce: 1.2, threshold: 5 },
  { time: "08:00", gForce: 2.1, threshold: 5 },
  { time: "09:00", gForce: 5.8, threshold: 5 },
  { time: "10:00", gForce: 1.4, threshold: 5 },
  { time: "11:00", gForce: 8.3, threshold: 5 },
  { time: "12:00", gForce: 3.2, threshold: 5 },
  { time: "13:00", gForce: 6.1, threshold: 5 },
  { time: "14:00", gForce: 1.8, threshold: 5 },
  { time: "15:00", gForce: 9.7, threshold: 5 },
  { time: "16:00", gForce: 2.5, threshold: 5 },
  { time: "17:00", gForce: 4.6, threshold: 5 },
  { time: "18:00", gForce: 3.1, threshold: 5 },
];
