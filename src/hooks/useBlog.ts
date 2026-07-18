import { useContext } from 'react';
import { BlogContext } from '../contexts/blog.context';

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog debe ser utilizado dentro de un BlogProvider');
  }
  return context;
};
