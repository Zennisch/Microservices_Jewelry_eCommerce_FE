export function calculateShipping(distanceKm: number): number {
    if (distanceKm <= 5) return 50000;
    if (distanceKm <= 10) return 70000;
    if (distanceKm <= 20) return 90000;
    if (distanceKm <= 30) return 110000;
    return 110000 + Math.ceil(distanceKm - 30) * 10000;
  }
  