import { Database } from './db/database.types';

export type TWorkflowAction = Database['public']['Enums']['workflow_status'];
export enum EWorkflowAction {
  ALIGNING = 'aligning',
  WAIT_RECEIVE = 'wait_receive',
  IN_PROGRESS = 'in_progress',
  COMPLETE = 'complete',
  RECEIVE = 'receive',
  END = 'end',
  REJECT = 'reject',
}
