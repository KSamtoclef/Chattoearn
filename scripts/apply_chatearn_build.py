from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CONTROLLER = ROOT / "assets" / "js" / "chatearn-app.js"
CACHE_VERSION = "20260721-original-flow4"


def patch_controller(source: str) -> str:
    source = re.sub(
        r"const KYC_CONFIG=\{url:'[^']*',active:(?:true|false)\};",
        "const KYC_CONFIG={url:'https://example.com',active:true};",
        source,
        count=1,
    )

    source = source.replace(
        "${message.reward?`<div style=\"font-size:10px;color:#69F0AE;margin-top:4px\">Reply accepted<br>+${money(message.reward)} added to your earnings</div>`:''}",
        "${message.reward?`<div style=\"font-size:11px;color:#00E676;font-weight:800;margin-top:5px\">+${money(message.reward)} earned! 💰</div>`:''}",
    )

    if "function showRewardToast(" not in source:
        marker = "function typingIndicator(){"
        reward_toast = """function showRewardToast(amount){
 const old=document.getElementById('rewardToast');if(old)old.remove();
 const badge=document.createElement('div');badge.id='rewardToast';badge.textContent=`+${money(amount)} Earned! 💰`;
 badge.style.cssText='position:fixed;right:14px;top:110px;z-index:5000;background:#00C853;color:#001b0b;padding:13px 18px;border-radius:16px;font-weight:900;box-shadow:0 10px 28px rgba(0,0,0,.35);animation:earnPop .28s ease';
 document.body.appendChild(badge);setTimeout(()=>badge.remove(),1800);
}
"""
        source = source.replace(marker, reward_toast + marker, 1)

    # Ensure the floating reward notice is called after a successful credit.
    source = re.sub(
        r"(state\.ad\.replyCounter\+=1;\s*\}\s*saveState\(\);drawConversation\(\);)(?!if\(reward\)showRewardToast)",
        r"\1if(reward)showRewardToast(reward);",
        source,
        count=1,
    )

    source = re.sub(
        r"function withdrawalUnlockCard\(\)\{.*?\n\}\nwindow\.tryWithdraw=",
        """function withdrawalUnlockCard(){
 const body=$('chatBody');body?.querySelector('[data-unlock]')?.remove();
 if(!body||state.availableBalance<FIRST_WITHDRAWAL_MINIMUM||state.withdrawal)return;
 const card=document.createElement('div');card.dataset.unlock='1';
 card.style.cssText='margin:18px 0;padding:22px 18px;border-radius:18px;background:rgba(0,200,83,.10);border:1px solid rgba(0,200,83,.42);text-align:center';
 card.innerHTML=`<div style="font-size:30px;margin-bottom:8px">🎉</div><b style="display:block;color:#00E676;font-size:21px">${money(state.availableBalance)} Earned!</b><p style="color:#b8c2bc;font-size:13px;margin:7px 0 14px">Withdrawal available! Withdraw now.</p><button onclick="goScreen('earnings')" style="padding:13px 28px;border:0;border-radius:12px;background:#00C853;color:#001b0b;font-size:15px;font-weight:900">Withdraw Now →</button>`;
 body.appendChild(card);
}
window.tryWithdraw=""",
        source,
        count=1,
        flags=re.S,
    )

    source = source.replace("  mountEarningsAd();\n", "")

    source = re.sub(
        r"tools\.innerHTML=`<div style=\"display:grid;gap:9px;margin-top:12px\"><button onclick=\"copyInvitationLink\(\)\".*?</div>`;",
        "tools.innerHTML=`<div style=\"display:grid;gap:9px;margin-top:12px\"><button onclick=\"copyInvitationLink()\" style=\"padding:12px;border:1px solid #39413b;border-radius:10px;background:#1e231f;color:#fff;font-weight:900\">COPY INVITATION LINK</button></div>`;",
        source,
        count=1,
        flags=re.S,
    )

    source = re.sub(
        r"shareReturnTimer=setTimeout\(\(\)=>\{state\.sharing\.cooldownUntil=0;saveState\(\);showScreen\('kyc'\)\},\d+\);",
        "shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();showScreen('kyc')},500);",
        source,
        count=1,
    )

    source = re.sub(
        r"actions\.innerHTML='[^']*VIEW WITHDRAWAL STATUS[^']*';",
        "actions.innerHTML='<button onclick=\"returnToChat()\" style=\"width:100%;padding:15px;border:0;border-radius:12px;background:#00C853;font-weight:900\">RETURN TO CHAT & CONTINUE EARNING</button>';",
        source,
        count=1,
    )

    source = re.sub(
        r"document\.documentElement\.dataset\.build='[^']+'",
        "document.documentElement.dataset.build='ChatEarn Original Flow Test 2026.07.21 Final'",
        source,
        count=1,
    )
    return source


def patch_index(html: str) -> str:
    # Remove the whole payout counter and any residue left by an earlier partial cleanup.
    html = re.sub(
        r"\s*<!-- LIVE PAYOUT COUNTER -->\s*<div class=\"live-counter\">.*?<div class=\"lc-amount\" id=\"liveCounter\">.*?</div>\s*</div>\s*",
        "\n",
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r"\s*<div class=\"lc-amount\" id=\"liveCounter\">.*?</div>\s*</div>\s*",
        "\n",
        html,
        count=1,
        flags=re.S,
    )

    html = re.sub(r"\s*<a[^>]*>📊 View Full Earnings Report →</a>", "", html, flags=re.S)
    html = re.sub(r"\s*<a[^>]*>🎁 Unlock Extra Bonus — Tap Here →</a>", "", html, flags=re.S)
    html = re.sub(r"\s*<a[^>]*>💰 Verify Account for Faster Payout →</a>", "", html, flags=re.S)

    html = re.sub(
        r"\s*<(?:a|button)[^>]*>\s*VIEW WITHDRAWAL STATUS\s*</(?:a|button)>",
        "",
        html,
        flags=re.I | re.S,
    )

    html = re.sub(
        r"\s*<div[^>]*>\s*<[^>]+>Sharing Stage Complete[^<]*</[^>]+>.*?COMPLETE YOUR KYC.*?</div>\s*</div>",
        "",
        html,
        flags=re.I | re.S,
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
