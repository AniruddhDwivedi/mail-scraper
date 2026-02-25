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

function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/dashboard");
      const data = await res.json();

      setEmails(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div
      className={
        darkMode
          ? "bg-dark text-light min-vh-100 p-4"
          : "bg-light text-dark min-vh-100 p-4"
      }
    >
      <Container className="mt-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gmail Inbox Analytics</h1>

          <button
            className="btn btn-secondary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>
        </div>

        {/* ACTION PANEL */}
        <Row className="mb-4">
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Controls</Card.Title>

                <Stack direction="horizontal" gap={3}>
                  <Button
                    variant="primary"
                    onClick={() =>
                      (window.location.href =
                        "http://localhost:3000/auth/google")
                    }
                  >
                    Connect Gmail
                  </Button>

                  <Button onClick={fetchDashboard} disabled={loading}>
                    {loading ? "Loading..." : "Load Dashboard"}
                  </Button>
                </Stack>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* EMAIL DISPLAY */}
        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Email Results</Card.Title>

                <ListGroup variant="flush">
                  <hr />
                  {loading ? (
                    <div className="text-center mt-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    emails.map((email) => (
                      <div key={email.id}>
                        <b>{email.sender}</b>
                        <p>{email.subject}</p>
                        <small>{email.snippet}</small>
                        <hr />
                      </div>
                    ))
                  )}

                  {emails.length === 0 ? (
                    <p>No emails loaded</p>
                  ) : (
                    emails.map((email) => (
                      <div key={email.id}>
                        <b>{email.sender}</b>
                        <p>{email.subject}</p>
                        <small>{email.snippet}</small>
                        <hr />
                      </div>
                    ))
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
