// Zustand Reactの状態管理ライブラリ
import { create } from 'zustand';

const useStore = create((set) => ({
    // 初期値
    user: { id: '', email: '', },
    // アップデート
    setUser: (payload) => set({ user: payload }),
}));

export default useStore;
