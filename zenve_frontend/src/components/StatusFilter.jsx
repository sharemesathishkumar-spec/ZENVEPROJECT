export default function StatusFilter({ statusFilter, setStatusFilter }) {
  return <section className="status-panel"><span>Reporting Status:</span>
    {['All', 'Reported', 'Not Reported'].map((status) => <label key={status}><input type="radio" checked={statusFilter === status} onChange={() => setStatusFilter(status)} />{status}</label>)}
  </section>;
}
