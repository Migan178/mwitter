import { create } from "zustand";

export interface UserData {
	name: string;
	profile: string;
	handle: string;
	setName: (name: string) => void;
	setProfile: (profile: string) => void;
	setHandle: (handle: string) => void;
}

const useUserDataStore = create<UserData>(set => ({
	name: "User",
	profile: "/defaults/default_profile.png",
	handle: "default_user",
	setName: name => set(() => ({ name })),
	setProfile: profile => set(() => ({ profile })),
	setHandle: handle => set(() => ({ handle })),
}));

export default useUserDataStore;
