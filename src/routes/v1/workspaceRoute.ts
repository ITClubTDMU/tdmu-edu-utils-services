import { Router } from 'express';
import multer from 'multer';
import {
  createProject,
  createWorkspace,
  deleteFile,
  getProjects,
  getProject,
  getWorkspace,
  getWorkspaces,
  updateFile,
  uploadFile1,
  deleteProject,
  updateWorkspace,
  deleteWorkspace,
  downloadProject
} from '~/controllers/workspaceController';
import { applyVars, createVar, deleteVar, deleteVars, getVars, updateVar, updateVars } from '~/controllers/varrController';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', createWorkspace);
router.get('/', getWorkspaces);
router.get('/:id', getWorkspace);
router.delete('/:id', deleteWorkspace);
router.put('/:id', updateWorkspace);

router.post('/create-project', upload.single('file'), createProject);
router.get('/:workspace_id/projects', getProjects);
router.get('/:workspace_id/projects/:project_id', getProject);
router.delete('/:workspace_id/projects/:project_id', deleteProject);
  
router.post('/upload', upload.single('file'), uploadFile1);
router.put('/file', upload.single('file'), updateFile);
router.delete('/delete', deleteFile);

const varsRouter = Router();
// varsRouter.get('/', getVars);
// varsRouter.post('/', createVar);
// varsRouter.put('/:var_id', updateVar);
// varsRouter.delete('/:var_id', deleteVar);

router.get('/:workspace_id/projects/:project_id/vars', getVars);
router.delete('/:workspace_id/projects/:project_id/vars/:var_id', deleteVar);
router.put('/:workspace_id/projects/:project_id/vars/:var_id', updateVar);
router.put('/:workspace_id/projects/:project_id/vars', updateVars);
router.delete('/:workspace_id/projects/:project_id/vars', deleteVars);
router.post('/:workspace_id/projects/:project_id/vars', createVar);
// apply vars
router.post('/:workspace_id/projects/:project_id/vars/apply', applyVars);
router.get('/:workspace_id/projects/:project_id/download', downloadProject);

export { router as workspaceRouter };
