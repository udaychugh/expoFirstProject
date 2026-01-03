// Helper function to calculate age from dateOfBirth
export const calculateAge = (
  dateOfBirth: string | undefined | null
): string => {
  if (!dateOfBirth) return '';

  const birthDate = new Date(dateOfBirth);

  // Check if date is valid
  if (isNaN(birthDate.getTime())) {
    return '';
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred this year yet
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (isNaN(age)) {
    return '';
  }

  return age.toString();
};
