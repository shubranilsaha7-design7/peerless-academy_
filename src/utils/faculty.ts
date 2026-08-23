export const FACULTY_DIRECTORY = {
  Biology: {
    name: 'Tanima Mam',
    phone: '919774353553',
  },
  Mathematics: {
    name: 'Prasenjit Sir',
    phone: '918794130855',
  },
  Maths: { // Alias for Mathematics
    name: 'Prasenjit Sir',
    phone: '918794130855',
  },
  Chemistry: {
    name: 'Dipjoy Sir',
    phone: '917005309301',
  },
  Physics: {
    name: 'Rahul Sir',
    phone: '917628887027',
  },
  Default: {
    name: 'Peerless Academy Support (Prasenjit Sir)',
    phone: '918794130855',
  },
};

export function getFacultyWhatsAppLink(subject?: string, message?: string) {
  let phone = FACULTY_DIRECTORY.Default.phone;
  if (subject && FACULTY_DIRECTORY[subject as keyof typeof FACULTY_DIRECTORY]) {
    phone = FACULTY_DIRECTORY[subject as keyof typeof FACULTY_DIRECTORY].phone;
  }
  
  const baseUrl = `https://wa.me/${phone}`;
  return message ? `${baseUrl}?text=${message}` : baseUrl;
}
