import { persistentAtom } from '@nanostores/persistent';

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
};

export type WorkExperience = {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrentJob: boolean;
  responsibilities: string[];
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  maxGpa: string;
  relevantCoursework: string[];
};

export type Skills = {
  programmingLanguages: string[];
  frameworksAndLibraries: string[];
  tools: string[];
  databases: string[];
  testing: string[];
  others: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl: string;
};

export type Project = {
  name: string;
  description: string;
  techStack: string[];
  highlights: string[];
  url: string;
};

export type Language = {
  language: string;
  proficiency: string;
};

export type OrganizationExperience = {
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type VolunteerExperience = {
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Reference = {
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
};

export type CVData = {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  organizationExperience: OrganizationExperience[];
  volunteerExperience: VolunteerExperience[];
  references: Reference[];
};

const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: {
    programmingLanguages: [],
    frameworksAndLibraries: [],
    tools: [],
    databases: [],
    testing: [],
    others: [],
  },
  certifications: [],
  projects: [],
  languages: [],
  organizationExperience: [],
  volunteerExperience: [],
  references: [],
};

// Inisialisasi persistent atom dengan encoder & decoder untuk JSON storage
export const cvStore = persistentAtom<CVData>(
  'cv-data',
  defaultCVData,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// Helper functions for easy updates
export function updatePersonalInfo(data: Partial<PersonalInfo>) {
  const current = cvStore.get();
  cvStore.set({
    ...current,
    personalInfo: { ...current.personalInfo, ...data }
  });
}

// Helper untuk memperbarui field spesifik, misal workExperience, education, dsb
export function updateCVSection<K extends keyof CVData>(
  section: K,
  data: CVData[K]
) {
  const current = cvStore.get();
  cvStore.set({
    ...current,
    [section]: data
  });
}

// Helper untuk menambahkan item ke array section
type ArraySections = {
  [K in keyof CVData]: CVData[K] extends unknown[] ? K : never
}[keyof CVData];

export function addToSection<K extends ArraySections>(
  section: K,
  item: CVData[K] extends (infer U)[] ? U : never
) {
  const current = cvStore.get();
  const arr = current[section] as unknown[];
  cvStore.set({
    ...current,
    [section]: [...arr, item]
  });
}

export function removeFromSection<K extends ArraySections>(
  section: K,
  index: number
) {
  const current = cvStore.get();
  const arr = current[section] as unknown[];
  cvStore.set({
    ...current,
    [section]: arr.filter((_, i) => i !== index)
  });
}

// Helper untuk mengupdate skills (karena skills bukan array, melainkan objek)
export function updateSkills(data: Partial<Skills>) {
  const current = cvStore.get();
  cvStore.set({
    ...current,
    skills: { ...current.skills, ...data }
  });
}

// ===== CV Style Customization =====
export type CVStyle = {
  fontFamily: string;
};

export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Times New Roman', value: "'Times New Roman', Georgia, serif" },
  { label: 'Helvetica', value: "Helvetica, Arial, sans-serif" },
];

const defaultCVStyle: CVStyle = {
  fontFamily: FONT_OPTIONS[0].value,
};

export const cvStyleStore = persistentAtom<CVStyle>(
  'cv-style',
  defaultCVStyle,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export function updateCVStyle(data: Partial<CVStyle>) {
  const current = cvStyleStore.get();
  cvStyleStore.set({ ...current, ...data });
}
