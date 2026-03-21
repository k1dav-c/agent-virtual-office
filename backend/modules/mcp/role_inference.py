"""
Role Inference — Infer agent role from task summary keywords.

Uses weighted keyword scoring so that more specific phrases (e.g.
"pull request") outweigh single generic words (e.g. "fix").
When multiple roles match, the one with the highest total score wins.
"""

from dataclasses import dataclass, field


@dataclass
class RoleRule:
    role: str
    keywords: dict[str, int] = field(default_factory=dict)
    """Mapping of keyword/phrase → weight (higher = stronger signal)."""


ROLE_RULES: list[RoleRule] = [
    # ── Frontend Developer ──
    RoleRule(
        role="Frontend Developer",
        keywords={
            # Frameworks & languages
            "react": 3,
            "vue": 3,
            "angular": 3,
            "svelte": 3,
            "next.js": 3,
            "nextjs": 3,
            "nuxt": 3,
            "jsx": 3,
            "tsx": 3,
            # Styling
            "css": 2,
            "tailwind": 3,
            "sass": 2,
            "scss": 2,
            "styled-components": 3,
            "animation": 2,
            "responsive": 2,
            "dark mode": 2,
            # DOM & UI
            "component": 2,
            "layout": 2,
            "ui": 2,
            "frontend": 3,
            "front-end": 3,
            "html": 2,
            "dom": 2,
            "modal": 2,
            "form": 1,
            "button": 2,
            "page": 1,
            "render": 2,
            "hook": 2,
            "state management": 3,
            "redux": 3,
            "zustand": 3,
            "context api": 3,
            # Build tools
            "vite": 2,
            "webpack": 2,
            "esbuild": 2,
            "bundler": 2,
        },
    ),
    # ── Backend Developer ──
    RoleRule(
        role="Backend Developer",
        keywords={
            # Frameworks
            "fastapi": 3,
            "django": 3,
            "flask": 3,
            "express": 3,
            "nest.js": 3,
            "nestjs": 3,
            "spring": 3,
            "gin": 3,
            # Concepts
            "api": 2,
            "endpoint": 3,
            "rest": 2,
            "graphql": 2,
            "grpc": 3,
            "websocket": 2,
            "middleware": 2,
            "route": 2,
            "router": 2,
            "backend": 3,
            "back-end": 3,
            "server": 2,
            "microservice": 3,
            # Database
            "database": 2,
            "migration": 2,
            "sql": 2,
            "query": 1,
            "schema": 1,
            "orm": 2,
            "postgres": 3,
            "mysql": 3,
            "redis": 2,
            "mongodb": 3,
            "hasura": 3,
            "prisma": 3,
            "drizzle": 3,
            # Auth & security
            "auth": 2,
            "jwt": 3,
            "oauth": 3,
            "session": 1,
            "permission": 2,
            "rbac": 3,
        },
    ),
    # ── QA Engineer ──
    RoleRule(
        role="QA Engineer",
        keywords={
            "test": 2,
            "spec": 2,
            "coverage": 3,
            "assert": 2,
            "expect": 2,
            "jest": 3,
            "vitest": 3,
            "pytest": 3,
            "cypress": 3,
            "playwright": 3,
            "selenium": 3,
            "e2e": 3,
            "end-to-end": 3,
            "unit test": 3,
            "integration test": 3,
            "testing": 2,
            "regression": 3,
            "smoke test": 3,
            "test case": 3,
            "test suite": 3,
            "snapshot": 2,
            "mock": 2,
            "fixture": 2,
            "qa": 3,
            "quality assurance": 3,
            "tdd": 3,
            "bdd": 3,
        },
    ),
    # ── Code Reviewer ──
    RoleRule(
        role="Code Reviewer",
        keywords={
            "review": 2,
            "reviewing": 3,
            "code review": 3,
            "pull request": 3,
            "merge request": 3,
            "pr": 2,
            "mr": 2,
            "feedback": 2,
            "approve": 3,
            "request changes": 3,
            "comment on": 2,
            "nit": 2,
            "lgtm": 3,
            "diff": 2,
            "changelog": 1,
        },
    ),
    # ── DevOps Engineer ──
    RoleRule(
        role="DevOps Engineer",
        keywords={
            "deploy": 3,
            "deployment": 3,
            "ci": 2,
            "cd": 2,
            "ci/cd": 3,
            "pipeline": 3,
            "github actions": 3,
            "gitlab ci": 3,
            "jenkins": 3,
            "circleci": 3,
            "docker": 3,
            "dockerfile": 3,
            "container": 2,
            "kubernetes": 3,
            "k8s": 3,
            "helm": 3,
            "terraform": 3,
            "pulumi": 3,
            "ansible": 3,
            "nginx": 2,
            "caddy": 2,
            "load balancer": 3,
            "devops": 3,
            "infra": 2,
            "infrastructure": 3,
            "monitoring": 2,
            "grafana": 3,
            "prometheus": 3,
            "datadog": 3,
            "sentry": 2,
            "logging": 2,
            "scaling": 2,
            "aws": 2,
            "gcp": 2,
            "azure": 2,
            "cloud": 2,
            "ssl": 2,
            "dns": 2,
            "cdn": 2,
        },
    ),
    # ── Technical Writer ──
    RoleRule(
        role="Technical Writer",
        keywords={
            "documentation": 3,
            "doc": 1,
            "docs": 2,
            "readme": 3,
            "changelog": 2,
            "wiki": 3,
            "guide": 2,
            "tutorial": 3,
            "jsdoc": 3,
            "docstring": 3,
            "api docs": 3,
            "swagger": 2,
            "openapi": 2,
            "storybook": 3,
            "writing": 2,
            "specification": 2,
            "rfc": 3,
            "adr": 3,
        },
    ),
    # ── Debugger ──
    RoleRule(
        role="Debugger",
        keywords={
            "debug": 3,
            "debugging": 3,
            "fix": 2,
            "bug": 3,
            "bugfix": 3,
            "error": 2,
            "issue": 1,
            "crash": 3,
            "traceback": 3,
            "stack trace": 3,
            "exception": 2,
            "investigate": 2,
            "troubleshoot": 3,
            "root cause": 3,
            "bisect": 3,
            "regression": 2,
            "segfault": 3,
            "memory leak": 3,
            "deadlock": 3,
            "race condition": 3,
            "undefined": 1,
            "null pointer": 3,
            "type error": 2,
            "broken": 2,
            "failing": 2,
            "flaky": 2,
        },
    ),
    # ── Architect ──
    RoleRule(
        role="Architect",
        keywords={
            "architecture": 3,
            "architect": 3,
            "refactor": 2,
            "restructure": 3,
            "redesign": 3,
            "abstract": 2,
            "pattern": 2,
            "design pattern": 3,
            "clean code": 3,
            "solid": 2,
            "decouple": 3,
            "modular": 2,
            "separation of concerns": 3,
            "dependency injection": 3,
            "optimize": 2,
            "performance": 2,
            "scalability": 3,
            "tech debt": 3,
            "technical debt": 3,
            "monorepo": 3,
            "microservice": 2,
            "event-driven": 3,
            "cqrs": 3,
            "ddd": 3,
        },
    ),
    # ── Designer ──
    RoleRule(
        role="Designer",
        keywords={
            "design": 2,
            "figma": 3,
            "sketch": 3,
            "mockup": 3,
            "wireframe": 3,
            "prototype": 3,
            "ux": 3,
            "user experience": 3,
            "user interface": 3,
            "accessibility": 2,
            "a11y": 3,
            "color scheme": 3,
            "typography": 3,
            "icon": 2,
            "illustration": 3,
            "pixel art": 3,
            "responsive design": 3,
            "design system": 3,
            "theme": 2,
        },
    ),
    # ── Data Engineer ──
    RoleRule(
        role="Data Engineer",
        keywords={
            "data": 1,
            "dataset": 3,
            "analytics": 3,
            "metric": 2,
            "dashboard": 2,
            "report": 1,
            "chart": 2,
            "visualization": 3,
            "etl": 3,
            "pipeline": 1,
            "data pipeline": 3,
            "bigquery": 3,
            "snowflake": 3,
            "dbt": 3,
            "airflow": 3,
            "spark": 3,
            "pandas": 3,
            "dataframe": 3,
            "warehouse": 3,
            "data warehouse": 3,
            "data lake": 3,
            "streaming": 2,
            "kafka": 3,
            "batch": 2,
            "csv": 2,
            "parquet": 3,
            "machine learning": 2,
            "ml": 2,
        },
    ),
]


def infer_role(summary: str) -> str:
    """
    Infer the agent's role based on weighted keyword scoring.

    Each keyword hit adds its weight to the role's score.
    The role with the highest total score wins.
    Falls back to "Developer" if nothing matches.
    """
    if not summary:
        return "Developer"

    lower = summary.lower()

    best_role = "Developer"
    best_score = 0

    for rule in ROLE_RULES:
        score = 0
        for keyword, weight in rule.keywords.items():
            if keyword in lower:
                score += weight
        if score > best_score:
            best_score = score
            best_role = rule.role

    return best_role
