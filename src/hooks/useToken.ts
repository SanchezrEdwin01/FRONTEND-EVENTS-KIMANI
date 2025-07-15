export const useToken = (): any => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  return token;
}