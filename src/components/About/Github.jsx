import React, { useState } from "react";
import GitHubCalendar from "react-github-calendar";
import { Row, Col } from "react-bootstrap";
import { useWindowSize } from "../../utils/customHooks/useWindowSize.ts";

function Github() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const {width} = useWindowSize();
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value === 'last' ? 'last':Number(e.target.value));
  };

  const filterContributionsByYear = (contributions) => {
    return contributions.filter(
      (day) => new Date(day.date).getFullYear() === selectedYear
    );
  };

  console.log({selectedYear})
  return (
    <>
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        Days I <strong className="purple">Code</strong>
      </h1>

      <Col md={12} style={{ textAlign: "center", marginBottom: "20px" }}>
        <Col md={12} style={{ textAlign: "center", marginBottom: "20px" }}>
          <label
            style={{
              color: "#c084f5",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Select Year:
          </label>
          {width < 768 ? (
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="radio"
                value={currentYear - 1}
                checked={selectedYear === currentYear - 1}
                onChange={handleYearChange}
                style={{ accentColor: "#c084f5" }}
              />
              <span style={{ fontSize: "14px", color: "white" }}>Previous Year</span>
            </label>
          
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="radio"
                value="last"
                checked={selectedYear === "last"}
                onChange={handleYearChange}
                style={{ accentColor: "#c084f5" }}
              />
              <span style={{ fontSize: "14px", color: "white" }}>Last Year</span>
            </label>
          
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="radio"
                value={currentYear}
                checked={selectedYear === currentYear}
                onChange={handleYearChange}
                style={{ accentColor: "#c084f5" }}
              />
              <span style={{ fontSize: "14px", color: "white" }}>Current Year</span>
            </label>
          </div>
          
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() =>
              handleYearChange({ target: { value: currentYear - 1 } })
            }
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginRight: "10px",
              backgroundColor:
                selectedYear === currentYear - 1 ? "#623686" : "#c084f5",
              color: selectedYear === currentYear - 1 ? "white" : "black",
              cursor: "pointer",
            }}
          >
            Previous Year
          </button>
          <button
            onClick={() =>
              handleYearChange({ target: { value: 'last' } })
            }
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginRight: "10px",
              backgroundColor:
                selectedYear ===  'last' ? "#623686" : "#c084f5",
              color: selectedYear ===  'last' ? "white" : "black",
              cursor: "pointer",
            }}
          >
            Last Year
          </button>
          <button
            onClick={() => handleYearChange({ target: { value: currentYear } })}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
              backgroundColor:
                selectedYear === currentYear ? "#623686" : "#c084f5",
              color: selectedYear === currentYear ? "white" : "black",
              cursor: "pointer",
            }}
          >
            Current Year
          </button>
          </div>
          )}
        </Col>
      </Col>

      <GitHubCalendar
        username="danyyal"
        blockSize={15}
        blockMargin={5}
        color="#c084f5"
        fontSize={12}
        year={selectedYear}
        style={{
          margin: "0 auto",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </>
  );
}

export default Github;
