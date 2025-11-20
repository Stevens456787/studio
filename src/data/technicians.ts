export interface TechnicianRecentJob {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  date: string;
  summary: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  headline: string;
  expertise: string[];
  rating: number;
  availability: string;
  jobsCompleted: number;
  location: string;
  certifications: string[];
  coverageAreas: string[];
  recentJobs: TechnicianRecentJob[];
  bio: string;
}

export const technicians: TechnicianProfile[] = [
  {
    id: 'alice-kamau',
    name: 'Alice Kamau',
    headline: 'Lead HVAC & Cold Chain Specialist',
    expertise: ['HVAC Optimization', 'Cold Chain'],
    rating: 4.98,
    availability: 'Available Now',
    jobsCompleted: 214,
    location: 'Westlands, Nairobi',
    certifications: ['ASHRAE Certified HVAC Pro', 'Carrier Platinum Installer'],
    coverageAreas: ['Westlands', 'Parklands', 'Lavington'],
    recentJobs: [
      {
        id: 'JOB-3294',
        title: 'Supermarket Cold-Room Retrofit',
        status: 'completed',
        date: '2025-01-05',
        summary: 'Reduced energy draw by 18% after optimizing load balancing.',
      },
      {
        id: 'JOB-3278',
        title: 'Hospital ICU HVAC Emergency',
        status: 'completed',
        date: '2024-12-20',
        summary: 'Replaced failed compressor and restored redundancy within 4 hours.',
      },
    ],
    bio: 'Alice leads our HVAC crew focusing on uptime-critical facilities. She blends analytics with field experience to keep cooling systems efficient even in harsh conditions.',
  },
  {
    id: 'brian-otieno',
    name: 'Brian Otieno',
    headline: 'Commercial Electrical & Smart Panel Expert',
    expertise: ['Smart Panels', 'Commercial Electrical'],
    rating: 4.95,
    availability: 'In Field – 45 min',
    jobsCompleted: 188,
    location: 'Upper Hill, Nairobi',
    certifications: ['KEBS Licensed Electrician', 'Schneider EcoXpert'],
    coverageAreas: ['Upper Hill', 'CBD', 'Kilimani'],
    recentJobs: [
      {
        id: 'JOB-3251',
        title: 'Data Center ATS Upgrade',
        status: 'completed',
        date: '2024-12-08',
        summary: 'Installed dual smart ATS with predictive maintenance alerts.',
      },
    ],
    bio: 'Brian specializes in intelligent switchgear and high-uptime electrical systems for offices and data centers.',
  },
  {
    id: 'christine-wanjiku',
    name: 'Christine Wanjiku',
    headline: 'Plumbing & Water Harvesting Engineer',
    expertise: ['Premium Plumbing', 'Water Harvesting'],
    rating: 4.92,
    availability: 'Next Slot 2pm',
    jobsCompleted: 203,
    location: 'Nyali, Mombasa',
    certifications: ['NCA Level 2 Plumber', 'WRAS Approved Installer'],
    coverageAreas: ['Nyali', 'Mombasa CBD', 'Bamburi'],
    recentJobs: [
      {
        id: 'JOB-3242',
        title: 'Coastal Apartment Boosted System',
        status: 'completed',
        date: '2024-11-29',
        summary: 'Eliminated saltwater corrosion by re-piping with PEX-Al-PEX.',
      },
    ],
    bio: 'Christine brings a decade of coastal plumbing experience, preventing corrosion and ensuring water quality.',
  },
  {
    id: 'david-mwangi',
    name: 'David Mwangi',
    headline: 'Smart Home Mesh & Security Specialist',
    expertise: ['Smart Home Mesh', 'Security Systems'],
    rating: 4.97,
    availability: 'Available Now',
    jobsCompleted: 245,
    location: 'Kilimani, Nairobi',
    certifications: ['Ubiquiti Enterprise Wireless', 'Hikvision Certified Integrator'],
    coverageAreas: ['Kilimani', 'Kileleshwa', 'Karen'],
    recentJobs: [
      {
        id: 'JOB-3233',
        title: 'Townhouse Mesh Wi-Fi & CCTV',
        status: 'completed',
        date: '2024-12-14',
        summary: 'Deployed seamless roaming and 4K cameras with remote monitoring.',
      },
    ],
    bio: 'David designs smart homes that stay online and secure, balancing coverage with zero dead zones.',
  },
  {
    id: 'evelyn-achieng',
    name: 'Evelyn Achieng',
    headline: 'Appliance Rehab & Energy Auditor',
    expertise: ['Appliance Rehab', 'Energy Audits'],
    rating: 4.94,
    availability: 'Today – Evening',
    jobsCompleted: 176,
    location: 'Thika Road, Nairobi',
    certifications: ['EPA Refrigeration Tech', 'KPLC Energy Auditor'],
    coverageAreas: ['Thika Road', 'Ruiru', 'Garden Estate'],
    recentJobs: [
      {
        id: 'JOB-3221',
        title: 'Hotel Laundry Heat Pump Retrofit',
        status: 'completed',
        date: '2024-11-05',
        summary: 'Cut hot water costs by 30% with variable-speed heat pumps.',
      },
    ],
    bio: 'Evelyn restores mission-critical appliances and backs changes with measurable energy savings.',
  },
  {
    id: 'farid-hassan',
    name: 'Farid Hassan',
    headline: 'Solar Pumping & Rural Install Lead',
    expertise: ['Solar Pumping', 'Rural Install'],
    rating: 4.91,
    availability: 'On Call',
    jobsCompleted: 162,
    location: 'Diani, Kwale',
    certifications: ['GOGLA Solar Pumping Pro', 'NITA Certified Technician'],
    coverageAreas: ['Diani', 'Kwale', 'Ukunda'],
    recentJobs: [
      {
        id: 'JOB-3206',
        title: 'Community Solar Borehole',
        status: 'completed',
        date: '2024-10-18',
        summary: 'Installed 12kWp array with remote telemetry for a village borehole.',
      },
    ],
    bio: 'Farid focuses on resilient off-grid systems that deliver clean water and power to remote communities.',
  },
];
