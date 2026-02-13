function parseTimeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function setDateMinutes(date, minutes) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minutes);
  return d;
}

export function buildSlotsForDate(dateObj, hoursForDow) {
  if (!hoursForDow) return [];

  const openMin = parseTimeToMinutes(hoursForDow.open);
  const closeMin = parseTimeToMinutes(hoursForDow.close);

  const slots = [];
  for (let start = openMin; start + 30 <= closeMin; start += 30) {
    const startDate = setDateMinutes(dateObj, start);
    slots.push(startDate.toISOString());
  }
  return slots;
}

export function nextNDays(n) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}
