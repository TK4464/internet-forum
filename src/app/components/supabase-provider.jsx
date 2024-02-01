"use client"

import { createContext, useContext, useState } from "react"
import { createClient } from "../../../utils/supabase-browser"

// コンテキスト
const Context = createContext(null)

// プロバイダー
export default function SupabaseProvider({ children }) {
    const [supabase] = useState(() => createClient())

    return (
        <Context.Provider value={{ supabase }}>
            <>{children}</>
        </Context.Provider>
    )
}

// Supabaseクライアント
export const useSupabase = () => useContext(Context)
