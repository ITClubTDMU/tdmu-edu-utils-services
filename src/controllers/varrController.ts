import { NextFunction, Request, Response } from 'express';
import { sbdb } from '~/lib/supabase';
import { createHttpSuccess } from '~/utils/createHttpResponse';
import { TProject } from '~/types/workspace';
import { BUCKET_NAME } from '~/constants';
import { docxToPdf, modifyDocxWithVars } from '~/utils/file';

export async function getVars(req: Request, res: Response, next: NextFunction) {
  try {
    const { project_id } = req.params;
    const { data, error } = await sbdb.from('variables').select('*').eq('project_id', project_id);
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function createVar(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await sbdb.from('variables').insert({ ...req.body });
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function updateVar(req: Request, res: Response, next: NextFunction) {
  try {
    const { var_id } = req.params;
    const { data, error } = await sbdb.from('variables').update(req.body).eq('id', var_id);
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function updateVars(req: Request, res: Response, next: NextFunction) {
  try {
    const { items } = req.body;
    const { data, error } = await sbdb.from('variables').upsert(items, {
      onConflict: 'id'
    });
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function deleteVar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb.from('variables').delete().eq('id', id);
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function deleteVars(req: Request, res: Response, next: NextFunction) {
  try {
    const { project_id } = req.params;
    const { ids, type } = req.body;
    const query = sbdb.from('variables').delete();
    if (type === 'all') {
      query.eq('project_id', project_id);
    } else if (type === 'selected') {
      query.in('id', ids);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function applyVars(req: Request, res: Response, next: NextFunction) {
  try {
    const { project_id } = req.params;
    const { data, error } = await sbdb.from('projects').select('*').eq('id', project_id).limit(1);
    if (error) throw error;
    if (data.length === 0) throw new Error('Project not found');
    const project = data[0] as TProject;

    const pathOrigin = project.file_path.origin;

    const [{ data: fileOrigin, error: fileOriginError }, { data: vars, error: varsError }] = await Promise.all([
      sbdb.storage.from(BUCKET_NAME.WORKSPACES).download(pathOrigin),
      sbdb.from('variables').select('*').eq('project_id', project_id)
    ]);
    if (fileOriginError) throw fileOriginError;
    if (varsError) throw varsError;

    const buffer = await fileOrigin.arrayBuffer();

    const filename = 'applied_' + project.name;

    const fileModified = await modifyDocxWithVars(
      buffer,
      { outputPath: project_id + '/' + filename + '.docx', bucket: BUCKET_NAME.WORKSPACES },
      Object.fromEntries(vars.map((v) => [v.name, v.value]))
    );

    const bufferPdf = await docxToPdf(req, fileModified.buffer, filename + new Date().getTime().toString() + '.docx');

    const { data: filePdf, error: filePdfError } = await sbdb.storage
      .from(BUCKET_NAME.WORKSPACES)
      .upload(project_id + '/' + filename + '.pdf', bufferPdf, {
        contentType: 'application/pdf',
        upsert: true
      });
    if (filePdfError) throw filePdfError;

    await sbdb
      .from('projects')
      .update({
        file_path: {
          origin: project.file_path.origin,
          preview: project.file_path.preview,
          originFullPath: project.file_path.originFullPath,
          previewFullPath: project.file_path.previewFullPath,
          appliedOrigin: fileModified.fullPath,
          appliedPreview: filePdf.fullPath
        }
      })
      .eq('id', project_id);

    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}
