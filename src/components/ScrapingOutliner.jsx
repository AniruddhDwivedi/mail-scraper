import React from "react";
import { useState } from "react";

function ScrapingOutliner() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/search?keyword=${keyword}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Search Emails by Keyword</h2>
      <input
        type="text"
        placeholder="Enter keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch} style={{ marginLeft: "1rem" }}>
        Search
      </button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ScrapingOutliner;
