import React from "react";
import ScrapingOutliner from "../components/ScrapingOutliner";

function Dashboard() {
  const fetchEmails = async () => {
    const res = await fetch("http://localhost:3000/api/emails");
    const data = await res.json();

    console.log(data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gmail Inbox Analytics Dashboard</h1>

      <ScrapingOutliner />

      <button
        onClick={() =>
          (window.location.href =
            "http://localhost:3000/auth/google")
        }
      >
        Connect Gmail
      </button>

      <button onClick={fetchEmails}>
        Fetch Emails
      </button>
    </div>
  );
}

export default Dashboard;