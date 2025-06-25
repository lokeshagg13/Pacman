import { createContext, useRef, useState } from "react";
import { runSimulation, resumeSimulation } from "../logic/simulator/train";

const SimulatorContext = createContext({
    simulatorStatus: null,
    simulatorCanvasRef: null,
    logInfo: null,
    openSimulator: () => { },
    beginSimulation: () => { },
    continueSimulation: () => { },
    resetSimulator: () => { },
    closeSimulator: () => { },
    updateLogInfo: () => { },
    clearLogInfo: () => { },
});

export function SimulatorContextProvider(props) {
    const [simulatorStatus, setSimulatorStatus] = useState(null);
    const [logInfo, setLogInfo] = useState({});
    const simulatorCanvasRef = useRef(null);
    const isSimulationCancelled = useRef(false);

    function isSimulatorRunning() {
        return !isSimulationCancelled.current;
    }

    function openSimulator() {
        setSimulatorStatus("opened");
    }

    function beginSimulation() {
        setSimulatorStatus("running");
        isSimulationCancelled.current = false;
        runSimulation(simulatorCanvasRef.current, updateLogInfo, isSimulatorRunning);
    }

    function continueSimulation(generationNum, customGenomeData) {
        setSimulatorStatus("running");
        isSimulationCancelled.current = false;
        resumeSimulation(simulatorCanvasRef.current, generationNum, customGenomeData, updateLogInfo, isSimulatorRunning);

    }

    function clearSimulationCanvas() {
        const simulatorCanvas = simulatorCanvasRef.current;
        if (simulatorCanvas) {
            const ctx = simulatorCanvas.getContext("2d");
            ctx.clearRect(0, 0, simulatorCanvas.width, simulatorCanvas.height);
        }
    }

    function resetSimulator() {
        setSimulatorStatus("opened");
        clearSimulationCanvas();
        isSimulationCancelled.current = true;
        clearLogInfo();
    }

    function closeSimulator() {
        setSimulatorStatus(null);
        clearSimulationCanvas();
        isSimulationCancelled.current = true;
        clearLogInfo();
    }

    function updateLogInfo(updates) {
        setLogInfo(prev => ({
            ...prev,
            ...updates
        }))
    }

    function clearLogInfo() {
        setLogInfo({});
    }

    const currentSimulatorContext = {
        simulatorStatus,
        simulatorCanvasRef,
        logInfo,
        openSimulator,
        beginSimulation,
        continueSimulation,
        resetSimulator,
        closeSimulator,
        updateLogInfo,
        clearLogInfo
    };

    return (
        <SimulatorContext.Provider value={currentSimulatorContext}>
            {props.children}
        </SimulatorContext.Provider>
    );
}

export default SimulatorContext;