import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Layers, BookOpen, UserCircle, LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleUserClick() {
        if (user) {
            logout();
            navigate("/login");
        } else {
            navigate("/login");
        }
    }

    return (
        <aside className={`sidebar${collapsed ? " is-collapsed" : ""}`}>
            <div className="sidebar-top">
                <button
                    className="icon-btn hamburger"
                    title="Menu"
                    aria-label="Open/Close menu"
                    onClick={() => setCollapsed((prev) => !prev)}
                >
                    <Menu size={20} />
                </button>
                <img src={logo} alt="RiftFolio" className="sidebar-logo" />
                <span className="sidebar-brand">RiftFolio</span>
            </div>

            <nav className="sidebar-nav">
                <button className="sidebar-item active" title="Buscar">
                    <Search size={20} />
                    <span>Search</span>
                </button>
                <button className="sidebar-item" title="Colección">
                    <Layers size={20} />
                    <span>Collection</span>
                </button>
                <button className="sidebar-item" title="Mazos">
                    <BookOpen size={20} />
                    <span>Decks</span>
                </button>
            </nav>

            <div className="sidebar-spacer" />

            <button
                className="sidebar-user"
                title={user ? "Cerrar sesión" : "Iniciar sesión"}
                onClick={handleUserClick}
            >
                {user ? <LogOut size={18} /> : <UserCircle size={18} />}
                <span>{user ? user.username : "Login"}</span>
            </button>
        </aside>
    );
}

export default Sidebar;