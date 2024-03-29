// onion amqp interfaces

export interface Job {
  job_id: string;
  state: 'running' | 'paused' | 'failed';
  last_paused_date: number;
  last_started_date: number;
  step_idx: number;
  pictures_quantity: number;
  node_id: string;
  politic: Politic;
  consumption: number;
  pictures_obj_key: string;
}

export interface Politic {
  quality: 'good' | 'bad';
  energy: 'green' | 'bypass';
}

export interface NodeUsed {
  start_time: number;
  end_time: number;
  node_id: number;
}

export interface AllocatedNodesPayload {
  nodes: string[];
}

export interface JobStatusPayload {
  number_of_running_jobs: number;
  jobs: Job[];
}

export interface JobRequestPayload {
  job_id: string;
  pictures_obj_key: string;
  politic: Politic;
}

export interface JobFinishedPayload {
  job_id: string;
  node_uses: NodeUsed[];
  model_obj_key: string;
  texture_obj_key: string;
  politic: Politic;
}

export interface JobResult {
  end_time: number;
  job_id: string;
  model_obj_key: string;
  node_id: string;
  pictures_quantity: number;
  start_time: number;
  texture_obj_key: string;
  total_consumption_kwh: number;
  total_production_kwh: number;
}
