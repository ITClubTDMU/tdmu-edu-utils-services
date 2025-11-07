import { QueryData } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';
import { sbdb } from '~/lib/supabase';
import { Database } from '~/types/db/database.types';
import { ErrorKey } from '~/types/http';
import { EWorkflowAction } from '~/types/workflow';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';

export async function test(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(createHttpSuccess({ message: 'Hello World' }));
  } catch (err) {
    next(err);
  }
}

export async function getInformativeWorkflows(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await sbdb.from('workflow_info').select('*');
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function getInformativeWorkflowById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { data } = await sbdb.from('workflow_info').select('*').eq('id', id).maybeSingle();
    if (data == null) throw createHttpErr(ErrorKey.NOT_FOUND, 'Workflow not found');
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function getWorkflowStepsByWorkflowId(req: Request, res: Response, next: NextFunction) {
  // lay ra cac steps thuoc workflowID và lấy thêm current_step từ workflow_instances (nếu có tồn tại instanceId nếu không có thì mặc định currentStep là 1)
  try {
    const { id: workflow_id, instanceId } = req.params;
    const { data, error } = await sbdb
      .from('workflow_steps')
      .select('*')
      .eq('workflow_id', workflow_id)
      .order('step_number', { ascending: true });
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    const { data: instanceData } = await sbdb
      .from('workflow_instances')
      .select('*')
      .eq('workflow_id', workflow_id)
      .eq('id', instanceId)
      .maybeSingle();

    const current_step = instanceData?.current_step || 1;

    res.json(
      createHttpSuccess(
        data.map((step) => ({
          ...step,
          current_step
        }))
      )
    );
  } catch (err) {
    next(err);
  }
}

export async function getActionsButtonsByWorkflowIdAndInstanceId(req: Request, res: Response, next: NextFunction) {
  try {
    const { workflowId: workflow_id, instanceId: instance_id } = req.params;
    const { data: steps, error } = await sbdb
      .from('workflow_steps')
      .select('*')
      .eq('workflow_id', workflow_id)
      .order('step_number', { ascending: true });
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    const { data: instanceData } = await sbdb
      .from('workflow_instances')
      .select('*')
      .eq('workflow_id', workflow_id)
      .eq('id', instance_id)
      .maybeSingle();

    const current_step = steps.find((step) => step.step_number === (instanceData?.current_step ?? 1));

    const actions = current_step?.actions as any;

    const handlerType = current_step?.handler_type;
    let result = [];

    if (handlerType === 'AUTHOR' && instanceData?.user_id === req.user_id) result = actions?.buttons;
    else if (handlerType === 'USER' && current_step?.handler_ref === req.user_id) result = actions?.buttons;
    else if (!handlerType) result = actions?.buttons;
    res.json(createHttpSuccess(result ?? []));
  } catch (err) {
    next(err);
  }
}
export async function getWorkflowInstancesByWorkflowId(req: Request, res: Response, next: NextFunction) {
  // lay ra nhung form ma thuoc workflowID đó mà user đã submitted (gửi đi)
  try {
    const { workflowId: workflow_id } = req.params;

    const { data } = await sbdb
      .from('workflow_instances')
      .select('*')
      .eq('workflow_id', workflow_id)
      .eq('user_id', req.user_id!);

    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function getWorkflowInstanceById(req: Request, res: Response, next: NextFunction) {
  // lay ra instance cua workflow
  try {
    const { id: instance_id } = req.params;
    const { data } = await sbdb.from('workflow_instances').select('*').eq('id', instance_id).maybeSingle();
    if (data == null) throw createHttpErr(ErrorKey.NOT_FOUND, 'Workflow instance not found');
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function getWorkflowHistoryByInstanceId(req: Request, res: Response, next: NextFunction) {
  // lay ra cac history cua workflow instance
  // /workflow/history/:instanceId
  try {
    const { instanceId: instance_id } = req.params;
    const { data, error } = await sbdb
      .from('workflow_instance_history')
      .select('*')
      .eq('instance_id', instance_id)
      .order('created_at', { ascending: false });
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

// #region create new

//user create new workflow
export async function createNewInstance(req: Request, res: Response, next: NextFunction) {
  try {
    const { workflowId: workflow_id } = req.params;
    const { formData } = req.body;
    const { data, error } = await sbdb
      .from('workflow_instances')
      .insert({
        workflow_id: workflow_id,
        user_id: req.user_id!,
        form_data: formData,
        current_step: 2,
        status: 'in_progress'
      })
      .select('*')
      .single();

    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    // insert into workflow_instance_history
    const { data: historyData, error: historyError } = await sbdb.from('workflow_instance_history').insert({
      instance_id: data.id,
      step_number: 1,
      action: 'create',
      actor_role: 'student',
      comment: 'Đã gửi đơn',
      action_by: req.user_id!
    });

    if (historyError) throw createHttpErr(ErrorKey.DB_ERROR, historyError.message);
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}
// #endregion create new

// #region submitInstance
export async function submitInstance(req: Request, res: Response, next: NextFunction) {
  try {
    const { instanceId: instance_id } = req.params;
    const { action, currentStep, comment, workflowId: workflow_id, formData } = req.body;

    const { data: nextStepData, error: nextStepError } = await sbdb
      .from('workflow_steps')
      .select('*')
      .eq('step_number', Number(currentStep) + 1)
      .eq('workflow_id', workflow_id)
      .single();
    if (nextStepError) throw createHttpErr(ErrorKey.DB_ERROR, nextStepError.message);

    let nextStep = nextStepData.step_number,
      nextStatus = nextStepData.status;

    if (action === EWorkflowAction.REJECT || action === EWorkflowAction.ALIGNING) {
      nextStatus = EWorkflowAction.IN_PROGRESS;
      nextStep = 1;
      if (action === EWorkflowAction.REJECT) nextStatus = EWorkflowAction.REJECT;
    }

    // if next step is end, then end this workflow instance
    if (nextStepData.is_end) nextStep += 1;

    const { error } = await sbdb
      .from('workflow_instances')
      .update({
        status: nextStatus,
        current_step: nextStep,
        form_data: formData
      })
      .eq('id', instance_id);
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    const { error: historyError } = await sbdb.from('workflow_instance_history').insert({
      instance_id,
      step_number: currentStep,
      action,
      actor_role: 'staff',
      comment,
      action_by: req.user_id!
    });
    if (historyError) throw createHttpErr(ErrorKey.DB_ERROR, historyError.message);

    res.json(createHttpSuccess({ message: 'Workflow instance submitted successfully' }));
  } catch (err) {
    next(err);
  }
}
// #endregion submitInstance

export async function getWorkflowInstanceWithHistoryById(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, searchTerm = '', status } = req.query;
    const { workflowId: workflow_id } = req.params;

    const workflowInstanceWithHistoryQuery = sbdb
      .from('workflow_instances')
      .select(
        `
      *,
      history:workflow_instance_history!instance_id (
        id,
        instance_id,
        step_number,
        action,
        actor_role,
        comment,
          created_at
      )
    `
      )
      // .eq('workflow_id', workflow_id)
      .limit(20);

    if (searchTerm) {
      workflowInstanceWithHistoryQuery.like('form_data->>fullName', `%${searchTerm}%`);
    }
    if (status) {
      workflowInstanceWithHistoryQuery.eq('status', status as Database['public']['Enums']['workflow_status']);
    }

    type WorkflowInstanceWithHistory = QueryData<typeof workflowInstanceWithHistoryQuery>;
    const { data: workflowInstanceWithHistoryData, error: workflowInstanceWithHistoryError } =
      await workflowInstanceWithHistoryQuery;
    if (workflowInstanceWithHistoryError)
      throw createHttpErr(ErrorKey.DB_ERROR, workflowInstanceWithHistoryError.message);
    const workflowInstanceWithHistory: WorkflowInstanceWithHistory = workflowInstanceWithHistoryData;
    res.json(createHttpSuccess(workflowInstanceWithHistory));
  } catch (err) {
    next(err);
  }
}

export async function getPendingInstancesByPermission(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, searchTerm = '', status } = req.query;
    const { workflowId: workflow_id } = req.params;
    console.log('workflow_id', workflow_id);
    const { data: steps, error: stepsError } = await sbdb
      .from('workflow_steps')
      .select('*')
      .eq('workflow_id', workflow_id);
    if (stepsError) throw createHttpErr(ErrorKey.DB_ERROR, stepsError.message);
    const workflowInstanceWithHistoryQuery = sbdb
      .from('workflow_instances')
      .select(
        `
      *,
      history:workflow_instance_history!instance_id (
        step_number,
        action,
        actor_role,
        comment,
  created_at:history->created_at
      )
    `
      )
      // .eq('workflow_id', workflow_id)
      .limit(20);

    if (searchTerm) {
      workflowInstanceWithHistoryQuery.like('form_data->>fullName', `%${searchTerm}%`);
    }
    if (status) {
      workflowInstanceWithHistoryQuery.eq('status', status as Database['public']['Enums']['workflow_status']);
    }

    type WorkflowInstanceWithHistory = QueryData<typeof workflowInstanceWithHistoryQuery>;
    const { data: workflowInstanceWithHistoryData, error: workflowInstanceWithHistoryError } =
      await workflowInstanceWithHistoryQuery;
    if (workflowInstanceWithHistoryError)
      throw createHttpErr(ErrorKey.DB_ERROR, workflowInstanceWithHistoryError.message);

    const stepObj = steps.reduce(
      (acc, step) => {
        acc[step.step_number] = {
          handler_type: step.handler_type ?? '',
          handler_ref: step.handler_ref ?? ''
        };
        return acc;
      },
      {} as Record<
        number,
        {
          handler_type: string;
          handler_ref: string;
        }
      >
    );

    const workflowInstanceWithHistory: WorkflowInstanceWithHistory = workflowInstanceWithHistoryData.filter(
      (instance) => {
        const step = stepObj[instance.current_step];
        console.log('step', step, instance.user_id, req.user_id);
        if (step.handler_type === 'AUTHOR' && req.user_id === instance.user_id) return true;
        if (step.handler_type === 'USER' && step.handler_ref === req.user_id) return true;
        return false;
      }
    );

    res.json(createHttpSuccess(workflowInstanceWithHistory));
  } catch (err) {
    next(err);
  }
}
export async function getWorkflowInstancesByMe(req: Request, res: Response, next: NextFunction) {
  try {
    const { workflowId: workflow_id } = req.params;
    const { page = 1, limit = 20, searchTerm = '', status } = req.query;
    const { data, error: dataError } = await sbdb
      .from('workflow_instances')
      .select('*')
      .eq('user_id', req.user_id!)
      .eq('workflow_id', workflow_id);
    if (dataError) throw createHttpErr(ErrorKey.DB_ERROR, dataError.message);

    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function getWorkflowWithStepsByWorkflowId(req: Request, res: Response, next: NextFunction) {
  try {
    const { workflowId: workflow_id } = req.params;
    const { page = 1, limit = 20, searchTerm = '', status } = req.query;

    const workflowWithStepsQuery = sbdb
      .from('workflow_info')
      .select(
        `
      *,
      steps:workflow_steps!workflow_id (
        id:step_id,
        step_number,
        handler_type,
        handler_ref,
        is_end,
        status,
        type
      )
    `
      )
      // .eq('workflow_id', workflow_id)
      .limit(20);

    type WorkflowWithSteps = QueryData<typeof workflowWithStepsQuery>;
    const { data: workflowWithStepsData, error: workflowWithStepsError } = await workflowWithStepsQuery;
    if (workflowWithStepsError) throw createHttpErr(ErrorKey.DB_ERROR, workflowWithStepsError.message);

    res.json(createHttpSuccess(workflowWithStepsData));
  } catch (err) {
    next(err);
  }
}
export async function updateWorkflowStep(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: step_id } = req.params;
    const { handler_type, handler_ref, is_end, status, type, description, step_number, actions } = req.body;
    console.log('step_id', is_end);
    const { error } = await sbdb
      .from('workflow_steps')
      .update({ handler_type, handler_ref, is_end, status, type, description, step_number, actions })
      .eq('id', step_id);
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.json(createHttpSuccess({ message: 'Workflow step updated successfully' }));
  } catch (err) {
    next(err);
  }
}

export async function createNewWorkflow(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, type } = req.body;
    const { error } = await sbdb.from('workflow_info').insert({ name, description, step_count: 0, type });
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.json(createHttpSuccess({ message: 'Workflow created successfully' }));
  } catch (err) {
    next(err);
  }
}

export async function createWorkflowStep(req: Request, res: Response, next: NextFunction) {
  try {
    const { workflowId: workflow_id } = req.params;
    const { step_number, handler_type, handler_ref, is_end, status, type, description, actions } = req.body;
    const { error } = await sbdb
      .from('workflow_steps')
      .insert({ workflow_id, step_number, handler_type, handler_ref, is_end, status, type, description, actions });
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.json(createHttpSuccess({ message: 'Workflow step created successfully' }));
  } catch (err) {
    next(err);
  }
}

export async function deleteWorkflowStep(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: step_id } = req.params;
    const { error } = await sbdb.from('workflow_steps').delete().eq('id', step_id);
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.json(createHttpSuccess({ message: 'Workflow step deleted successfully' }));
  } catch (err) {
    next(err);
  }
}
