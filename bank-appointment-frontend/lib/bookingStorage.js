const KEY = "bank_appointments_v1";

export function getBookings() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveBooking(booking) {
  const all = getBookings();
  all.push(booking);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function isSlotBooked(branchId, startISO) {
  return getBookings().some(
    (b) => b.branchId === branchId && b.startISO === startISO
  );
}
