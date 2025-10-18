import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { DEFAULT_PAGINATION } from '~/config';
import { BUCKET_NAME } from '~/constants';
import { sbdb } from '~/lib/supabase';
import { ErrorKey } from '~/types/http';
import { createHttpErr, createHttpSuccess } from '~/utils/createHttpResponse';

export const edudocTest = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

// #region Document APIs
export const getListDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = DEFAULT_PAGINATION.page,
      pageSize = DEFAULT_PAGINATION.pageSize,
      keyword = '',
      orderBy = 'newest',
      user = 'me'
    } = req.query;
    const query = sbdb
      .schema('edudoc')
      .from('documents')
      .select('*')
      .eq('in_trash', false)
      .ilike('name', `%${keyword}%`);

    if (orderBy === 'newest') {
      query.order('created_at', { ascending: false });
    }

    if (user === 'me') {
      query.eq('uploaded_by', req.user_id!);
    }

    const { data, error } = await query;

    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    const documents = await Promise.all(
      data.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize)).map(async (document) => {
        const { data: voteData } = await sbdb
          .schema('edudoc')
          .from('documents_votes')
          .select('*')
          .eq('document_id', document.id);

        const { data: downloadData } = await sbdb
          .schema('edudoc')
          .from('document_downloads')
          .select('*')
          .eq('document_id', document.id);

        const { data: authorData } = await sbdb
          .from('profiles')
          .select('*')
          .eq('id', document.uploaded_by)
          .maybeSingle();

        const countInfo = {
          view: 1111,
          upvote: voteData?.filter((vote) => vote.vote_type == 1).length || 0,
          downvote: voteData?.filter((vote) => vote.vote_type == -1).length || 0,
          download: downloadData?.length || 0
        };

        const moreInfo = {
          hasUpVote: voteData?.some((vote) => vote.vote_type == 1 && vote.user_id == req?.user_id),
          hasDownVote: voteData?.some((vote) => vote.vote_type == -1 && vote.user_id == req?.user_id),
          hasDownloaded: downloadData?.some((download) => download.user_id == req?.user_id)
        };

        return { ...document, authorInfo: authorData, countInfo, moreInfo };
      })
    );

    const responseData = {
      results: documents,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total: data.length
      }
    };
    res.status(200).json(createHttpSuccess(responseData));
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb.schema('edudoc').from('documents').select('*').eq('id', id).maybeSingle();
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    if (!data) throw createHttpErr(ErrorKey.NOT_FOUND, 'Document not found');
    const { data: voteData } = await sbdb.schema('edudoc').from('documents_votes').select('*').eq('document_id', id);
    const { data: downloadData } = await sbdb
      .schema('edudoc')
      .from('document_downloads')
      .select('*')
      .eq('document_id', id);

    const countInfo = {
      view: 1111,
      upvote: voteData?.filter((vote) => vote.vote_type == 1).length || 0,
      downvote: voteData?.filter((vote) => vote.vote_type == -1).length || 0,
      download: downloadData?.length || 0
    };

    const moreInfo = {
      hasUpVote: voteData?.some((vote) => vote.vote_type == 1 && vote.user_id == req?.user_id),
      hasDownVote: voteData?.some((vote) => vote.vote_type == -1 && vote.user_id == req?.user_id),
      hasDownloaded: downloadData?.some((download) => download.user_id == req?.user_id)
    };

    const { data: authorData } = await sbdb.from('profiles').select('*').eq('id', data.uploaded_by).maybeSingle();

    const documentInfo = { ...data, authorInfo: authorData, countInfo, moreInfo };
    res.status(200).json(createHttpSuccess(documentInfo));
  } catch (error) {
    next(error);
  }
};

export const createDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      throw createHttpErr(ErrorKey.MISSING_KEY, 'Missing "file" key');
    }

    const ext = path.extname(file.originalname);
    const user_id = req.user_id ?? '';
    const bucket = BUCKET_NAME.EDUDOC_DOCUMENTS;

    const filePath = user_id + '/' + file.originalname;
    const { data: fileData, error: fileError } = await sbdb.storage.from(bucket).upload(filePath, file.buffer, {
      contentType: file.mimetype
    });
    if (fileError) throw createHttpErr(ErrorKey.DB_ERROR, fileError.message);

    const documentData = JSON.parse(req.body.data);

    const { data, error } = await sbdb
      .schema('edudoc')
      .from('documents')
      .insert({
        ...documentData,
        uploaded_by: user_id,
        file_url: fileData.fullPath,
        file_size: file.size,
        file_type: ext.replace('.', '')
      });
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.status(200).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const deleteDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb.schema('edudoc').from('documents').delete().eq('id', id);
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    res.status(200).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const putDocumentInTrash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb.schema('edudoc').from('documents').update({ in_trash: true }).eq('id', id);
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    res.status(200).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const updateDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb.schema('edudoc').from('documents').update(req.body).eq('id', id);
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.status(200).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const getDocumentInTrash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = DEFAULT_PAGINATION.page, pageSize = DEFAULT_PAGINATION.pageSize, keyword = '' } = req.query;
    const { data, error } = await sbdb
      .schema('edudoc')
      .from('documents')
      .select('*')
      .eq('in_trash', true)
      .like('name', `%${keyword}%`);
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    const documents = await Promise.all(
      data.slice((Number(page) - 1) * Number(pageSize), Number(page) * Number(pageSize)).map(async (document) => {
        const { data: authorData } = await sbdb
          .from('profiles')
          .select('*')
          .eq('id', document.uploaded_by)
          .maybeSingle();

        return { ...document, authorInfo: authorData };
      })
    );
    const responseData = {
      results: documents,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total: data.length
      }
    };
    res.status(200).json(createHttpSuccess(responseData));
  } catch (error) {
    next(error);
  }
};
// #endregion

// #region Folders APIs
export const getListFolders = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

export const getFolderById = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

export const createFolder = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

export const deleteFolderById = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

export const updateFolderById = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

// #endregion

// #region Document Votes APIs

export const voteDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb
      .schema('edudoc')
      .from('documents_votes')
      .upsert(
        {
          user_id: req?.user_id ?? '',
          document_id: id,
          vote_type: 1
        },
        {
          onConflict: 'user_id,document_id'
        }
      );
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.status(200).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const downVoteDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb
      .schema('edudoc')
      .from('documents_votes')
      .upsert(
        {
          user_id: req?.user_id ?? '',
          document_id: id,
          vote_type: -1
        },
        {
          onConflict: 'user_id,document_id'
        }
      );
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.status(200).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};
// #endregion

// #region Document Download APIs
export const downloadDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await sbdb
      .schema('edudoc')
      .from('document_downloads')
      .upsert(
        {
          document_id: id,
          user_id: req?.user_id ?? ''
        },
        {
          onConflict: 'document_id,user_id'
        }
      );
    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);
    res.status(200).json(createHttpSuccess(data));
  } catch (error) {
    next(error);
  }
};
// #endregion

// #region Document User Bage

export const getDocumentUserBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user_id!;
    const { data, error } = await sbdb.schema('edudoc').from('user_badges').select('*').eq('user_id', user_id);

    if (error) throw createHttpErr(ErrorKey.DB_ERROR, error.message);

    const badges = await Promise.all(
      data
        .filter((badge) => badge.badge_id != null)
        .map(async (badge) => {
          const { data: badgeData } = await sbdb
            .schema('edudoc')
            .from('badges')
            .select('*')
            .eq('id', badge.badge_id!)
            .maybeSingle();

          return { user_id, earned_at: badge.earned_at, ...(badgeData ?? {}) };
        })
    );
    res.status(200).json(createHttpSuccess(badges));
  } catch (error) {
    next(error);
  }
};

// #endregion
