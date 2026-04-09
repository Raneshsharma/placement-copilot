import { PrismaClient, LocationType, JobSource } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding job listings...');

  const jobs = [
    {
      title: 'Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      locationType: LocationType.HYBRID,
      salaryMin: 150000,
      salaryMax: 250000,
      currency: 'USD',
      description: 'Join Google\'s engineering team to build next-generation products that impact billions of users worldwide. You will work on scalable distributed systems, design and implement new features, and collaborate with cross-functional teams.',
      requirements: JSON.stringify(['Python', 'Java', 'System Design', 'Distributed Systems', 'SQL', 'Algorithms']),
      benefits: JSON.stringify(['Health Insurance', 'Stock Options', '401k', 'Remote Work Allowance', 'Meal Service']),
      keywords: JSON.stringify(['software engineer', 'backend', 'google', 'distributed systems', 'python', 'java']),
      source: JobSource.LINKEDIN,
      sourceUrl: 'https://linkedin.com/jobs/view/google-swe',
      applyUrl: 'https://careers.google.com/jobs/software-engineer',
      postedAt: new Date('2024-01-15'),
    },
    {
      title: 'Product Manager',
      company: 'Stripe',
      location: 'San Francisco, CA',
      locationType: LocationType.REMOTE,
      salaryMin: 180000,
      salaryMax: 280000,
      currency: 'USD',
      description: 'Stripe is looking for a Product Manager to help define and build the future of internet commerce. You will work closely with engineering, design, and business teams to ship products that empower millions of businesses.',
      requirements: JSON.stringify(['Product Strategy', 'Data Analysis', 'SQL', 'Cross-functional Leadership', 'Roadmapping', 'User Research']),
      benefits: JSON.stringify(['Health Insurance', 'Equity', 'Remote Work', 'Learning Budget', 'Wellness Stipend']),
      keywords: JSON.stringify(['product manager', 'stripe', 'fintech', 'product strategy', 'sql', 'data analysis']),
      source: JobSource.INDEED,
      sourceUrl: 'https://indeed.com/view/stripe-pm',
      applyUrl: 'https://stripe.com/jobs/product-manager',
      postedAt: new Date('2024-01-20'),
    },
    {
      title: 'Data Analyst',
      company: 'Notion',
      location: 'New York, NY',
      locationType: LocationType.HYBRID,
      salaryMin: 110000,
      salaryMax: 160000,
      currency: 'USD',
      description: 'Notion is hiring a Data Analyst to help us understand how millions of people use our product. You will build dashboards, run experiments, and surface insights that drive product decisions.',
      requirements: JSON.stringify(['SQL', 'Python', 'Tableau', 'A/B Testing', 'Statistical Analysis', 'Data Visualization']),
      benefits: JSON.stringify(['Health Insurance', 'Equity', 'Flexible Hours', 'Home Office Budget', 'Conference Budget']),
      keywords: JSON.stringify(['data analyst', 'notion', 'sql', 'python', 'tableau', 'statistics']),
      source: JobSource.INTERNAL,
      sourceUrl: null,
      applyUrl: 'https://notion.so/jobs/data-analyst',
      postedAt: new Date('2024-02-01'),
    },
    {
      title: 'UX Designer',
      company: 'Figma',
      location: 'San Francisco, CA',
      locationType: LocationType.REMOTE,
      salaryMin: 140000,
      salaryMax: 210000,
      currency: 'USD',
      description: 'Figma is looking for a UX Designer to shape the future of collaborative design tools. You will conduct user research, create wireframes and prototypes, and work with engineering to ship delightful experiences.',
      requirements: JSON.stringify(['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility']),
      benefits: JSON.stringify(['Health Insurance', 'Equity', 'Fully Remote', 'Design Tool Budget', 'Conference Attendance']),
      keywords: JSON.stringify(['ux designer', 'figma', 'user research', 'wireframing', 'prototyping', 'design systems']),
      source: JobSource.LINKEDIN,
      sourceUrl: 'https://linkedin.com/jobs/view/figma-ux',
      applyUrl: 'https://figma.com/careers/ux-designer',
      postedAt: new Date('2024-02-10'),
    },
    {
      title: 'Marketing Associate',
      company: 'HubSpot',
      location: 'Boston, MA',
      locationType: LocationType.ONSITE,
      salaryMin: 65000,
      salaryMax: 95000,
      currency: 'USD',
      description: 'HubSpot is looking for a Marketing Associate to join our growth team. You will manage campaigns, analyze performance metrics, create content, and help scale our inbound marketing engine.',
      requirements: JSON.stringify(['Marketing', 'Content Creation', 'Analytics', 'HubSpot CRM', 'SEO', 'Social Media']),
      benefits: JSON.stringify(['Health Insurance', '401k', 'Gym Membership', 'Free Lunch', 'Career Development']),
      keywords: JSON.stringify(['marketing associate', 'hubspot', 'inbound marketing', 'content', 'seo', 'social media']),
      source: JobSource.INDEED,
      sourceUrl: 'https://indeed.com/view/hubspot-marketing',
      applyUrl: 'https://hubspot.com/careers/marketing-associate',
      postedAt: new Date('2024-02-15'),
    },
  ];

  for (const job of jobs) {
    const id = job.title.toLowerCase().replace(/\s+/g, '-') + '-' + job.company.toLowerCase();
    const { title, company, ...rest } = job;
    await prisma.jobListing.upsert({
      where: { id },
      update: rest,
      create: { id, title, company, ...rest },
    });
  }

  console.log(`Seeded ${jobs.length} job listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
