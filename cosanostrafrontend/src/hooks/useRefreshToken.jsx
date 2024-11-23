import useAuth from './useAuth';
import axios from '../api/axiosInstance';


const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post('/refresh', {
    });
    setAuth(prev => {
      console.log(JSON.stringify(prev));
      console.log(response.data.token);
      return { ...prev, token: response.data.token }
    });

    return response.data.token;
  }

  return refresh;
};

export default useRefreshToken;