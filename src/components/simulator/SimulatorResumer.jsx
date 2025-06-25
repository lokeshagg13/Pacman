import { useContext, useState } from "react";
import SimulatorContext from "../../store/simulatorContext";
import ClearIcon from "../ui/ClearIcon";
import UploadIcon from "../ui/UploadIcon";

function SimulatorResumer() {
  const simulatorContext = useContext(SimulatorContext);

  const [generation, setGeneration] = useState(1);
  const [genomeJsonFile, setGenomeJsonFile] = useState(null);
  const [genomeJsonData, setGenomeJsonData] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [showContinueSimulator, setShowContinueSimulator] = useState(false);

  const openFileUploadDialog = (e) => {
    e.preventDefault();
    document.getElementById("genFileInput").click();
    setValidationError(null);
  };

  const clearFileUpload = () => {
    setGenomeJsonFile(null);
    setGenomeJsonData(null);
    setValidationError(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  const validateGenomeJsonData = (json) => {
    const requiredKeys = ["id", "nodeGenes", "connectionGenes", "fitness"];
    for (const key of requiredKeys) {
      if (!(key in json)) {
        setValidationError(
          `Invalid JSON Format: JSON must have '${key}' field.`
        );
        return false;
      }
    }

    if (typeof json.id !== "number") {
      setValidationError("Invalid JSON Format: 'id' must be a numeric value.");
      return false;
    }

    if (!Array.isArray(json.nodeGenes) || json.nodeGenes.length === 0) {
      setValidationError(
        "Invalid JSON Format: 'nodeGenes' must be a non-empty array."
      );
      return false;
    } else {
      for (let index = 0; index < json.nodeGenes.length; index += 1) {
        const node = json.nodeGenes[index];
        if (!("id" in node) || !("type" in node)) {
          setValidationError(
            `Invalid JSON Format: 'nodeGenes[${index}]' must have 'id' and 'type' keys.`
          );
          return false;
        }
      }
    }

    if (
      !Array.isArray(json.connectionGenes) ||
      json.connectionGenes.length === 0
    ) {
      setValidationError(
        "Invalid JSON Format: 'connectionGenes' must be a non-empty array."
      );
      return false;
    } else {
      for (let index = 0; index < json.connectionGenes.length; index += 1) {
        const connection = json.connectionGenes[index];
        const requiredKeys = [
          "innovationNumber",
          "inNodeId",
          "outNodeId",
          "enabled",
          "weight",
          "recurrent",
        ];
        for (const key of requiredKeys) {
          if (!(key in connection)) {
            setValidationError(
              `Invalid JSON Format: 'connectionGenes[${index}]' must have '${key}' key.`
            );
            return false;
          }
        }
      }
    }

    if (typeof json.fitness !== "number") {
      setValidationError(
        "Invalid JSON Format: 'fitness' must be a numeric value."
      );
      return false;
    }

    return true;
  };

  const handleGenomeJsonFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      setGenomeJsonFile(file.name);
      reader.onload = (event) => {
        try {
          const parsedJson = JSON.parse(event.target.result);
          setGenomeJsonData(parsedJson);
        } catch (err) {
          setValidationError("Unable to parse the JSON file.");
          setGenomeJsonFile(null);
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    }
  };

  const handleContinueSimulation = () => {
    if (
      !generation ||
      /^[0-9]*$/gm.test(generation) === false ||
      parseInt(generation) <= 0 ||
      parseInt(generation) >= 100
    ) {
      setValidationError(
        "Invalid Generation: Value must be an integer in the range 1-99"
      );
      return;
    }

    if (!genomeJsonData) {
      setValidationError("No JSON file uploaded.");
      return;
    }

    const valid = validateGenomeJsonData(genomeJsonData);

    if (valid) {
      simulatorContext.continueSimulation(parseInt(generation), genomeJsonData);
    }
  };

  if (!showContinueSimulator) {
    return (
      <div className="flex continue-simulation-text cursor-pointer">
        Want to continue your simulation?{" "}
        <span onClick={() => setShowContinueSimulator(true)}>Click Here</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col continue-simulation">
      <div className="header">
        <h3>Want to continue your simulation?</h3>
      </div>
      <div className="input-section">
        <div className="gen-input-section">
          <label>Begin From Generation</label>
          <input
            type="number"
            className="input-field"
            placeholder="Enter generation number"
            value={generation}
            onChange={(e) => setGeneration(e.target.value)}
          />
        </div>
        <div className="file-input-section">
          <label>Upload Genome File</label>
          <div className="input-file">
            <p onClick={(e) => openFileUploadDialog(e)}>
              {genomeJsonFile || "No File Selected"}
            </p>
            <div className="input-file-controls">
              <button
                className="upload-btn"
                onClick={(e) => openFileUploadDialog(e)}
              >
                <UploadIcon fillColor="green" />
              </button>
              {genomeJsonFile && genomeJsonData && (
                <button className="clear-btn" onClick={() => clearFileUpload()}>
                  <ClearIcon fillColor="red" />
                </button>
              )}
            </div>
          </div>
          <input
            id="genFileInput"
            type="file"
            accept="application/json"
            className="file-input hide"
            onChange={handleGenomeJsonFileUpload}
          />
        </div>
      </div>
      <div className="error-section">
        <p className="text-red-500">{validationError}</p>
      </div>
      <button
        className={`simulator-btn continue-simulator-btn ${
          simulatorContext.simulatorStatus === "running" ? "disabled-btn" : ""
        }`}
        onClick={
          simulatorContext.simulatorStatus === "running"
            ? () => {}
            : () => handleContinueSimulation()
        }
        disabled={simulatorContext.simulatorStatus === "running"}
      >
        {simulatorContext.simulatorStatus === "running"
          ? "Running Simulation..."
          : "Continue Simulation"}
      </button>
      <p
        className="flex justify-end mt-4 underline cursor-pointer"
        onClick={() => setShowContinueSimulator(false)}
      >
        Hide
      </p>
    </div>
  );
}

export default SimulatorResumer;
