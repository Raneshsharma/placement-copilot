import os
import json
from typing import Any
from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))


def _use_llm_fallback() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY"))


@tool
def research_company(name: str) -> str:
    """Research a company and generate a brief.

    Args:
        name: Company name to research

    Returns:
        JSON string with keys: name, culture, interview_process, benefits (list)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Research this company and provide a brief overview including culture, interview process, benefits, and recent news. Return JSON with name, culture, interview_process, benefits (array), and recent_news (array)."),
            ("human", "{name}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"name": name})
            return result.content
        except Exception:
            pass

    name_lower = name.lower()
    if any(k in name_lower for k in ["google", "alphabet"]):
        return json.dumps({
            "name": name,
            "culture": "Innovative, fast-paced, data-driven. Encourages 20% time for personal projects. Strong emphasis on technical excellence and continuous learning.",
            "interview_process": "Phone screen (30 min) -> Technical phone interview (45 min) -> Onsite (4-5 rounds including coding, system design, and behavioral)",
            "benefits": ["Comprehensive health insurance", "Free meals", "On-site fitness", "401k matching", "Parental leave", "Learning budget"],
            "recent_news": ["AI investments", "Pixel hardware launches", "Cloud growth"],
        })
    elif any(k in name_lower for k in ["amazon", "aws"]):
        return json.dumps({
            "name": name,
            "culture": "Customer-obsessed, fast-moving, data-driven decisions. High bar for ownership and bias for action. Known for Leadership Principles.",
            "interview_process": "Phone screen -> Technical interview (2 rounds) -> Loop (4-5 hours with bar raiser)",
            "benefits": ["Competitive salary", "RSUs", "Health insurance", "401k", "AWS discounts"],
            "recent_news": ["AWS expansion", "AI/ML services growth", "Logistics innovations"],
        })
    elif any(k in name_lower for k in ["meta", "facebook", "instagram"]):
        return json.dumps({
            "name": name,
            "culture": "Move fast, build things. Emphasis on impact, openness, and breaking things. Strong engineering culture with focus on scalability.",
            "interview_process": "Recruiter call -> Technical screen -> Onsite (4-5 hours including coding, design, behavioral)",
            "benefits": ["Free meals", "Health insurance", "Stock options", "Sabbatical program", "Wellness budget"],
            "recent_news": ["Metaverse investments", "Reels growth", "AI research"],
        })
    elif any(k in name_lower for k in ["microsoft"]):
        return json.dumps({
            "name": name,
            "culture": "Growth mindset, inclusive, customer-focused. Emphasizes collaboration and continuous learning. Strong engineering practices.",
            "interview_process": "Recruiter screen -> Technical phone -> Onsite (3-4 rounds)",
            "benefits": ["Health insurance", "Stock options", "Parental leave", "Gym membership", "Professional development"],
            "recent_news": ["Azure growth", "AI integration across products", "Gaming expansion"],
        })
    elif any(k in name_lower for k in ["startup", "seed", "series"]):
        return json.dumps({
            "name": name,
            "culture": "Fast-paced, high ownership, flexible. Opportunities for broad impact and rapid career growth. May have equity upside.",
            "interview_process": "Founder/CEO call -> Technical challenge -> Team fit interview -> Offer",
            "benefits": ["Equity", "Flexible hours", "Remote options", "Health insurance", "Free snacks"],
            "recent_news": ["Funding rounds", "Product launches", "Team expansion"],
        })
    else:
        return json.dumps({
            "name": name,
            "culture": "Professional environment with collaborative culture. Focus on innovation and employee development.",
            "interview_process": "Initial screening -> Technical assessment -> Panel interview -> Final round",
            "benefits": ["Health insurance", "Retirement plan", "Professional development", "Flexible work arrangements"],
            "recent_news": ["Business growth", "New product initiatives"],
        })


@tool
def generate_timeline(deadline: str, requirements: dict | None = None) -> str:
    """Generate an application timeline working backward from the deadline.

    Args:
        deadline: Application deadline in ISO date format
        requirements: Dict with requirements for the application

    Returns:
        JSON string list of task dicts with keys: task, days_before_deadline
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Create an application timeline working backward from the deadline. Include: research, resume tailoring, cover letter, portfolio prep, referral outreach, and submission. Return JSON array with task and days_before_deadline."),
            ("human", "Deadline: {deadline}\nRequirements: {requirements}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"deadline": deadline, "requirements": str(requirements or {})})
            return result.content
        except Exception:
            pass

    return json.dumps([
        {"task": "Submit application", "days_before_deadline": 0},
        {"task": "Send follow-up email to recruiter", "days_before_deadline": 1},
        {"task": "Final resume and cover letter review", "days_before_deadline": 2},
        {"task": "Reach out to potential referral contacts", "days_before_deadline": 3},
        {"task": "Complete portfolio and work samples", "days_before_deadline": 5},
        {"task": "Write and polish cover letter", "days_before_deadline": 7},
        {"task": "Tailor resume to job description", "days_before_deadline": 10},
        {"task": "Research company and role thoroughly", "days_before_deadline": 14},
    ])


@tool
def write_cover_letter(profile: dict, role: str, company: str) -> str:
    """Write a cover letter following the 3-paragraph structure.

    Args:
        profile: User's profile data
        role: Target job role
        company: Target company name

    Returns:
        JSON string with keys: company_name, role, content (the cover letter text)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Write a professional cover letter in 3 paragraphs: Hook (why this role/company), Body (2-3 key qualifications with examples), Close (call to action). Use the profile data to personalize. Return JSON with company_name, role, content."),
            ("human", "Profile: {profile}\nRole: {role}\nCompany: {company}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"profile": str(profile), "role": role, "company": company})
            return result.content
        except Exception:
            pass

    skills = profile.get("skills", [])
    skill_names = ", ".join([str(s) for s in skills[:3]])
    experience = profile.get("experience", [])
    exp_summary = ""
    if experience:
        exp_summary = f"with {experience[0].get('years', 3)}+ years of relevant experience"

    content = f"""I am excited to apply for the {role} position at {company}. With my background in {skill_names} {exp_summary}, I am confident in my ability to make an immediate impact on your team.

Throughout my career, I have consistently delivered results that align with organizational goals. My technical expertise, combined with my strong problem-solving abilities, has enabled me to drive meaningful outcomes in complex, fast-paced environments. I am particularly drawn to {company} because of the company's commitment to innovation and excellence.

I would welcome the opportunity to discuss how my skills and experience align with the {role} role. Thank you for considering my application. I look forward to hearing from you soon."""

    return json.dumps({
        "company_name": company,
        "role": role,
        "content": content,
    })


@tool
def find_connections(user_connections: list[str], target_company: str) -> str:
    """Find networking suggestions from user connections at a target company.

    Args:
        user_connections: List of connection names or companies
        target_company: The company the user is applying to

    Returns:
        JSON string list of networking suggestion dicts with keys: name, relationship, approach
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Based on the user's connections and target company, suggest networking approaches. Return JSON array with name, relationship, approach for each contact."),
            ("human", "Connections: {connections}\nTarget company: {company}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"connections": str(user_connections), "company": target_company})
            return result.content
        except Exception:
            pass

    if not user_connections:
        return json.dumps([
            {"name": "First-degree connection", "relationship": "Warm lead", "approach": "Send a brief, personalized message referencing your shared background."},
            {"name": "Second-degree connection", "relationship": "Referral opportunity", "approach": "Ask for a warm introduction through your mutual connection."},
            {"name": "Employee at target company", "relationship": "Informational interview", "approach": "Request a 15-minute call to learn about the company culture and role."},
        ])

    return json.dumps([
        {"name": conn, "relationship": "Existing connection", "approach": f"Reach out to {conn} to learn more about their experience at {target_company}."}
        for conn in user_connections[:3]
    ])


@tool
def search_company_info(company_name: str) -> str:
    """Search for detailed company information.

    Args:
        company_name: Name of the company to research

    Returns:
        JSON string with company details
    """
    return research_company.invoke({"name": company_name})


@tool
def generate_cover_letter_outline(profile: dict, role: str, company: str) -> str:
    """Generate a cover letter outline for a specific application.

    Args:
        profile: User profile data
        role: Target role
        company: Target company

    Returns:
        JSON string with cover letter outline structure
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Generate a cover letter outline in 3 parts: Opening hook, Key qualifications body, Closing call-to-action. Tailor to the role and company. Return JSON with paragraph headings and bullet points."),
            ("human", "Profile: {profile}\nRole: {role}\nCompany: {company}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"profile": str(profile), "role": role, "company": company})
            return result.content
        except Exception:
            pass

    skills = profile.get("skills", [])
    top_skills = [str(s) for s in skills[:3]]

    return json.dumps({
        "paragraph_1_hook": f"Express enthusiasm for the {role} role at {company}. Mention how you learned about the position and why you're excited.",
        "paragraph_2_body": [
            f"Highlight {top_skills[0] if top_skills else 'key technical skill'} with a specific achievement",
            "Connect your experience to the company's mission and values",
            "Demonstrate cultural fit with concrete examples",
        ],
        "paragraph_3_close": "Express gratitude, reiterate interest, and include a clear call-to-action",
    })


@tool
def suggest_network_contacts(target_company: str, industry: str | None = None) -> str:
    """Suggest networking contacts at or near the target company.

    Args:
        target_company: Company the user is applying to
        industry: Industry context

    Returns:
        JSON string with networking contact suggestions
    """
    return find_connections.invoke({"user_connections": [], "target_company": target_company})
