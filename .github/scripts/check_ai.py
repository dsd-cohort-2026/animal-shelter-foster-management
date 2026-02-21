import json
import os
import re
import sys

try:
    from google import genai
except ImportError:
    print("ERROR: google-genai package not installed. Run: pip3 install google-genai")
    sys.exit(1)

DIFF_FILE = "pr_diff.txt"
OUTPUT_FILE = "ai_detection_result.json"
MAX_DIFF_CHARS = 14000
SKIP_PATHS = [
    "package-lock.json",
    "routeTree.gen.ts",
    "node_modules",
    "asfm-fe/src/components/ui/",
    "asfm-fe/src/lib/utils.js",
]


def load_and_filter_diff(path):
    try:
        with open(path) as f:
            raw = f.read()
    except FileNotFoundError:
        return ""

    sections = []
    current_file_lines = []
    skip_current = False

    for line in raw.splitlines(keepends=True):
        if line.startswith("diff --git"):
            if current_file_lines and not skip_current:
                sections.append("".join(current_file_lines))
            current_file_lines = [line]
            skip_current = any(p in line for p in SKIP_PATHS)
        else:
            current_file_lines.append(line)

    if current_file_lines and not skip_current:
        sections.append("".join(current_file_lines))

    diff = "".join(sections)

    if len(diff) > MAX_DIFF_CHARS:
        diff = diff[:MAX_DIFF_CHARS] + "\n\n[... diff truncated for analysis ...]"

    return diff


def analyze(diff, pr_author, pr_title):
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    prompt = f"""You are a coding instructor at a software development bootcamp reviewing student pull requests.

Context: Students are building an animal shelter foster management app using React, Express, and Prisma ORM. Students are NOT allowed to use AI tools (ChatGPT, Claude, Copilot, Cursor, etc.) to generate code. They must write and understand every line themselves so they can explain it during technical interviews.

PR Author: {pr_author}
PR Title: {pr_title}

<diff>
{diff}
</diff>

Analyze this diff carefully for signs that the code was AI-generated rather than written by a beginner bootcamp student.

--- SIGNALS OF AI-GENERATED CODE ---
- Perfectly uniform try-catch blocks across multiple files with identical error message templates (e.g., always "An error occurred while [verb] [noun]")
- Production-quality code with zero debugging artifacts — no console.log, no placeholders, no TODOs
- Sophisticated patterns unusually mature for a beginner (e.g., advanced CORS origin validation, JWT verification with jose, complex CVA-based UI component systems)
- Exhaustive field-by-field mapping in service/transform layers where a student would write a shortcut
- Multiple new files added in one PR that are all perfectly consistent in style with no variation
- Code that is more complete and robust than the task requires

--- SIGNALS OF GENUINE STUDENT CODE ---
- Debug console.log or console.error statements left in unintentionally
- Common beginner bugs (e.g., using `this` inside CommonJS module.exports functions, missing await, off-by-one errors)
- Hardcoded placeholder values ("UserName", "hello"/"world" test data, hardcoded UUIDs)
- TODO comments or unfinished stub implementations
- Inconsistent naming conventions within the same file (mixing snake_case and camelCase)
- Grammatically awkward or confused code comments that show the student thinking through a problem
- Simpler, more direct implementations than AI would produce
- Typos in variable names, comments, or identifiers
- Logic that works but in a roundabout way

Respond ONLY with a valid JSON object. No markdown fences, no explanation — just raw JSON:
{{"confidence":"low|medium|high","summary":"2-3 sentence plain-language assessment","signals":[{{"type":"ai_signal|student_signal","description":"specific observation about the code, include filename if possible"}}],"recommendation":"1-2 sentence note directed at the student or instructor"}}

Confidence scale:
- "low"   → Looks genuinely student-written, or diff is too small/ambiguous to assess
- "medium" → Mixed signals — some AI patterns but student artifacts also present; warrants a conversation
- "high"   → Strong AI signals with little to no student artifacts; high likelihood of AI generation

Be conservative and fair. Clean, well-written code is not itself evidence of AI. Only flag "high" when multiple independent signals all point the same direction. A student can write a clean 10-line component on their own."""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    text = response.text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    return json.loads(text)


def write_result(result):
    with open(OUTPUT_FILE, "w") as f:
        json.dump(result, f, indent=2)
    print(f"Confidence: {result['confidence'].upper()}")
    print(f"Summary: {result['summary']}")


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        write_result({
            "confidence": "low",
            "summary": "AI detection skipped — GEMINI_API_KEY secret is not configured.",
            "signals": [],
            "recommendation": "Ask your instructor to add the GEMINI_API_KEY secret to the repository settings.",
        })
        return

    diff = load_and_filter_diff(DIFF_FILE)

    if not diff.strip():
        write_result({
            "confidence": "low",
            "summary": "No relevant source code changes found in this PR (only config, lock files, or auto-generated files changed).",
            "signals": [],
            "recommendation": "Nothing to analyze.",
        })
        return

    try:
        result = analyze(
            diff,
            pr_author=os.environ.get("PR_AUTHOR", "unknown"),
            pr_title=os.environ.get("PR_TITLE", ""),
        )
        write_result(result)
    except json.JSONDecodeError as e:
        write_result({
            "confidence": "low",
            "summary": "Analysis returned an unexpected response and could not be parsed.",
            "signals": [],
            "recommendation": "Re-run the check or review this PR manually.",
        })
        print(f"JSON parse error: {e}", file=sys.stderr)
    except Exception as e:
        write_result({
            "confidence": "low",
            "summary": "Gemini API error — analysis could not be completed.",
            "signals": [],
            "recommendation": "Re-run the check or review this PR manually.",
        })
        print(f"API error: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
