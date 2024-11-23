import useAuth from './useAuth';

const apiUrl = process.env.REACT_APP_API;

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await fetch(`${apiUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    setAuth(prev => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken }
    });

    return response.data.accessToken;
  }

  return refresh;
};

export default useRefreshToken;