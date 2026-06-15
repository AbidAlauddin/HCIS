import { Navigate } from "react-router-dom";
import { useAutoLogout } from "../hooks/useAutologout"; // Pastikan path folder ini sesuai dengan tempat kamu menyimpan file useAutoLogout.ts

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  // 1. Panggil fungsi auto-logout di sini (misalnya disetel 15 menit)
  useAutoLogout(15);

  // 2. Mengecek sesi dari localStorage
  const session = localStorage.getItem("sb-session");

  // 3. Jika tidak ada sesi, lempar kembali ke halaman login
  if (!session) {
    // Saya menambahkan prop 'replace' agar saat dilempar ke halaman login, 
    // user tidak bisa menekan tombol "Back" di browser untuk kembali ke URL sebelumnya.
    return <Navigate to="/" replace />; 
  }

  // 4. Jika sesi aman, tampilkan halaman yang dituju
  return <>{children}</>;
}