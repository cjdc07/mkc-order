// eslint-disable-next-line no-undef
const apiUrl = process.env.REACT_APP_API_URL;

const useAuth = () => ({
  login: async (data) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const { message, statusCode } = await response.json();
      if (statusCode === 401) {
        throw new Error(`Invalid username or password.`);
      }
      throw new Error(`An error occured: ${message} (${statusCode})`);
    }

    return await response.json();
  },
  check: async () => {
    const response = await fetch(`${apiUrl}/auth/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      const { message, statusCode } = await response.json();
      throw new Error(`An error occured: ${message} (${statusCode})`);
    }

    return await response.json();
  },
});

export default useAuth;
