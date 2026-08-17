"""
Management command to seed the database with sample job listings.
Usage: python manage.py seed_careers
"""
from django.core.management.base import BaseCommand
from careers.models import Job

SEED_JOBS = [
    {
        "title": "Full Stack Developer",
        "department": "engineering",
        "job_type": "full_time",
        "location": "Hyderabad",
        "is_remote": True,
        "description": """## About the Role

We're looking for a **Full Stack Developer** to build and maintain web applications using Python/Django on the backend and React on the frontend.

### What You'll Do

- Design and implement **RESTful APIs** with Django REST Framework
- Build responsive, interactive UIs with **React 19** and Ant Design
- Collaborate with product, design, and QA teams in **agile sprints**
- Write clean, tested code — we maintain **90%+ test coverage**
- Participate in code reviews and architectural discussions

### Why Join Us

> "Working at Algonex means building tools that directly impact how thousands of students learn and grow their careers."

We offer a **hybrid work model**, competitive salary, and the opportunity to work on a product used by students across India.""",
        "requirements": """## Requirements

### Must Have

- **2+ years** experience with Python and Django
- Strong proficiency in **React** and modern JavaScript (ES6+)
- Experience designing and consuming **REST APIs**
- Solid understanding of **relational databases** (PostgreSQL/SQLite)
- Familiarity with **Git**, branching strategies, and code reviews

### Nice to Have

- Experience with **Docker** and CI/CD pipelines
- Knowledge of **Ant Design** or similar component libraries
- Understanding of **JWT authentication** and OAuth flows
- Contributions to open source projects

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Ant Design, SCSS |
| Backend | Django 5, DRF, PostgreSQL |
| DevOps | Docker, GitHub Actions, Nginx |""",
        "salary_min": "800000.00",
        "salary_max": "1500000.00",
    },
    {
        "title": "UI/UX Design Intern",
        "department": "design",
        "job_type": "internship",
        "location": "Hyderabad",
        "is_remote": False,
        "description": """## About the Role

Join our design team as a **UI/UX Intern** and help create beautiful, intuitive interfaces for our learning platform. You'll work on real projects from day one.

### What You'll Do

- Create **wireframes, mockups, and prototypes** in Figma
- Conduct user research and **usability testing** with real students
- Collaborate with developers to ensure pixel-perfect implementation
- Contribute to our **design system** and component library
- Present design decisions to stakeholders

### What You'll Learn

1. Professional design workflow in a **product company**
2. How to translate user research into **actionable designs**
3. Working with developers using **design tokens** and handoff tools
4. Building accessible, responsive interfaces

> This is a **paid internship** (3-6 months) with the possibility of conversion to full-time.""",
        "requirements": """## Requirements

### Must Have

- Currently pursuing a degree in **Design, HCI**, or related field
- Proficiency in **Figma** or Adobe XD
- Basic understanding of **HTML/CSS**
- A **portfolio** showcasing 3+ UI/UX projects
- Strong eye for **detail and visual hierarchy**

### Nice to Have

- Experience with **user research** methodologies
- Familiarity with **design systems** (Material, Ant Design)
- Basic knowledge of **React** or frontend frameworks
- Understanding of **accessibility standards** (WCAG)

### Portfolio Tips

Your portfolio should demonstrate:
- **Problem-solving** — show the before/after
- **Process** — wireframes → mockups → final design
- **Reasoning** — explain *why*, not just *what*""",
        "salary_min": "15000.00",
        "salary_max": "25000.00",
    },
    {
        "title": "DevOps Engineer",
        "department": "engineering",
        "job_type": "full_time",
        "location": "Remote",
        "is_remote": True,
        "description": """## About the Role

We need a **DevOps Engineer** to manage our cloud infrastructure, CI/CD pipelines, and deployment processes.

### What You'll Do

- Design and maintain **Docker-based** deployment pipelines
- Manage **AWS infrastructure** (EC2, RDS, S3, CloudFront)
- Set up monitoring, alerting, and **incident response** processes
- Automate everything — deployments, scaling, backups
- Improve developer experience with better **local dev tooling**

### Current Stack

```
┌─────────────┐    ┌──────────┐    ┌───────────┐
│   Nginx     │───▶│  Django   │───▶│ PostgreSQL│
│   (proxy)   │    │ (Gunicorn)│    │           │
└─────────────┘    └──────────┘    └───────────┘
       │
       ▼
┌─────────────┐
│   React     │
│   (static)  │
└─────────────┘
```

### Why This Role Matters

> Our platform serves thousands of students daily. **Reliability is not optional** — when a student is mid-lesson, downtime means lost learning.""",
        "requirements": """## Requirements

### Must Have

- **3+ years** experience in DevOps or SRE roles
- Strong knowledge of **AWS** (EC2, RDS, S3, IAM, VPC)
- Experience with **Docker** and container orchestration
- Proficiency in **CI/CD** (GitHub Actions, Jenkins, or GitLab CI)
- Solid **Linux** administration and networking skills

### Nice to Have

- Experience with **Kubernetes** and Helm charts
- Knowledge of **Terraform** or CloudFormation (IaC)
- Familiarity with monitoring tools (**Grafana, Prometheus, Datadog**)
- Experience with **PostgreSQL** performance tuning
- AWS certifications (Solutions Architect, DevOps Engineer)

### On-Call

This role includes participation in an **on-call rotation** (1 week per month). We use PagerDuty and have clear escalation policies.""",
        "salary_min": "1200000.00",
        "salary_max": "2000000.00",
    },
    {
        "title": "Content Marketing Specialist",
        "department": "marketing",
        "job_type": "full_time",
        "location": "Hyderabad",
        "is_remote": True,
        "description": """## About the Role

Drive our content strategy across **blog, social media, and email**. You'll create engaging content that attracts students and builds the Algonex brand in the EdTech space.

### What You'll Do

- Write **2-3 blog posts per week** on tech topics, career advice, and course highlights
- Manage our **social media presence** (LinkedIn, Twitter, Instagram)
- Create **email campaigns** for course launches and events
- Collaborate with instructors to produce **technical tutorials**
- Track content performance with **Google Analytics** and optimize for SEO

### Content Examples

Here's the kind of content we publish:

| Type | Example |
|------|---------|
| Blog | "5 Python Projects That Will Get You Hired in 2026" |
| Tutorial | "Building Your First REST API with Django" |
| Case Study | "How Priya Went from Zero to Full Stack in 6 Months" |
| Newsletter | Weekly digest of new courses, events, and tech news |

> **Our voice is:** Friendly, knowledgeable, encouraging. We make complex topics accessible.""",
        "requirements": """## Requirements

### Must Have

- **2+ years** in content marketing or copywriting
- Excellent **written and verbal communication** in English
- Experience with **SEO** best practices and keyword research
- Proficiency with **Google Analytics** and social media analytics
- Ability to write about **technical topics** for a non-technical audience

### Nice to Have

- Understanding of the **EdTech** or tech training industry
- Experience with **email marketing** tools (Mailchimp, SendGrid)
- Basic knowledge of **HTML/CSS** for formatting blog posts
- Video editing skills for **short-form content** (Reels, Shorts)
- Experience with **AI writing tools** (for ideation, not replacement)

### Writing Sample Required

Please include **2-3 writing samples** with your application. At least one should be a technical topic explained for beginners.""",
        "salary_min": "500000.00",
        "salary_max": "900000.00",
    },
    {
        "title": "Data Analyst",
        "department": "engineering",
        "job_type": "contract",
        "location": "Remote",
        "is_remote": True,
        "description": """## About the Role

Analyze platform data to uncover insights about **student engagement, course performance, and business metrics**.

### What You'll Do

- Build **dashboards and reports** using Metabase/Tableau
- Analyze student behavior — enrollment patterns, completion rates, drop-off points
- Run **A/B tests** on course pages and marketing campaigns
- Create **weekly metrics reports** for the leadership team
- Identify trends and anomalies in our **growth data**

### Key Metrics You'll Own

```
📊 Student Metrics
├── Daily Active Users (DAU)
├── Course Completion Rate
├── Average Time to Enrollment
└── Student Satisfaction Score (NPS)

💰 Business Metrics
├── Monthly Recurring Revenue
├── Customer Acquisition Cost
├── Lifetime Value per Student
└── Conversion Rate (visitor → enrolled)
```

### Contract Details

- **6-month contract** with option to extend or convert to full-time
- **Flexible hours** — we care about output, not hours logged
- Monthly retainer paid on the 1st of each month""",
        "requirements": """## Requirements

### Must Have

- Strong proficiency in **SQL** (complex queries, window functions, CTEs)
- **Python** for data analysis (Pandas, NumPy, Matplotlib)
- Experience with **data visualization** tools (Tableau, Power BI, or Metabase)
- Understanding of **statistical analysis** and A/B testing methodology
- Ability to translate data into **actionable business recommendations**

### Nice to Have

- Experience with **Google Analytics** and marketing attribution
- Knowledge of **dbt** or similar data transformation tools
- Familiarity with **cohort analysis** and retention metrics
- Experience in **EdTech** or SaaS analytics
- Understanding of **data warehousing** concepts

### Tools We Use

| Category | Tools |
|----------|-------|
| Database | PostgreSQL, SQLite |
| Analysis | Python, Jupyter, Pandas |
| Visualization | Metabase, Matplotlib |
| Tracking | Google Analytics, Mixpanel |""",
        "salary_min": "600000.00",
        "salary_max": "1000000.00",
    },
    {
        "title": "Frontend Developer",
        "department": "engineering",
        "job_type": "full_time",
        "location": "Mumbai",
        "is_remote": False,
        "description": "## About the Role\n\nBuild user-facing web applications using React and modern JavaScript...",
        "requirements": "3+ years React experience",
        "apply_mode": "external",
        "external_link": "https://careers.tcs.com/frontend-dev",
        "company_name": "TCS",
        "tags": "React, JavaScript, Frontend",
        "eligibility_criteria": "## Eligibility\n\n- B.Tech/MCA in CS or related\n- Strong JavaScript fundamentals",
    },
    {
        "title": "Data Science Intern",
        "department": "engineering",
        "job_type": "internship",
        "location": "Bangalore",
        "is_remote": True,
        "description": "## About the Role\n\nWork on real-world data science projects with mentorship...",
        "requirements": "Python, pandas basics",
        "apply_mode": "external",
        "external_link": "https://careers.infosys.com/data-intern",
        "company_name": "Infosys",
        "tags": "Python, Data Science, ML",
        "eligibility_criteria": "## Eligibility\n\n- Currently pursuing B.Tech/M.Tech\n- Basic Python and statistics",
    },
    {
        "title": "Cloud Engineer",
        "department": "engineering",
        "job_type": "full_time",
        "location": "Hyderabad",
        "is_remote": False,
        "description": "## About the Role\n\nDesign and manage cloud infrastructure on AWS...",
        "requirements": "AWS, Docker, Kubernetes",
        "apply_mode": "external",
        "external_link": "https://careers.wipro.com/cloud-engineer",
        "company_name": "Wipro",
        "tags": "AWS, DevOps, Cloud",
        "eligibility_criteria": "## Eligibility\n\n- B.Tech in CS/IT\n- Linux and networking basics",
    },
    {
        "title": "UI/UX Designer",
        "department": "design",
        "job_type": "contract",
        "location": "Chennai",
        "is_remote": True,
        "description": "## About the Role\n\nCreate beautiful, user-centered designs for enterprise products...",
        "requirements": "Figma, design systems",
        "apply_mode": "external",
        "external_link": "https://careers.zoho.com/ux-designer",
        "company_name": "Zoho",
        "tags": "UI/UX, Figma, Design",
        "eligibility_criteria": "## Eligibility\n\n- Any degree with design portfolio\n- Proficiency in Figma or Sketch",
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample job listings"

    def handle(self, *args, **options):
        for job_data in SEED_JOBS:
            job_fields = dict(job_data)
            tags_str = job_fields.pop("tags", "")
            job_fields["tags_text"] = tags_str

            job, created = Job.objects.get_or_create(
                title=job_fields["title"],
                defaults=job_fields,
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"  Created: {job.title}"))
            else:
                # Update existing with new markdown content
                job.description = job_fields["description"]
                job.requirements = job_fields["requirements"]
                job.tags_text = tags_str
                job.save(update_fields=["description", "requirements", "tags_text"])
                self.stdout.write(f"  Updated: {job.title}")

        self.stdout.write(self.style.SUCCESS("Career seed complete!"))
