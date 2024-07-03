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

  rated: false,
  setRated: (rated) => set({rated: rated}),
  mode: "work",
  setMode: (mode) => set({mode}),

  isRunning: false,
  setIsRunning: (running) =>
    set((state) => {
      if (state.isRunning !== running) {
        return {isRunning: running};
      }
      return state;
    }),

  secondsLeft: 0,
  setSecondsLeft: (seconds) => {
    set({secondsLeft: seconds});
  },

  timeElapsed: 0,
  setTimeElapsed: (time) => {
    set({timeElapsed: time});
  },

  countdownMinutes: 10,
  setCountdownMinutes: (time) => set({countdownMinutes: time}),

  timeLeft: 10,
  setTimeLeft: (time) => set({timeLeft: time}),

  isStopWatchActive: false,
  setIsStopWatchActive: (active) =>
    set((state) => {
      if (state.isStopWatchActive !== active) {
        return {isStopWatchActive: active};
      }
      return state;
    }),

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

//Countdown logic --> setTimeLeft by the desc box and then just take in the rest.
