import { WorkoutRecord } from "../types";

const HISTORY_KEY = "fit-track-history";

export function getHistory(): WorkoutRecord[] {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWorkout(record: WorkoutRecord) {
  const history = getHistory();
  localStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...history]));
}

export function deleteWorkout(id: string) {
  const history = getHistory();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.filter(r => r.id !== id)));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
