import {
  SocialIcon,
  MenuItem,
  StatusButton,
  CheckStatus,
  CheckStatusList,
  NotificationPayload
} from "./interfaces/interfaces";

export const SOCIALMEDIA: SocialIcon[] = [
  { name: 'github', color: 'basic' },
  { name: 'twitter', color: 'info' },
  { name: 'portfolio', color: 'success' }
];

export const MENUITEMS: MenuItem[] = [
  { name: 'Home', link: '/home', icon: 'home-outline' },
  { name: 'Noticias', link: './news', icon: 'cast-outline' },
  { name: 'Artículos', link: './articles', icon: 'file-text-outline' },
  { name: 'Escritores', link: './writers', icon: 'edit-2-outline' },
  { name: 'Ayuda', link: './help', icon: 'question-mark-circle-outline' }
];

export const CATEGORIES: string[] = [
  'HTML',
  'CSS',
  'Javascript',
  'Angular',
  'Nodejs',
  'MongoDB',
  'Android',
  'Design',
  'GO',
  'Python',
  'Git',
  'Antic\'s',
  'Deno',
  'PHP'
];

export const LANGUAGES: string[] = [
  'HTML',
  'CSS',
  'SCSS',
  'Javascript',
  'Typescript',
  'Nodejs',
  'JSON',
  'Terminal',
  'Android',
  'Kotlin',
  'GO',
  'Python',
  'PHP'
];

export const TAGS: string[] = [
  'Consola',
  'Desarrollo',
  'Diseño',
  'Material',
  'Frontend',
  'Backend',
  'Typescript',
  'Database',
  'Mobile',
  'Ionic',
  'Config',
  'Git',
  'Antic\'s'
];

export const LEVELS: string[] = [
  'LEVEL.BASIC',
  'LEVEL.MEDIUM',
  'LEVEL.ADVANCED'
];

export const BADGES: string[] = [
  'BADGE.NEW',
  'BADGE.PRO',
  'BADGE.HOT'
];

export const STATUSBUTTONS: StatusButton[] = [
  { status: 'warning', name: 'Draft' },
  { status: 'danger', name: 'Pending' },
  { status: 'info', name: 'Hidden' },
  { status: 'success', name: 'Approved' },
  { status: 'basic', name: 'All' }
];

export const CHECKSTATUS: CheckStatusList[] = [
  {
    name: 'Título',
    hint: 'Título claro y conciso.',
    icon: 'hash-outline'
  },
  {
    name: 'Categoría',
    hint: 'Categoría acorde al tema.',
    icon: 'folder-outline'
  },
  {
    name: 'Etiquetas',
    hint: 'Etiquetas acordes al mensaje.',
    icon: 'pricetags-outline'
  },
  {
    name: 'Estado',
    hint: 'Estado acorde al Artículo.',
    icon: 'flag-outline'
  },
  {
    name: 'Nivel',
    hint: 'Nivel acorde a lo enseñado.',
    icon: 'bar-chart-outline'
  },
  {
    name: 'Enlaces',
    hint: 'Enlaces y formato correctos.',
    icon: 'link-outline'
  },
  {
    name:'Formato',
    hint: 'Formato de la imagen correcto.',
    icon: 'image-outline'
  },
  {
    name: 'Introducción',
    hint: 'Introducción cumple los requisitos.',
    icon: 'file-text-outline'
  },
  {
    name: 'Mensaje',
    hint: 'Mensaje cumple todos los requisitos',
    icon: 'file-outline'
  }
];

export const PUBLISH_PUSH: NotificationPayload = {
  body: 'Nuevo Artículo Publicado',
  requireInteraction: true,
  actions: [
    { action: 'explore', title: 'Ver Artículo' }
  ],
  broadcast: true,
  data: {}
};


