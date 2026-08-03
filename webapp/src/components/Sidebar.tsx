import { useState } from "react";
import { Menu, Search, Layers, BookOpen, UserCircle } from "lucide-react";

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`sidebar${collapsed ? " is-collapsed" : ""}`}>
            <div className="sidebar-top">
                <button
                    className="icon-btn hamburger"
                    title="Menu"
                    aria-label="Abrir/cerrar menú"
                    onClick={() => setCollapsed((prev) => !prev)}
                >
                    <Menu size={20} />
                </button>
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

            <button className="sidebar-user" title="Cuenta">
                <UserCircle size={18} />
                <span>Login</span>
            </button>
        </aside>
    );
}

export default Sidebar;