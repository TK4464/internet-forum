// Zustand Reactの状態管理ライブラリ
import { create } from 'zustand';

const useStore = create((set) => ({
    // 初期値
    // 将来的にavatar_urlとnameを取得したいため設定
    user: { id: '', email: '', name: '', avatar_url: '' },
    // アップデート
    setUser: (payload) => set({ user: payload }),
}));

export default useStore;
