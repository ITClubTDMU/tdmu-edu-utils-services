import { Request, Response, NextFunction } from 'express';
import { sbdb } from '~/lib/supabase';
import { BUCKET_NAME } from '~/constants';
import { decode } from 'base64-arraybuffer';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';
import { ErrorKey } from '~/types/http/error';
import { docxToPdf } from '~/utils/file';
import { v4 as uuidv4 } from 'uuid';

export async function getWorkspaces(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await sbdb.from('workspaces').select('*');
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}
export async function getWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb.from('workspaces').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (data == null) throw createHttpErr(ErrorKey.NOT_FOUND, 'Workspace not found');
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function createWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, user_id } = req.body;
    const { data, error } = await sbdb.from('workspaces').insert({ name, user_id });
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}
export async function deleteWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { data: projects, error: errProjects } = await sbdb.from('projects').select('*').eq('workspace_id', id);
    if (errProjects) throw errProjects;
    for (const project of projects) {
      await rollbackFileIfError(project.id, next);
    }
    const { error } = await sbdb.from('workspaces').delete().eq('id', id);
    if (error) throw error;
    res.json(createHttpSuccess({ success: true }));
  } catch (err) {
    next(err);
  }
}

export async function updateWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { error } = await sbdb.from('workspaces').update({ name }).eq('id', id);
    if (error) throw error;
    res.json(createHttpSuccess({ success: true }));
  } catch (err) {
    next(err);
  }
}

async function rollbackFileIfError(project_id: string, next: NextFunction) {
  try {
    const { data: files, error: errStorage1 } = await sbdb.storage
      .from(BUCKET_NAME.WORKSPACES)
      .list(project_id, { limit: 10 });

    if (errStorage1) throw errStorage1;

    const filePaths = files.map((file) => project_id + '/' + file.name);

    const { error: errStorage } = await sbdb.storage.from(BUCKET_NAME.WORKSPACES).remove(filePaths);

    if (errStorage) throw errStorage;
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  const id = uuidv4();

  try {
    const { workspace_id } = req.body;
    const file = req.file;
    if (!file) {
      throw createHttpErr(ErrorKey.MISSING_KEY, 'Missing "file" key');
    }
    if (file.originalname.split('.').pop() !== 'docx') {
      throw createHttpErr(ErrorKey.BAD_REQUEST, 'File must be a docx file');
    }
    file.filename = file.originalname.split('.')[0];

    const docxPath = id + '/' + file.originalname;

    const { data: fileDocx, error: errorDocx } = await sbdb.storage
      .from(BUCKET_NAME.WORKSPACES)
      .upload(docxPath, file.buffer, {
        contentType: file.mimetype
      });
    if (errorDocx) throw errorDocx;

    const bufferPdf = await docxToPdf(req, file.buffer, file.originalname);

    const { data: filePdf, error: errorPdf } = await sbdb.storage
      .from(BUCKET_NAME.WORKSPACES)
      .upload(id + '/' + file.filename + '.pdf', bufferPdf, {
        contentType: 'application/pdf'
      });
    if (errorPdf) throw errorPdf;

    const file_path = {
      origin: fileDocx.path,
      preview: filePdf.path,
      originFullPath: fileDocx.fullPath,
      previewFullPath: filePdf.fullPath
    };

    const { data, error } = await sbdb.from('projects').insert({
      name: file.filename,
      workspace_id,
      size: file.size,
      mime_type: file.mimetype,
      file_path,
      id
    });

    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    await rollbackFileIfError(id, next);
    next(err);
  }
}

export async function getProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspace_id } = req.params;
    const { data, error } = await sbdb.from('projects').select('*').eq('workspace_id', workspace_id);
    if (error) throw error;
    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspace_id, project_id } = req.params;
    const { data, error } = await sbdb
      .from('projects')
      .select('*')
      .eq('workspace_id', workspace_id)
      .eq('id', project_id)
      .maybeSingle();

    if (error) throw error;

    if (data == null) {
      throw createHttpErr(ErrorKey.NOT_FOUND, 'Project not found');
    }

    res.json(createHttpSuccess(data));
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspace_id, project_id } = req.params;

    const { data: files, error: errStorage1 } = await sbdb.storage
      .from(BUCKET_NAME.WORKSPACES)
      .list(project_id, { limit: 10 });

    if (errStorage1) throw errStorage1;

    const filePaths = files.map((file) => project_id + '/' + file.name);
    console.log(filePaths);
    const { error: errStorage } = await sbdb.storage.from(BUCKET_NAME.WORKSPACES).remove(filePaths);

    if (errStorage) throw errStorage;

    const { error } = await sbdb.from('projects').delete().eq('workspace_id', workspace_id).eq('id', project_id);

    if (error) throw error;
    res.json(createHttpSuccess({ countFiles: filePaths.length, countProjects: 1 }));
  } catch (err) {
    next(err);
  }
}

export async function downloadProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspace_id, project_id } = req.params;
    const { options } = req.body;

    const { format, contentType } = options;
    let extension = '.docx',
      prefix = 'applied';
    if (format === 'pdf') {
      extension = '.pdf';
    }
    if (contentType === 'original') {
      prefix = '';
    }

    const { data, error } = await sbdb.storage
      .from(BUCKET_NAME.WORKSPACES)
      .download(project_id + '/' + prefix + extension);
    if (error) throw error;

    const buffer = Buffer.from(await data.arrayBuffer());

    const filename = project_id + '/' + prefix + extension;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}

export async function uploadFile1(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) {
      throw createHttpErr(ErrorKey.MISSING_KEY, 'Missing "file" key');
    }

    const bucket = BUCKET_NAME.WORKSPACES;
    const fileBase64 = decode(file.buffer.toString('base64'));

    const { error } = await sbdb.storage.from(bucket).upload(file.originalname, fileBase64, {
      contentType: file.mimetype
    });

    if (error) {
      throw error;
    }

    const { data: resData } = sbdb.storage.from(bucket).getPublicUrl(file.originalname);

    res.json(createHttpSuccess({ path: file.originalname, url: resData.publicUrl }));
  } catch (err) {
    next(err);
  }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { path } = req.body;
    const bucket = BUCKET_NAME.WORKSPACES;
    const { error } = await sbdb.storage.from(bucket).remove([path]);

    if (error) throw error;

    res.json(createHttpSuccess({ success: true }));
  } catch (err) {
    next(err);
  }
}

export async function updateFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { path } = req.body;
    const file = req.file;
    if (!file) {
      throw createHttpErr(ErrorKey.MISSING_KEY, 'Missing "file" key');
    }

    const bucket = BUCKET_NAME.WORKSPACES;
    const fileBase64 = decode(file.buffer.toString('base64'));
    const { error } = await sbdb.storage.from(bucket).update(path, fileBase64, {
      contentType: file.mimetype
    });

    if (error) throw error;

    res.json(createHttpSuccess({ success: true }));
  } catch (err) {
    next(err);
  }
}

export async function updateProjectName(req: Request, res: Response, next: NextFunction) {
  try {
    const { workspace_id, project_id } = req.params;
    const { name } = req.body;
    const { error } = await sbdb
      .from('projects')
      .update({ name })
      .eq('workspace_id', workspace_id)
      .eq('id', project_id);
    if (error) throw error;
    res.json(createHttpSuccess({ name, project_id }));
  } catch (err) {
    next(err);
  }
}
