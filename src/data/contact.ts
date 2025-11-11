/**
 * Contact Data
 * Personal contact information and social media links
 */

export interface ContactData {
  email: string;
  phone?: string;
  location: string;
  address?: string;
  social: {
    github: string;
    linkedin: string;
    fiverr: string;
    upwork: string;
    instagram?: string;
    youtube?: string;
  };
}

export const contact: ContactData = {
  email: 'hello@qazuor.com',
  phone: undefined, // Add phone number if available
  location: 'Remote',
  address: undefined, // Add physical address if needed
  social: {
    github: 'https://github.com/qazuor',
    linkedin: 'https://linkedin.com/in/qazuor',
    fiverr: 'https://www.fiverr.com/sellers/leandroasrilevi/',
    upwork: 'https://www.upwork.com/freelancers/~01881c38344e9431d7',
    instagram: undefined, // Add Instagram if available
    youtube: undefined, // Add YouTube if available
  },
};
