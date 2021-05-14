export interface CloudSync {
  id: number;
  description: string;
  direction: string;
  transfer_mode: string;
  job?: {
    logs_excerpt: string,
    progress: {
      percent: number,
      description: string,
      extra: any
    },
    time_started: {
      $date: number
    },
    time_finished?: {
      $date: number
    }
  };
}
