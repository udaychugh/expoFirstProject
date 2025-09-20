export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

export const validateAge = (dateOfBirth: string): { isValid: boolean; age?: number; message?: string } => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  
  if (isNaN(dob.getTime())) {
    return { isValid: false, message: 'Invalid date format' };
  }
  
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return { isValid: false, message: 'Invalid date' };
  }
  
  if (age < 18) {
    return { isValid: false, message: 'You must be at least 18 years old' };
  }
  
  if (age > 100) {
    return { isValid: false, message: 'Please enter a valid date of birth' };
  }
  
  return { isValid: true, age };
};