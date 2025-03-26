import { create } from "zustand";

type AuthStore = {
  token: string | null;
  setToken: (token: string) => void;
};

const useAuthStore = create<AuthStore>(() => ({
  token: null,
  setToken: (token) => console.log(token,"token"),
}));

export default useAuthStore;
