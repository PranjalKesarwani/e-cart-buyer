export const getInitials = (fullName: string) => {
  if (!fullName) return '';
  const nameParts = fullName.trim().split(' ');

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
};
