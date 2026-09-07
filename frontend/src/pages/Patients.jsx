import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PatientModal from "../components/PatientModal";

import { apiFetch } from "../api";


function Patients({ onLogout }) {

  const [patients, setPatients] = useState([]);
  const [owners, setOwners] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchData();
  }, []);


  // ==========================================
  // LOAD PATIENTS + OWNERS
  // ==========================================

  const fetchData = async () => {

    setLoading(true);
    setError("");

    try {

      const [
        patientsResponse,
        ownersResponse
      ] = await Promise.all([

        apiFetch("/patients/"),

        apiFetch("/owners/")

      ]);


      // If refresh also failed
      if (
        patientsResponse.status === 401 ||
        ownersResponse.status === 401
      ) {

        localStorage.removeItem(
          "zenve_access_token"
        );

        localStorage.removeItem(
          "zenve_refresh_token"
        );

        onLogout();

        return;
      }


      if (!patientsResponse.ok) {
        throw new Error(
          "Unable to load patients."
        );
      }


      if (!ownersResponse.ok) {
        throw new Error(
          "Unable to load owners."
        );
      }


      const patientsData =
        await patientsResponse.json();

      const ownersData =
        await ownersResponse.json();


      setPatients(patientsData);
      setOwners(ownersData);

    }

    catch (err) {

      setError(
        err.message ||
        "Unable to connect to server."
      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // CREATE PATIENT
  // ==========================================

  const addPatient = async (patient) => {

    setError("");

    try {

      const response = await apiFetch(
        "/patients/",
        {
          method: "POST",

          body: JSON.stringify(patient),
        }
      );


      // Authentication failed even after refresh
      if (response.status === 401) {

        localStorage.removeItem(
          "zenve_access_token"
        );

        localStorage.removeItem(
          "zenve_refresh_token"
        );

        onLogout();

        return;
      }


      const data =
        await response.json();


      if (!response.ok) {

        const message =
          data.detail ||
          data.error ||
          Object.values(data)
            .flat()
            .join(" ") ||
          "Unable to register patient.";


        throw new Error(message);
      }


      // Add new patient to screen
      setPatients(
        (currentPatients) => [
          data,
          ...currentPatients,
        ]
      );


      // Close modal
      setShowModal(false);

    }

    catch (err) {

      setError(
        err.message ||
        "Unable to register patient."
      );

    }

  };


  // ==========================================
  // OWNER CREATED
  // ==========================================

  const handleOwnerCreated = (newOwner) => {

    setOwners(
      (currentOwners) => [
        ...currentOwners,
        newOwner,
      ]
    );

  };


  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredPatients =
    patients.filter((patient) => {

      const petName =
        patient.pet_name || "";

      const ownerName =
        patient.owner_name || "";

      const breed =
        patient.breed || "";


      const searchText =
        search.toLowerCase();


      const matchesSearch =
        petName
          .toLowerCase()
          .includes(searchText) ||

        ownerName
          .toLowerCase()
          .includes(searchText) ||

        breed
          .toLowerCase()
          .includes(searchText);


      const matchesFilter =
        filter === "All" ||
        patient.species === filter;


      return (
        matchesSearch &&
        matchesFilter
      );

    });


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="app-layout">

      <Sidebar />


      <main className="main-content">


        <Header
          onNewPatient={() =>
            setShowModal(true)
          }
        />


        {/* ERROR */}

        {error && (

          <div
            style={{
              background: "#fff1f2",
              color: "#b42318",
              border: "1px solid #f3b4b4",
              padding: "12px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >

            {error}

          </div>

        )}


        {/* SEARCH */}

        <section className="patient-toolbar">


          <input
            className="search-input"
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <div className="filter-buttons">


            {[
              "All",
              "Dog",
              "Cat"
            ].map((item) => (

              <button
                key={item}
                type="button"

                className={
                  filter === item
                    ? "filter active"
                    : "filter"
                }

                onClick={() =>
                  setFilter(item)
                }
              >

                {item}

              </button>

            ))}


          </div>


        </section>


        {/* PATIENT LIST */}

        <section className="patient-section">


          <div className="section-heading">


            <div>

              <h2>
                Patient list
              </h2>


              <p>

                {loading
                  ? "Loading..."
                  : `${filteredPatients.length} patients`
                }

              </p>

            </div>


            <button
              type="button"
              className="new-patient-outline"

              onClick={() =>
                setShowModal(true)
              }
            >

              + New patient

            </button>


          </div>


          {/* TABLE */}

          <div className="patient-table">


            <div className="table-header">

              <span>
                Patient
              </span>

              <span>
                Species
              </span>

              <span>
                Breed
              </span>

              <span>
                Sex
              </span>

              <span>
                Owner
              </span>

              <span>
                Weight
              </span>

            </div>


            {/* LOADING */}

            {loading ? (

              <div className="empty-state">

                Loading patients...

              </div>


            ) : filteredPatients.length === 0 ? (

              <div className="empty-state">

                No patients found.

              </div>


            ) : (

              filteredPatients.map(
                (patient) => (

                  <div
                    className="table-row"
                    key={patient.id}
                  >


                    <div className="patient-name">


                      <div className="pet-avatar">

                        {(
                          patient.pet_name ||
                          "?"
                        )
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <strong>

                        {patient.pet_name}

                      </strong>


                    </div>


                    <span>
                      {patient.species}
                    </span>


                    <span>
                      {patient.breed || "-"}
                    </span>


                    <span>
                      {patient.sex || "-"}
                    </span>


                    <span>
                      {patient.owner_name || "-"}
                    </span>


                    <span>

                      {patient.weight !== null &&
                      patient.weight !== ""
                        ? `${patient.weight} kg`
                        : "-"
                      }

                    </span>


                  </div>

                )
              )

            )}


          </div>


        </section>


        {/* LOGOUT */}

        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
        >

          Logout

        </button>


      </main>


      {/* PATIENT MODAL */}

      {showModal && (

        <PatientModal

          owners={owners}

          onClose={() =>
            setShowModal(false)
          }

          onRegister={addPatient}

          onOwnerCreated={
            handleOwnerCreated
          }

        />

      )}


    </div>

  );

}


export default Patients;