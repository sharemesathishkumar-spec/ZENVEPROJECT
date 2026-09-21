export default function Header() {
  return (
    <header className="top-header">
      <div><h1>Sales Executive – Reports</h1><p>Track Performance • Manage Leads • Achieve Targets</p></div>
      <div className="header-controls">
        <span>View As</span><select><option>Sales Executive</option><option>Sales Manager</option><option>Regional Manager</option></select>
        <span>Month</span><select><option>September 2026 (Current)</option><option>August 2026</option><option>July 2026</option></select>
        <button className="help-btn">?</button>
      </div>
    </header>
  );
}
