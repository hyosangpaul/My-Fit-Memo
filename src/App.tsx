/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Dashboard from "./components/Dashboard";
import RoutinePage from "./components/RoutinePage";
import RoutineDetailPage from "./components/RoutineDetailPage";
import RoutineViewPage from "./components/RoutineViewPage";
import RoutineSelectionPage from "./components/RoutineSelectionPage";
import HistoryPage from "./components/HistoryPage";
import WorkoutSession from "./components/WorkoutSession";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/routine" element={<RoutinePage />} />
            <Route path="/routine/:id" element={<RoutineViewPage />} />
            <Route path="/routine/:id/edit" element={<RoutineDetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/session/:id" element={<WorkoutSession />} />
            <Route path="/select-routine" element={<RoutineSelectionPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

