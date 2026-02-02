import { Outlet } from "react-router";

export default function MainLayout() {
  return(
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar - Podrías moverlo a src/components/Sidebar.tsx después */}
      <aside style={{ width: "250px", background: "#1a1a1a", color: "white", padding: "1rem" }}>
        <nav>
          <h3>Admin Pro</h3>
          <ul>
            <li><a href="/dashboard" style={{ color: "white" }}>Dashboard</a></li>
            <li><a href="/users" style={{ color: "white" }}>Usuarios</a></li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "2rem", background: "#f5f5f5" }}>
        <header style={{ marginBottom: "1rem", borderBottom: "1px solid #ddd" }}>
          <span>Bienvenido de nuevo</span>
        </header>
        
        {/* Aquí es donde React Router inyecta las páginas (dashboard, users, etc.) */}
        <Outlet />
      </main>
    </div>
  )
}