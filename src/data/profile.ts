/**
 * Profile Data
 * Personal information and contact details
 */

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  experience: string;
  email: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
}

export const profile: ProfileData = {
  name: 'qazuor',
  role: 'Full-Stack Developer',
  location: 'Remote',
  experience: '5+ years',
  email: 'hello@qazuor.com',
  social: {
    github: 'https://github.com/qazuor',
    twitter: 'https://twitter.com/qazuor',
    linkedin: 'https://linkedin.com/in/qazuor',
  },
};
