import { Routine } from "../types";

const STORAGE_KEY = "fittrack_routines";

export const getRoutines = (): Routine[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRoutines = (routines: Routine[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
};

export const addRoutine = (routine: Routine) => {
  const routines = getRoutines();
  saveRoutines([...routines, routine]);
};

export const updateRoutine = (updatedRoutine: Routine) => {
  const routines = getRoutines();
  saveRoutines(routines.map(r => r.id === updatedRoutine.id ? updatedRoutine : r));
};

export const deleteRoutine = (id: string) => {
  const routines = getRoutines();
  saveRoutines(routines.filter(r => r.id !== id));
};
