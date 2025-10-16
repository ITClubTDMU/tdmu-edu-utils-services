import { Request, Response } from 'express';

export const edudocTest = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

// #region Document APIs
export const getListDocuments = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

export const getDocumentById = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

export const createDocument = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

export const deleteDocumentById = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
};

export const updateDocumentById = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' });
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


