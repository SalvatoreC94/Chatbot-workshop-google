export interface FreelancerProfile {
  name: string;
  role: string;
  calendlyUrl: string;
  whatsappNumber: string;
  whatsappPrefilledMessage: string;
}

export const FREELANCER_PROFILE: FreelancerProfile = {
  name: 'Salvatore Cozzolino',
  role: 'Sviluppatore fullstack freelance (specializzato frontend)',
  calendlyUrl: 'https://calendly.com/TUO-LINK/30min',
  whatsappNumber: '39XXXXXXXXXX',
  whatsappPrefilledMessage:
    'Ciao Salvatore, ho visto il tuo sito e vorrei parlarti di un progetto.',
};

export const QUICK_SUGGESTIONS = [
  { label: 'Che servizi offri?', query: 'Che servizi offri?' },
  { label: 'Quanto costa un progetto?', query: 'Quanto costa un progetto?' },
  { label: 'Che tecnologie usi?', query: 'Che tecnologie usi?' },
  { label: 'Parliamone', query: 'Ok mi interessa, come faccio a parlarti?' },
];
