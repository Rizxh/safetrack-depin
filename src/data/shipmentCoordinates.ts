/** MapLibre order: [longitude, latitude] */
export const shipmentCoordinates: Record<string, [number, number]> = {
  "BOX-7A12": [9.9937, 53.5511],
  "BOX-3K49": [4.3175, 52.0807],
  "BOX-9M22": [4.4017, 51.2214],
  "BOX-1P87": [121.4737, 31.2304],
  "BOX-5T63": [103.8198, 1.3521],
  "BOX-8R41": [55.2708, 25.2048],
  "BOX-2V98": [139.6917, 35.6895],
  "BOX-6W15": [3.3792, 6.5244],
  "BOX-4X77": [-74.006, 40.7128],
  "BOX-0Y34": [-46.6539, -23.4647],
};

export function getShipmentLngLat(
  boxId: string,
): { lng: number; lat: number } | null {
  const c = shipmentCoordinates[boxId];
  if (!c) return null;
  return { lng: c[0], lat: c[1] };
}
