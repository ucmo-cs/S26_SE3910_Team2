"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { splitAppointments } from "./appointments";
import { getSessionBanker, getSessionUser } from "./session";

const actorConfig = {
  user: {
    getSession: getSessionUser,
    redirectTo: "/login",
    endpoint: (id) => `http://localhost:8080/api/users/${id}/appointments`,
    defaultError: "We couldn't load your appointments.",
  },
  banker: {
    getSession: getSessionBanker,
    redirectTo: "/banker-login",
    endpoint: (id) => `http://localhost:8080/api/users/${id}/banker-appointments`,
    defaultError: "We couldn't load appointments.",
  },
};

export default function useManagedAppointments(actorType) {
  const router = useRouter();
  const config = actorConfig[actorType];
  const [actor, setActor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedActor = config.getSession();
    if (!storedActor) {
      router.replace(config.redirectTo);
      return;
    }

    setActor(storedActor);
  }, [config, router]);

  useEffect(() => {
    async function loadAppointments() {
      if (!actor?.id) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(config.endpoint(actor.id));
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json().catch(() => [])
          : await response.text().catch(() => "");

        if (!response.ok) {
          setError(typeof data === "string" && data.trim() ? data : config.defaultError);
          setAppointments([]);
          return;
        }

        setAppointments(Array.isArray(data) ? data : []);
      } catch {
        setError(config.defaultError);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, [actor, config]);

  function handleUpdatedAppointment(updatedAppointment) {
    setAppointments((current) =>
      current.map((appointment) => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment))
    );
  }

  function handleDeletedAppointment(appointmentId) {
    setAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId));
  }

  const { upcomingAppointments, pastAppointments } = splitAppointments(appointments);

  return {
    actor,
    appointments,
    upcomingAppointments,
    pastAppointments,
    isLoading,
    error,
    handleUpdatedAppointment,
    handleDeletedAppointment,
  };
}
