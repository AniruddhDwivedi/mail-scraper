import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  Stack,
  Spinner
} from "react-bootstrap";
import "./Dashboard.css";

function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [advanced, setAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    senderFrequency: false,
    recentSenders: false,
    keyword: "",
    startDate: "",
    endDate: ""
  });

  const handleSearch = async () => {
    const res = await fetch(
      `http://localhost:3000/api/search?sender=${search}`
    );

    const data = await res.json();

    setResults(data);
  };

  const loadStats = async () => {
    try {
      setLoading(true);

      await fetch("http://localhost:3000/api/sync");

      const res = await fetch("http://localhost:3000/api/stats");

      if (!res.ok) {
        throw new Error("Stats failed");
      }

      const data = await res.json();

      setStats(data);
      setExpanded(true);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const syncAndLoad = async () => {
    setLoading(true);

    try {
      console.log("Syncing emails...");

      await fetch("http://localhost:3000/api/sync");

      console.log("Loading dashboard...");

      await fetchDashboard();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/dashboard");

      const data = await res.json();

      console.log("Server response:", data);

      setEmails(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  const handleAdvancedSearch = async () => {
    const res = await fetch("http://localhost:3000/api/advanced", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(filters)
    });

    const data = await res.json();

    setResults(data);
  };

  return (
    <>
      <div className="app-header">
        <div className="app-title">Gmail Inbox Analytics</div>

        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="dashboard-container">
        {/* Load Button */}

        {!expanded && (
          <button className="load-button" onClick={loadStats}>
            {loading ? "Loading..." : "Load Mail"}
          </button>
        )}

        {/* Dashboard Content */}

        {expanded && (
          <div className="content-container">
            {/* Search Mode */}

            {!advanced && (
              <div className="search-row">
                <input
                  className="form-control"
                  placeholder="Search sender..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <br></br>
                <button onClick={handleSearch}>Search</button>
                <br></br>
                <button onClick={() => setAdvanced(true)}>
                  Advanced Search
                </button>
              </div>
            )}

            {/* Advanced Mode */}

            {advanced && (
              <>
                <div className="advanced-header">
                  <button
                    className="back-button"
                    onClick={() => setAdvanced(false)}
                  >
                    ← Back
                  </button>

                  <div className="advanced-title">Advanced Search</div>
                </div>

                <div className="advanced-panel">
                  <div className="filter-row">
                    <label>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            senderFrequency: e.target.checked
                          })
                        }
                      />
                      Top Senders
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            recentSenders: e.target.checked
                          })
                        }
                      />
                      Recent Senders
                    </label>
                  </div>

                  <div className="filter-row">
                    <input
                      className="form-control"
                      placeholder="Subject keyword"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          keyword: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="filter-row date-row">
                    <input
                      type="date"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          startDate: e.target.value
                        })
                      }
                    />

                    <input
                      type="date"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          endDate: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="filter-row apply-row">
                    <button onClick={handleAdvancedSearch}>
                      Apply Filters
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Results */}

            {results.length > 0 && (
              <div className="email-container">
                {results.map((mail) => (
                  <div key={mail.id} className="email-card">
                    <div className="email-header">{mail.sender}</div>

                    <div className="email-body">
                      <div className="email-subject">{mail.subject}</div>

                      <div className="email-snippet">{mail.snippet}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
