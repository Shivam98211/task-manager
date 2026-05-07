const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Email is required";
  }

  if (!emailPattern.test(email.trim())) {
    return "Enter a valid email address";
  }

  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return "";
};

export const validateName = (name) => {
  if (!name.trim()) {
    return "Name is required";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  return "";
};
