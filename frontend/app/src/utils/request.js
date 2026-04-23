import { getCookie } from './cookie';

const API_DOMAIN = process.env.REACT_APP_API_URL;

const request = async (path, options = {}) => {
  const token = getCookie('accessToken');

  const headers = {
    'Accept': 'application/json',
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(API_DOMAIN + path, {
    ...options,
    headers,
  });

  // Tự động redirect khi token hết hạn hoặc không hợp lệ
  if (response.status === 401 && !path.includes('auth/login')) {
    window.location.href = '/admin/login';
  }

  const result = await response.json();
  return result;
};

export const get = (path) => request(path, { 
  method: 'GET' 
});

export const post = (path, data) => request(path, { 
  method: 'POST', 
  body: JSON.stringify(data) 
});

export const postForm = (path, formData) => request(path, { 
  method: 'POST', 
  body: formData 
});

export const patch = (path, data) => request(path, { 
  method: 'PATCH', 
  body: JSON.stringify(data) 
});

export const patchForm = (path, formData) => request(path, { 
  method: 'PATCH', 
  body: formData 
});

export const del = (path) => request(path, { 
  method: 'DELETE' 
});