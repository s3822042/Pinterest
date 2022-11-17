import create from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

import { BASE_URL } from "../utils";

const authStore = (set: any) => ({
  userProfile: null,
  allUsers: [],
  allPins: [],

  addUser: (user: any) => set({ userProfile: user }),

  removeUser: () => set({ userProfile: null }),

  fetchAllUsers: async () => {
    const { data } = await axios.get(`${BASE_URL}/api/users`);

    set({ allUsers: data });
  },

  fetchAllPins: async () => {
    const { data } = await axios.get(`${BASE_URL}/api/pins`);

    set({ allPins: data });
  },
});

const useAuthStore = create(
  persist(authStore, {
    name: "auth",
  })
);

export default useAuthStore;
