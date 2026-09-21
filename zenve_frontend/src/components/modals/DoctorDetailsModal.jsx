export default function DoctorDetailsModal({ doctor, onClose }) {
  return <div className="modal-overlay"><div className="details-modal"><button className="close" onClick={onClose}>×</button><div className="details-header"><div className="big-avatar">{doctor.initial}</div><div><h2>{doctor.name}</h2><p>{doctor.specialization}</p></div></div><div className="details-list">
    <div><span>Specialization</span><strong>{doctor.specialization}</strong></div><div><span>Qualification</span><strong>{doctor.qualification}</strong></div><div><span>Phone Number</span><strong>{doctor.phone}</strong></div><div><span>City</span><strong>{doctor.city}</strong></div><div><span>Pin Code</span><strong>{doctor.pin}</strong></div><div><span>Experience</span><strong>{doctor.experience}</strong></div>
  </div></div></div>;
}
