// 0=Sun ... 6=Sat. null means closed.
export const branchHours = {
  "branch-downtown": {
    1: { open: "09:00", close: "17:00" },
    2: { open: "09:00", close: "17:00" },
    3: { open: "09:00", close: "17:00" },
    4: { open: "09:00", close: "17:00" },
    5: { open: "09:00", close: "17:00" },
    6: { open: "09:00", close: "13:00" }, // Sat
    0: null, // Sun
  },
  "branch-north": {
    1: { open: "10:00", close: "18:00" },
    2: { open: "10:00", close: "18:00" },
    3: { open: "10:00", close: "18:00" },
    4: { open: "10:00", close: "18:00" },
    5: { open: "10:00", close: "18:00" },
    6: null,
    0: null,
  },
  "branch-west": {
    1: { open: "09:00", close: "16:00" },
    2: { open: "09:00", close: "16:00" },
    3: { open: "09:00", close: "16:00" },
    4: { open: "09:00", close: "16:00" },
    5: { open: "09:00", close: "16:00" },
    6: { open: "09:00", close: "12:00" },
    0: null,
  },
};
