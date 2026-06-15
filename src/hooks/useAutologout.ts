// File: src/hooks/useAutoLogout.ts
import { useEffect, useRef } from "react";

export function useAutoLogout(timeoutMinutes: number = 15) {
  // 👇 Ubah NodeJS.Timeout menjadi ReturnType<typeof setTimeout>
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = () => {
    // 1. Hanya bersihkan data memori lokal yang digunakan oleh aplikasimu
    localStorage.removeItem("sb-session"); // Menghapus kunci utama yang dibaca ProtectedRoute
    
    // Catatan: Kita TIDAK memanggil supabase.auth.signOut() di sini

    alert("Sesi Anda telah berakhir karena tidak ada aktivitas.");
    
    // 2. Arahkan kembali ke halaman login
    window.location.href = "/"; 
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Konversi menit ke milidetik
    timeoutRef.current = setTimeout(handleLogout, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    // Daftar interaksi pengguna yang mereset timer
    const events = [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
    ];

    const eventListener = () => resetTimer();

    // Pasang pendengar interaksi (listener) ke seluruh halaman
    events.forEach((event) => document.addEventListener(event, eventListener));
    
    // Mulai timer saat komponen pertama kali dimuat
    resetTimer();

    // Bersihkan listener jika komponen dilepas (unmount)
    return () => {
      events.forEach((event) => document.removeEventListener(event, eventListener));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
}