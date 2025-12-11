/**
 * Contact Data
 * Personal contact information and social media links
 */

export interface ContactData {
    email: string;
    phone: string;
    location: string;
    address?: string;
    social: {
        github: string;
        linkedin: string;
        fiverr: string;
        upwork: string;
        whatsapp: string;
        mail: string;
        buymeacoffee: string;
        discord: string;
        x: string;
    };
}

export const contact: ContactData = {
    email: 'hello@qazuor.com',
    phone: '+54 3442 453797',
    location: 'Concepción del Uruguay, Entre Ríos, Argentina',
    address: 'Ruta 39 km 142, Lote 19, Concepcion del Uruguay, Entre Ríos, Argentina',
    social: {
        github: 'https://github.com/qazuor',
        linkedin: 'https://linkedin.com/in/qazuor',
        fiverr: 'https://www.fiverr.com/sellers/leandroasrilevi/',
        upwork: 'https://www.upwork.com/freelancers/~01881c38344e9431d7',
        whatsapp: 'https://wa.me/543442453797',
        mail: 'mailto:hello@qazuor.com',
        buymeacoffee: 'https://buymeacoffee.com/qazuor',
        discord: 'https://discord.com/users/799697279854051369',
        x: 'https://x.com/qazuor'
    }
};
