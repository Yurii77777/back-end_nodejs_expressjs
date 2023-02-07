export const handleResponse = (res: any, status: number, message: string, data?: any, error?: any) => {
  return res.status(status || 500).json({ status, message, data, error });
};
