export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Full-Stack' | 'Frontend' | 'Mobile & UI/UX' | 'Open Source';
  description: string;
  longDescription?: string;
  tags: string[];
  image: string;
  featured?: boolean;
  demoUrl?: string;
  githubUrl?: string;
  metrics?: { label: string; value: string }[];
  features?: string[];
}

export interface SkillCategory {
  name: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 0 to 100
    experience: string;
    icon?: string;
  }[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  type: 'Work' | 'Education' | 'Milestone';
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  deliverables: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}
