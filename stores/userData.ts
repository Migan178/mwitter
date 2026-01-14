import { create } from "zustand";

export interface UserData {
	name: string;
	profile: string;
	handle: string;
	protected: boolean;
	setName: (name: string) => void;
	setProfile: (profile: string) => void;
	setHandle: (handle: string) => void;
	toggleProtected: () => void;
	setProtected: (isProtected: boolean) => void;
}

const useUserDataStore = create<UserData>(set => ({
	name: "User",
	profile: "/defaults/default_profile.png",
	handle: "default_user",
	protected: false,
	setName: name => set(() => ({ name })),
	setProfile: profile => set(() => ({ profile })),
	setHandle: handle => set(() => ({ handle })),
	toggleProtected: () => set(state => ({ protected: !state.protected })),
	setProtected: isProtected => set(() => ({ protected: isProtected })),
}));

export default useUserDataStore;
