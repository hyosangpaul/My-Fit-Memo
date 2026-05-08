export interface SetInfo {
  weight: number;
  reps: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: SetInfo[];
}

export interface WorkoutRecord {
  id: string;
  routineId: string;
  routineName: string;
  date: string;
  time: string;
  totalVolume: number;
  exercises: Exercise[];
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  updatedAt: number;
}
