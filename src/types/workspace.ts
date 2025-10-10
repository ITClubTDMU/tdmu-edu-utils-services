import { TDB } from './db';

export type TWorkspace = TDB['workspaces']['Row'];
export type TWorkspaceCreate = TDB['workspaces']['Insert'];
export type TWorkspaceUpdate = TDB['workspaces']['Update'];


export type TProject = TDB['projects']['Row'] & {
  file_path: {
    origin: string;
    preview: string;
    originFullPath: string;
    previewFullPath: string;
  };
};