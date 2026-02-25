import ScrapingOutliner from "../components/ScrapingOutliner";
import React, { useState } from "react";

function Dashboard() {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
  await fetch("http://localhost:3000/api/emails");
  alert("Emails synced!");
};

const fetchDashboard = async () => {
  const res = await fetch("http://localhost:3000/api/dashboard");
  const data = await res.json();
  setEmails(data);
};

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gmail Inbox Analytics Dashboard</h1>

      <button
        onClick={() =>
          (window.location.href = "http://localhost:3000/auth/google")
        }
      >
        Connect Gmail
      </button>

      <button onClick={fetchEmails}>Fetch Emails</button>
      <button onClick={fetchDashboard}>Load Dashboard</button>

      <hr />

      {emails.map((email) => (
        <div key={email.id}>
          <b>{email.sender}</b>
          <p>{email.subject}</p>
          <small>{email.snippet}</small>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
