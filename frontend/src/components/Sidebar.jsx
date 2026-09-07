import { Users } from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">Z</div>
        <div>
          <div className="logo-title">ZENVE</div>
          <div className="logo-subtitle">DOCTORS</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">
          <Users size={20} />
          <span>Patients</span>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;