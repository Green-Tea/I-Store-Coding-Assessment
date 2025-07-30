'use client'
import { Home, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"

const Navbar = () => {
    const router = useRouter()
    const { user, isAuthenticated, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <nav style={{
            backgroundColor: "#0D98BA",
            height: "5%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            padding: "0 1rem"
        }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <button
                    onClick={() => router.push("/")}
                    style={{ background: "transparent", border: "0px", display: "flex", alignItems: "center" }}
                >
                    <Home size={"2rem"} color="white" />
                    <h2 style={{ color: "white", marginLeft: "0.5rem" }}>Room Booking System</h2>
                </button>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
                {isAuthenticated ? (
                    <>
                        <Link
                            href="/profile"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}
                        >
                            <User size={"1.5rem"} />
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: "transparent",
                                border: "0px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            <LogOut size={"1.25rem"} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar