"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { nextNDays } from "../../lib/slots";

import StepTopic from "./StepTopic.client";
import StepBranch from "./StepBranch.client";
import StepDateTime from "./StepDateTime.client";
import StepDetails from "./StepDetails.client";
import StepConfirm from "./StepConfirm.client";
import ProgressBar from "./ProgressBar";
import CommerceButton from "./CommerceButton";

const STEPS = ["Topic", "Branch", "Date & Time", "Details", "Confirm"];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}


export default function BookingWizard() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [topicId, setTopicId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [dateISO, setDateISO] = useState("");
  const [slotISO, setSlotISO] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [slotsForSelectedDay, setSlotsForSelectedDay] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [slotUnavailable, setSlotUnavailable] = useState(false);
  const [staleSlotISO, setStaleSlotISO] = useState("");
  const [topics, setTopics] = useState([]);
  const [branches, setBranches] = useState([]);
  const latestSlotISO = useRef("");

  useEffect(() => {
    latestSlotISO.current = slotISO;
  }, [slotISO]);

  useEffect(() => {
    async function loadTopics() {
      try {
        const response = await fetch("http://localhost:8080/api/topics");
        if (!response.ok) {
          setTopics([]);
          return;
        }

        const data = await response.json();
        setTopics(data);
      } catch {
        setTopics([]);
      }
    }

    loadTopics();
  }, []);

  useEffect(() => {
    async function loadBranches() {
      if (!topicId) {
        setBranches([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/branches?topicId=${topicId}`
        );
        if (!response.ok) {
          setBranches([]);
          return;
        }

        const data = await response.json();
        setBranches(data);
      } catch {
        setBranches([]);
      }
    }

    loadBranches();
  }, [topicId]);

  const days = useMemo(() => nextNDays(14), []);

  const selectedBranch = branches.find((b) => String(b.id) === String(branchId)) || null;
  const selectedTopic = topics.find((t) => String(t.id) === String(topicId)) || null;

  useEffect(() => {
    async function loadAvailability() {
      if (!branchId || !dateISO) {
        setSlotsForSelectedDay([]);
        setIsLoadingAvailability(false);
        return;
      }

      const dateKey = dateISO.slice(0, 10);
      setIsLoadingAvailability(true);

      try {
        const response = await fetch(
          `http://localhost:8080/api/availability?branchId=${branchId}&date=${dateKey}`
        );

        if (!response.ok) {
          setSlotsForSelectedDay([]);
          setIsLoadingAvailability(false);
          return;
        }

        const times = await response.json();
        const nextSlots = times.map((time) => `${dateKey}T${time}:00`);

        setSlotsForSelectedDay(nextSlots);

        if (latestSlotISO.current && !nextSlots.includes(latestSlotISO.current)) {
          setSlotUnavailable(true);
          setStaleSlotISO(latestSlotISO.current);
          setSlotISO("");
        }
      } catch {
        setSlotsForSelectedDay([]);
      } finally {
        setIsLoadingAvailability(false);
      }
    }

    loadAvailability();
  }, [branchId, dateISO]);

  function canNext() {
    if (step === 0) return Boolean(topicId);
    if (step === 1) return Boolean(branchId);
    if (step === 2) return Boolean(dateISO && slotISO);
    if (step === 3) return Boolean(name && email && reason && emailValid);
    return true;
  }


  function next() {
    if (!canNext()) return;
    setSubmitError(null); // Clear error when navigating forward
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setSubmitError(null); // Clear error when navigating backward
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setSubmitError(null); // Clear error when retrying booking
    const id = makeId();
    const bookingPayload = {
      id,
      name,
      email,
      topicId: Number(topicId),
      branchId: Number(branchId),
      startISO: slotISO,
      reason,
    };

    try {
      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      if (response.status === 409) {
        setSubmitError(
          "This time slot has already been booked. Please choose another time."
        );
        return;
      }

      if (!response.ok) {
        setSubmitError("This time slot is no longer available");
        return;
      }

      const savedAppointment = await response.json();
      router.push(`/confirmation/${savedAppointment.id}`);
    } catch {
      setSubmitError("This time slot is no longer available");
      return;
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Book an Appointment</h1>
        <p className="mt-2 text-slate-600">
          Topic → branch → date/time → details → confirmation.
        </p>

        <div className="mt-6">
          <ProgressBar step={step} steps={STEPS} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <StepTopic topics={topics} topicId={topicId} setTopicId={(id) => {
            setTopicId(id);
            setSlotUnavailable(false);
            setStaleSlotISO("");
            setBranchId("");
            setDateISO("");
            setSlotISO("");
          }} />
        )}

        {step === 1 && (
          <StepBranch
            branches={branches}
            branchId={branchId}
            setBranchId={(id) => {
              setBranchId(id);
              setSlotUnavailable(false);
              setStaleSlotISO("");
              setDateISO("");
              setSlotISO("");
            }}
          />
        )}

        {step === 2 && (
          <StepDateTime
            days={days}
            dateISO={dateISO}
            setDateISO={(iso) => {
              setDateISO(iso);
              setSlotUnavailable(false);
              setStaleSlotISO("");
              setSlotISO("");
              setSubmitError(null); // Clear error when selecting new date
            }}
            slots={slotsForSelectedDay}
            slotISO={slotISO}
            setSlotISO={(iso) => {
              setSlotUnavailable(false);
              setStaleSlotISO("");
              setSlotISO(iso);
              setSubmitError(null); // Clear error when selecting new slot
            }}
            branchId={branchId}
            isLoadingAvailability={isLoadingAvailability}
            slotUnavailable={slotUnavailable}
            staleSlotISO={staleSlotISO}
          />
        )}

        {step === 3 && (
          <StepDetails
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            reason={reason}
            setReason={setReason}
            setEmailValid={setEmailValid}
          />
        )}

        {step === 4 && (
          <StepConfirm
            topic={selectedTopic}
            branch={selectedBranch}
            slotISO={slotISO}
            name={name}
            email={email}
            reason={reason}
          />
        )}

        {submitError ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
            <CommerceButton
              variant="secondary"
              onClick={() => {
                if (step === 0) {
                  router.push("/");
                  return;
                }
                back();
              }}
            >
              {step === 0 ? "Back to Home" : "Back"}
            </CommerceButton>

          {step < 4 ? (
            <CommerceButton onClick={next} disabled={!canNext()}>
              Next
            </CommerceButton>
          ) : (
            <CommerceButton onClick={submit}>
              Confirm Appointment
            </CommerceButton>
          )}
        </div>
      </div>
    </div>
  );
}
