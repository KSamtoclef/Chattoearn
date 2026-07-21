from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CONTROLLER = ROOT / "assets" / "js" / "chatearn-app.js"
CACHE_VERSION = "20260721-postkyc-cta2"


def patch_controller(source: str) -> str:
    source = re.sub(
        r"const KYC_CONFIG=\{url:'[^']*',active:(?:true|false)\};",
        "const KYC_CONFIG={url:'https://example.com',active:true};",
        source,
        count=1,
    )

    source = re.sub(
        r"let actions=\$\('processingActions'\);.*?actions\.innerHTML='.*?';",
        """let actions=$('processingActions');
 if(!actions){actions=document.createElement('div');actions.id='processingActions';const title=document.querySelector('#processing .pp-title');title?.after(actions)}
 actions.style.cssText='width:calc(100% - 28px);max-width:440px;margin:18px auto 22px;padding:20px 16px;border:2px solid rgba(0,230,118,.72);border-radius:20px;background:rgba(0,200,83,.16);display:grid;gap:12px;box-shadow:0 10px 34px rgba(0,200,83,.20)';
 actions.innerHTML='<div style="text-align:center;font-size:17px;font-weight:950;color:#69F0AE">Continue chatting and keep earning</div><button onclick="returnToChat()" style="width:100%;min-height:64px;padding:18px 14px;border:0;border-radius:15px;background:#00C853;color:#001b0b;font-size:18px;font-weight:950;line-height:1.25;box-shadow:0 10px 28px rgba(0,200,83,.35)">RETURN TO CHAT & CONTINUE EARNING</button>';""",
        source,
        count=1,
        flags=re.S,
    )

    source = re.sub(
        r"document\.documentElement\.dataset\.build='[^']+'",
        "document.documentElement.dataset.build='ChatEarn Visible Continue CTA 2026.07.21'",
        source,
        count=1,
    )
    return source


def patch_index(html: str) -> str:
    html = re.sub(
        r"(<div class=\"pp-title\">.*?</div>)\s*(?:<div id=\"processingActions\"></div>)?",
        r"\1\n  <div id=\"processingActions\"></div>",
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r"\s*<p class=\"pp-note\">Share ChatEarn with more friends to earn more while you wait!</p>\s*<div style=\"margin-top:20px;width:100%;padding:0 20px;\">\s*<button[^>]*onclick=\"shareAgain\(\)\"[^>]*>.*?</button>\s*</div>",
        "\n",
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'<script src="\./assets/js/chatearn-app\.js\?v=[^"]+"></script>',
        f'<script src="./assets/js/chatearn-app.js?v={CACHE_VERSION}"></script>',
        html,
        count=1,
    )
    return html


def main() -> None:
    controller = CONTROLLER.read_text(encoding="utf-8")
    index = INDEX.read_text(encoding="utf-8")
    CONTROLLER.write_text(patch_controller(controller), encoding="utf-8")
    INDEX.write_text(patch_index(index), encoding="utf-8")


if __name__ == "__main__":
    main()
