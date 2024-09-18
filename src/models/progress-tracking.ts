
export interface Progress {
    taskName: string;
    currentStep: number;
    totalSteps: number;
    stepDescription: string;
}

export interface ProgressUpdate {
    taskProgress: Record<string, Progress>,
    overallProgress: Progress
}
