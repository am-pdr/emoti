import { ChangeDetectionStrategy, Component, signal, computed, effect, afterNextRender, ElementRef, inject } from '@angular/core';
import { Milestone, MilestoneStatus } from './models/milestone.model';

interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AppComponent {
  private elementRef = inject(ElementRef);
  
  // === STATE MANAGEMENT ===
  isMenuOpen = signal(false);
  theme = signal<'light' | 'dark'>('light');
  milestoneFilter = signal<MilestoneStatus | 'All'>('All');
  activeFaq = signal<number | null>(null);

  constructor() {
    afterNextRender(() => {
      // Initialize theme based on localStorage or system preference
      const storedTheme = localStorage.getItem('emoti-theme') as 'light' | 'dark';
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(storedTheme || (prefersDark ? 'dark' : 'light'));

      // Setup scroll animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold: 0.1 });

      const elementsToAnimate = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');
      elementsToAnimate.forEach((el: Element) => observer.observe(el));
    });

    // Effect to update DOM and localStorage when theme changes
    effect(() => {
      const currentTheme = this.theme();
      document.documentElement.setAttribute('data-theme', currentTheme);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('emoti-theme', currentTheme);
      }
    });
  }

  baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';

  // === DATA ===
  readonly navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Misiune', href: '#misiune' },
    { name: 'Echipă', href: '#echipa' },
    { name: 'Milestones', href: '#milestones' },
    { name: 'Funcționalități', href: '#functionalitati' },
    { name: 'Demo', href: '#demo' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' }
  ];

  readonly team: TeamMember[] = [
    { name: 'Ilinca Struțu', role: 'Manager', avatarUrl: 'https://media.licdn.com/dms/image/v2/C5603AQEbo_-IvVCqVQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1640824250155?e=1762992000&v=beta&t=KpVTp0jevaWGAjLfkPiAMXVZzfIVtHru6I3kvhUK3fk' },
    { name: 'Valentina Băluță', role: 'Backend Dev', avatarUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQFtrSOLcCTRUg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1646249671951?e=1762992000&v=beta&t=yRVu_dUqJR4T0P7JeDBJS8NSKtZMPwGFmLyu2K974YA' },
    { name: 'Anna-Mariia Peduraru', role: 'Frontend Dev', avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQElEf_z1Jhbfg/profile-displayphoto-shrink_100_100/B4DZORItNEHUAY-/0/1733306799490?e=1762992000&v=beta&t=WqqhYDmjIG4XTUqrhChQqi14ORW4w0oRk0RxbEe8CQQ' },
    { name: 'Maria-Cristina Costea', role: 'PR & HR', avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGnHdUIp-Dr_Q/profile-displayphoto-crop_800_800/B4DZfLdupjGgAI-/0/1751465259704?e=1762992000&v=beta&t=nACG0rRMwa2u7IhEaPNckr-M8RJuAtLmQMz6gwz94UE" alt="Portret Maria-Cristina Costea' },
    { name: 'Andreea Budulan', role: 'Financial', avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGQOO4XseWeMA/profile-displayphoto-shrink_400_400/B4DZZepxFlHwAk-/0/1745344729972?e=1762992000&v=beta&t=T2BOkhPcib1lJ0AmfUP30j1N33BL_NKGwUk0UAeWxN4' }
  ];

  readonly milestones: Milestone[] = [
      { id: 1, title: "Viziune & Brand", status: "Done",    percent: 100, date: "2025-01-15",
        bullets: ["Naming, logo, paletă culori", "Principii UX", "Tone of voice"] },
      { id: 2, title: "Research & Personas", status: "Done", percent: 100, date: "2025-02-05",
        bullets: ["Interviuri utilizatori", "Mapare pain points", "Backlog inițial"] },
      { id: 3, title: "MVP Scope", status: "Done", percent: 100, date: "2025-02-20",
        bullets: ["User stories", "Acceptance criteria", "Roadmap"] },
      { id: 4, title: "Habit Tracker v1", status: "In Progress", percent: 60, date: "2025-03-20",
        bullets: ["Obiceiuri zilnice", "Streak counter", "Remindere"] },
      { id: 5, title: "Journal v1", status: "In Progress", percent: 45, date: "2025-04-10",
        bullets: ["Note zilnice", "Mood tags", "Search"] },
      { id: 6, title: "Analytics & Insights", status: "Upcoming", percent: 0, date: "2025-05-05",
        bullets: ["Grafice", "Corelații obiceiuri-stare", "Export CSV/PDF"] },
      { id: 7, title: "Therapist Portal (Beta)", status: "Upcoming", percent: 0, date: "2025-05-30",
        bullets: ["Share entries", "Feedback secure", "Permissions"] },
      { id: 8, title: "Mobile PWA", status: "Upcoming", percent: 0, date: "2025-06-20",
        bullets: ["Install prompt", "Offline mode", "Sync"] },
      { id: 9, title: "Security & Privacy", status: "Upcoming", percent: 0, date: "2025-07-05",
        bullets: ["Encryption at rest", "DPO checklist", "Consent flows"] },
      { id:10, title: "Public Beta", status: "Upcoming", percent: 0, date: "2025-07-30",
        bullets: ["Waitlist", "Feedback loop", "Bug triage"] },
      { id:11, title: "Release v1.0", status: "Upcoming", percent: 0, date: "2025-08-20",
        bullets: ["Changelog", "Docs finale", "Press kit"] }
  ];
  
  readonly filteredMilestones = computed(() => {
    const filter = this.milestoneFilter();
    if (filter === 'All') return this.milestones;
    return this.milestones.filter(m => m.status === filter);
  });

  readonly features: Feature[] = [
    { icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />`, title: 'Habit Streaks', description: 'Monitorizează-ți progresul și construiește obiceiuri durabile.' },
    { icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />`, title: 'Jurnal Zilnic', description: 'Reflectează asupra zilei, atașează emoții și înțelege-te mai bine.' },
    { icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-2-3l2 3m-4.5-3l-1-1.5m1 1.5l1-1.5m-1.5 0l-1.5-2.25m-1.5 4.5l1.5-2.25m1.5 2.25l1.5 2.25" />`, title: 'Statistici & Insights', description: 'Vizualizează corelații între obiceiuri, emoții și productivitate.' },
    { icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />`, title: 'Remindere Smart', description: 'Setează notificări inteligente pentru a nu uita de obiectivele tale.' },
    { icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />`, title: 'Export PDF', description: 'Descarcă jurnalul și statisticile pentru a le partaja sau arhiva.' },
    { icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />`, title: 'Privacy-by-Design', description: 'Datele tale sunt criptate și accesibile doar ție. Confidențialitate totală.' }
  ];

  readonly faqs: FaqItem[] = [
    { question: 'Ce este EMOTI?', answer: 'EMOTI este o aplicație mobilă de tip jurnal și monitorizare a obiceiurilor, concepută pentru a te ajuta să îți îmbunătățești starea de bine emoțională și să construiești o viață mai echilibrată.' },
    { question: 'Cum funcționează?', answer: 'Prin înregistrarea zilnică a stărilor, gândurilor și activităților, aplicația generează statistici personalizate care te ajută să identifici tipare și corelații între obiceiurile tale și starea ta emoțională.' },
    { question: 'Este aplicația gratuită?', answer: 'EMOTI este o aplicație fremium. Funcționalități avansate, precum analize detaliate sau exporturi, ar putea fi disponibile într-o versiune premium în viitor.' },
    { question: 'Datele mele sunt în siguranță?', answer: 'Absolut. Confidențialitatea este prioritatea noastră. Toate datele sunt criptate și stocate în siguranță. Doar tu ai acces la informațiile tale.' },
    { question: 'Pe ce platforme va fi disponibilă?', answer: 'Plănuim lansarea inițială pe iOS și Android. De asemenea, explorăm posibilitatea unei versiuni PWA (Progressive Web App) pentru acces de pe orice dispozitiv.' },
    { question: 'Pot partaja datele cu terapeutul meu?', answer: 'Da, una dintre funcționalitățile planificate este un portal securizat prin care poți alege să partajezi anumite intrări sau rapoarte cu terapeutul tău, facilitând un dialog mai informat.' },
    { question: 'Când va fi lansată aplicația?', answer: 'Suntem în plin proces de dezvoltare. Urmărește secțiunea de Milestones pentru a vedea progresul nostru. Estimăm o versiune beta publică în vara anului 2025.' },
    { question: 'Cum pot oferi feedback sau sugestii?', answer: 'Ne-ar plăcea să auzim părerile tale! Poți folosi adresa de e-mail din secțiunea de contact pentru a ne trimite idei sau pentru a te înscrie pe lista de așteptare pentru beta testing.' }
  ];

  // === METHODS ===
  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  setMilestoneFilter(filter: MilestoneStatus | 'All'): void {
    this.milestoneFilter.set(filter);
  }

  toggleFaq(index: number): void {
    this.activeFaq.update(current => (current === index ? null : index));
  }

  getStatusClasses(status: MilestoneStatus): string {
    switch (status) {
      case 'Done': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Upcoming': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return '';
    }
  }
}
