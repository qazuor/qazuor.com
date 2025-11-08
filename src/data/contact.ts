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
    twitter: string;
    linkedin: string;
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
    twitter: 'https://twitter.com/qazuor',
    linkedin: 'https://linkedin.com/in/qazuor',
    instagram: undefined, // Add Instagram if available
    youtube: undefined, // Add YouTube if available
  },
};
