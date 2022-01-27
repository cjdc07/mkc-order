import { stringify } from 'query-string';

import HttpError from '../errors/HttpError';
// import { UserContext } from '../contexts/UserContext';

// eslint-disable-next-line no-undef
const apiUrl = process.env.REACT_APP_API_URL;

const useRequest = () => {
  // const { setUser } = React.useContext(UserContext);

  return ({
    getList: async (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page) * perPage, perPage]),
        filter: JSON.stringify(params.filter),
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        let message = error.error;
        let status = error.statusCode;

        if (status === 401) {
          localStorage.removeItem('access_token');
          // setUser(null);
        }

        if (status === 400) {
          message = error.message;
        }

        throw new HttpError(`${message} (${status})`, status);
      }

      return await response.json();
    },

    create: async (resource, data) => {
      const response = await fetch(`${apiUrl}/${resource}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        let message = error.error;
        let status = error.statusCode;

        if (status === 401) {
          localStorage.removeItem('access_token');
          // setUser(null);
        }

        if (status === 400) {
          message = error.message;
        }

        throw new HttpError(`${message} (${status})`, status);
      }

      return await response.json();
    },

    update: async (resource, data) => {
      const response = await fetch(`${apiUrl}/${resource}/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        let message = error.error;
        let status = error.statusCode;

        if (status === 401) {
          localStorage.removeItem('access_token');
          // setUser(null);
        }

        if (status === 400) {
          message = error.message;
        }

        throw new HttpError(`${message} (${status})`, status);
      }

      return await response.json();
    },

    deleteOne: async (resource, params) => {
      const response = await fetch(`${apiUrl}/${resource}/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        let message = error.error;
        let status = error.statusCode;

        if (status === 401) {
          localStorage.removeItem('access_token');
          // setUser(null);
        }

        if (status === 400) {
          message = error.message;
        }

        throw new HttpError(`${message} (${status})`, status);
      }
    },
  });
}

export default useRequest;
