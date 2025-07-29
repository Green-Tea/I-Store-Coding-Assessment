'use client'
import { Home } from "lucide-react"
import { useRouter } from "next/navigation"

const Navbar = () => {
    const router = useRouter()

    return (
        <nav style={{ 
            backgroundColor: "#0D98BA", 
            height: "5%", 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem"
        }}>
            <div style={{display: "flex", alignItems: "center", paddingLeft: "0.5rem"}}>
                <button
                    onClick={() => router.push("/")}
                    style={{ background: "transparent", border: "0px"}}
                >
                    <Home size={"3rem"} color="white"/>
                </button>
                <button
                    onClick={() => router.push("/")}
                    style={{ background: "transparent", border: "0px" }}
                >
                    <h2 style={{color: "white"}}>Room Booking System</h2>
                </button>
            </div>

            <div style={{display: "flex", gap: "0.5rem", paddingRight: "0.5rem"}}>
                <h3 style={{color: "white"}}>Login</h3>
                <h3 style={{color: "white"}}>Register</h3>
            </div>
        </nav>
    )
}

export default Navbar