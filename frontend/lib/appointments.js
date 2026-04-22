export function toDateTimeValue(appointment) {
  return new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
}

export function splitAppointments(appointments) {
  const now = new Date();

  return {
    upcomingAppointments: appointments.filter((appointment) => toDateTimeValue(appointment) >= now),
    pastAppointments: appointments.filter((appointment) => toDateTimeValue(appointment) < now).reverse(),
  };
}
