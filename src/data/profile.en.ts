export const profileCode = `const developer = {
  nickName: 'qazuor',
  fullNameL: 'Leandro Asrilevich',
  birthDate: new Date(1980, 2, 27) // March 27, 1980
  role: 'Full-Stack Developer',
  location: 'Entre Rios, Argentina',
  experience: '20+ years',
  email: 'hello@qazuor.com',
  availability: 'Open to opportunities, Remote work preferred',
  hardWorker: true,
  quickLearning: true,
  problemSolver: true,
  preferredLanguages: LANGUAGES.SPANISH,
  hireable: function() {
    return this.hardWorker&&
    this.problemSolver&&
    this.skills.length>=5 &&
    this.availability === 'Open to opportunities, Remote work preferred';
},
  connect: function() {
    return "Let's build something amazing together!";
  }
};`;

export const profileTitle = 'developer.js';
