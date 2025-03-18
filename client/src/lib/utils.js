// Utility functions for the application
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
