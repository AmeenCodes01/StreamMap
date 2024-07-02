import {create} from "zustand";

const useStore = create((set, get) => ({
  allSessions: [],
  setAllSessions: (sessions) => set({allSessions: sessions}),

  seshGoal: "",
  setSeshGoal: (goal) => set({seshGoal: goal}),

  seshInfo: [],
  setSeshInfo: (info) => set({seshInfo: info}),

  workMinutes: 60,
  setWorkMinutes: (minutes) => set({workMinutes: minutes}),

  breakMinutes: 10,
  setBreakMinutes: (minutes) => set({breakMinutes: minutes}),

  isPaused: true,
  setIsPaused: (paused) => set({isPaused: paused}),

  showRating: false,
  setShowRating: (show) => set({showRating: show}),

  mode: "work",
  setMode: (mode) => set({mode}),

  isRunning: false,
  setIsRunning: (running) => set({isRunning: running}),

  secondsLeft: 0,
  setSecondsLeft: (seconds) => {
    set({secondsLeft: seconds});
  },

  timeLeft: 10,

  timeElapsed: 0,

  setTimeElapsed: (time) => {
    console.log(time, "timeStore");
    set({timeElapsed: time});
  },

  setTimeLeft: (time) => set({timeLeft: time}),

  isStopWatchActive: false,
  setIsStopWatchActive: (active) => set({isStopWatchActive: active}),

  isCountDownActive: false,
  setIsCountDownActive: (active) => {
    set({isCountDownActive: active});
    // localStorage.setItem(`${get().authId}${get().room}countdownIsActive`, active);
  },

  inSesh: [],
  setInSesh: (sesh) => set({inSesh: [...get().inSesh, sesh]}),
  saveInSesh: (sesh) => set((state) => ({inSesh: [...state.inSesh, state]})),
}));

export default useStore;
//1719769862880  1719770931697 1719770931697
