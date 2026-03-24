"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { topics } from "../../data/topics";
import { branches } from "../../data/branches";
import { branchHours } from "../../data/hours";
import { nextNDays, buildSlotsForDate } from "../../lib/slots";
import { isSlotBooked, saveBooking } from "../../lib/bookingStorage";

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
  const [dateISO, setDateISO] = useState(""); // yyyy-mm-dd string-ish (we’ll store as ISO midnight)
  const [slotISO, setSlotISO] = useState(""); // ISO datetime for slot start

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");

  const availableBranches = useMemo(() => {
    if (!topicId) return [];
    return branches.filter((b) => b.topicIds.includes(topicId));
  }, [topicId]);

  const days = useMemo(() => nextNDays(14), []);

  const selectedBranch = branches.find((b) => b.id === branchId) || null;
  const selectedTopic = topics.find((t) => t.id === topicId) || null;

  const slotsForSelectedDay = useMemo(() => {
    if (!branchId || !dateISO) return [];

    const day = new Date(dateISO);
    const dow = day.getDay();
    const hours = branchHours[branchId]?.[dow] ?? null;
    const allSlots = buildSlotsForDate(day, hours);

    return allSlots.filter((iso) => !isSlotBooked(branchId, iso));
  }, [branchId, dateISO]);

  function canNext() {
    if (step === 0) return Boolean(topicId);
    if (step === 1) return Boolean(branchId);
    if (step === 2) return Boolean(dateISO && slotISO);
    if (step === 3) return Boolean(name && email && reason);
    return true;
  }

  function next() {
    if (!canNext()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    const id = makeId();
    const booking = {
      id,
      name,
      email,
      topicId,
      branchId,
      startISO: slotISO,
      reason,
    };

    saveBooking(booking);
    router.push(`/confirmation/${id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Book an Appointment</h1>
        <p className="mt-2 text-slate-600">
          Prototype flow: topic → branch → date/time → details → confirmation.
        </p>

        <div className="mt-6">
          <ProgressBar step={step} steps={STEPS} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <StepTopic topics={topics} topicId={topicId} setTopicId={(id) => {
            setTopicId(id);
            setBranchId("");
            setDateISO("");
            setSlotISO("");
          }} />
        )}

        {step === 1 && (
          <StepBranch
            branches={availableBranches}
            branchId={branchId}
            setBranchId={(id) => {
              setBranchId(id);
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
              setSlotISO("");
            }}
            slots={slotsForSelectedDay}
            slotISO={slotISO}
            setSlotISO={setSlotISO}
            branchId={branchId}
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
