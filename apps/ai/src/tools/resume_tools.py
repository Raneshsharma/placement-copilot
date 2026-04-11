import os
import json
import re
from typing import Any
from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))

SECTION_PATTERNS = {
    "header": [r"(?i)^(?:name|contact|email|phone|linkedin|url)\s*:", r"(?i)^\+?[\d\-\s\(\)]{10,}"],
    "summary": [r"(?i)^(?:summary|objective|profile|about)\s*:?\s*(.+)"],
    "experience": [r"(?i)^(?:experience|work\s+history|employment|professional\s+experience)\s*:?"],
    "education": [r"(?i)^(?:education|academic|qualifications|degrees?)\s*:?"],
    "skills": [r"(?i)^(?:skills|technical\s+skills|competencies|core\s+competencies|expertise)\s*:?"],
    "certifications": [r"(?i)^(?:certifications?|certificates?|credentials?|licenses?)\s*:?"],
    "projects": [r"(?i)^(?:projects?|portfolio|personal\s+projects?)\s*:?"],
}


def _use_llm_fallback() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY"))


def _extract_sections(text: str) -> list[dict]:
    lines = text.strip().split("\n")
    sections = []
    current_section = {"name": "header", "content": ""}

    for line in lines:
        line = line.strip()
        matched = False
        for section_name, patterns in SECTION_PATTERNS.items():
            for pat in patterns:
                if re.search(pat, line):
                    if current_section["content"]:
                        sections.append(current_section)
                    current_section = {"name": section_name, "content": line + "\n"}
                    matched = True
                    break
            if matched:
                break
        if not matched:
            current_section["content"] += line + "\n"

    if current_section["content"]:
        sections.append(current_section)

    return sections


def _extract_keywords(text: str) -> list[str]:
    common = [
        "python", "java", "javascript", "typescript", "sql", "react", "angular", "vue",
        "node.js", "docker", "kubernetes", "aws", "gcp", "azure", "git", "ci/cd",
        "agile", "scrum", "rest", "api", "microservices", "machine learning",
        "data analysis", "project management", "leadership", "communication",
        "teamwork", "problem solving", "product management", "sql", "nosql",
        "mongodb", "postgresql", "mysql", "redis", "elasticsearch", "kafka",
        "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "spark",
    ]
    text_lower = text.lower()
    found = [kw for kw in common if kw in text_lower]
    return found


def _score_format(text: str) -> float:
    score = 100.0
    lines = text.split("\n")
    long_lines = sum(1 for l in lines if len(l) > 120)
    score -= min(30, long_lines * 3)
    if text.count("|") > 2:
        score -= 15
    if len(text) > 6000:
        score -= 10
    return max(40.0, score)


@tool
def parse_resume(text: str) -> str:
    """Parse a resume's text into structured sections.

    Args:
        text: Raw resume text content

    Returns:
        JSON string with keys: sections (list of {name, content}), keywords, format_score (0-100)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Parse this resume into structured sections: HEADER, SUMMARY, EXPERIENCE, EDUCATION, SKILLS, CERTIFICATIONS, PROJECTS. Return JSON with sections array, keywords array, and format_score 0-100."),
            ("human", "{input}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"input": text})
            return result.content
        except Exception:
            pass

    sections = _extract_sections(text)
    keywords = _extract_keywords(text)
    format_score = _score_format(text)

    return json.dumps({
        "sections": [{"name": s["name"], "content": s["content"].strip()} for s in sections],
        "keywords": keywords,
        "format_score": round(format_score, 1),
    })


def _calc_ats_score(resume_text: str, job_description: str) -> dict:
    resume_lower = resume_text.lower()
    job_lower = job_description.lower()
    keywords = _extract_keywords(job_description)
    matched = sum(1 for kw in keywords if kw in resume_lower)
    keyword_score = min(25, (matched / max(len(keywords), 1)) * 25)

    header_patterns = [r"(?i)[\w\.\-]+@[\w\.\-]+\.\w+", r"(?i)\+?[\d\-\(\)]{10,}", r"(?i)linkedin"]
    header_found = sum(1 for p in header_patterns if re.search(p, resume_text))
    header_score = header_found * 8.33

    format_score = min(25, _score_format(resume_text) * 0.25)
    length = len(resume_text)
    length_score = 25 if 1000 <= length <= 4000 else max(10, 25 - abs(length - 2500) / 200)

    total = min(100, header_score + keyword_score + format_score + length_score)

    return {
        "total": round(total, 1),
        "breakdown": {
            "header": round(header_score, 1),
            "keywords": round(keyword_score, 1),
            "format": round(format_score, 1),
            "length": round(length_score, 1),
        }
    }


@tool
def score_ats(resume: str, job_description: str) -> str:
    """Score ATS compatibility of a resume against a job description.

    Args:
        resume: Resume text content
        job_description: Target job description text

    Returns:
        JSON string with keys: total (0-100), breakdown (header, keywords, format, length scores)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Score this resume's ATS compatibility against the job description. Rate 0-100: header detection (0-25), keyword density (0-25), format cleanliness (0-25), length (0-25). Return JSON with total and breakdown."),
            ("human", "RESUME:\n{resume}\n\nJOB DESCRIPTION:\n{job_description}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"resume": resume, "job_description": job_description})
            return result.content
        except Exception:
            pass

    return json.dumps(_calc_ats_score(resume, job_description))


@tool
def optimize_keywords(resume: str, job_description: str) -> str:
    """Suggest keyword improvements to align resume with job description.

    Args:
        resume: Resume text content
        job_description: Target job description text

    Returns:
        JSON string with keys: missing (list of missing keywords), suggestions (list of improvements)
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Compare this resume to the job description. Identify missing keywords and provide suggestions to optimize the resume. Return JSON with missing keywords array and suggestions array."),
            ("human", "RESUME:\n{resume}\n\nJOB DESCRIPTION:\n{job_description}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"resume": resume, "job_description": job_description})
            return result.content
        except Exception:
            pass

    resume_lower = resume.lower()
    job_keywords = _extract_keywords(job_description)
    missing = [kw for kw in job_keywords if kw not in resume_lower]

    suggestions = [
        f"Add '{kw}' to your skills section or work experience bullets" for kw in missing[:5]
    ]
    if len(missing) > 5:
        suggestions.append(f"Consider adding {len(missing) - 5} more keywords related to {job_description[:100]}...")

    return json.dumps({"missing": missing, "suggestions": suggestions})


@tool
def parse_resume_text(resume_text: str) -> str:
    """Parse resume text into structured data.

    Args:
        resume_text: Raw resume text

    Returns:
        JSON string with parsed sections and keywords
    """
    return parse_resume.invoke({"text": resume_text})


@tool
def score_ats_from_text(resume_text: str, job_description: str) -> str:
    """Calculate ATS score from resume and job description text.

    Args:
        resume_text: Resume content
        job_description: Job description content

    Returns:
        JSON string with ATS score and breakdown
    """
    return score_ats.invoke({"resume": resume_text, "job_description": job_description})


@tool
def suggest_keywords(resume_text: str, job_description: str) -> str:
    """Suggest keywords for ATS optimization.

    Args:
        resume_text: Resume content
        job_description: Job description content

    Returns:
        JSON string with missing keywords and suggestions
    """
    return optimize_keywords.invoke({"resume": resume_text, "job_description": job_description})


@tool
def optimize_section(section_name: str, section_content: str, job_description: str) -> str:
    """Optimize a specific resume section for a job description.

    Args:
        section_name: Name of the section (experience, skills, etc.)
        section_content: Current content of the section
        job_description: Target job description

    Returns:
        JSON string with optimized content and injected keywords
    """
    if _use_llm_fallback():
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Optimize this resume section for the given job description. Use strong action verbs, quantify achievements, and align with job keywords. Return JSON with optimized_content and injected_keywords."),
            ("human", "SECTION: {section_name}\nCONTENT:\n{section_content}\n\nJOB DESCRIPTION:\n{job_description}"),
        ])
        chain = prompt | llm
        try:
            result = chain.invoke({"section_name": section_name, "section_content": section_content, "job_description": job_description})
            return result.content
        except Exception:
            pass

    keywords = _extract_keywords(job_description)
    injected = [kw for kw in keywords if kw not in section_content.lower()]

    optimized = section_content
    if injected and section_name.lower() == "experience":
        bullet = "\n- " + ", ".join(injected[:3])
        optimized += bullet

    return json.dumps({
        "optimized_content": optimized,
        "injected_keywords": injected,
    })
