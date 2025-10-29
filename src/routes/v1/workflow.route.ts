import { Router } from 'express';
import {
  getWorkflowStepsByWorkflowId,
  getWorkflowHistoryByInstanceId,
  getWorkflowInstanceById,
  getWorkflowInstancesByWorkflowId,
  test,
  getInformativeWorkflowById,
  getInformativeWorkflows,
  createNewInstance,
  submitInstance,
  getWorkflowInstanceWithHistoryById,
  getActionsButtonsByWorkflowIdAndInstanceId,
  getPendingInstancesByPermission,
  getWorkflowInstancesByMe
} from '~/controllers/workflow.controller';
import { handlerWorkflowMiddleware } from '~/middlewares/handlerWorkflow.middleware';

const router = Router();

router.post('/test', test);

router.get('/informative', getInformativeWorkflows);
router.get('/informative/:id', getInformativeWorkflowById);
router.get('/steps/:id', getWorkflowStepsByWorkflowId);
router.get('/steps/:id/:instanceId', getWorkflowStepsByWorkflowId);
router.get('/history/:instanceId', getWorkflowHistoryByInstanceId);
router.get('/instances/:id', getWorkflowInstanceById);
router.get('/:workflowId/instances', getWorkflowInstancesByWorkflowId);
router.get('/instances-with-history', getWorkflowInstanceWithHistoryById);
router.get('/:workflowId/instances/me', getWorkflowInstancesByMe);
router.get('/pending-instances', getPendingInstancesByPermission);
router.get('/:workflowId/:instanceId/action-buttons', getActionsButtonsByWorkflowIdAndInstanceId);
// submit
router.post('/:workflowId/create-new', createNewInstance);
router.post('/instances/:instanceId/submit', handlerWorkflowMiddleware, submitInstance);
export { router as workflowRouter };
