export async function shareResult() {
    const res = getLastResult();
    const archetype = res?.type || 'NOUSYS';
    const url = window.location.href;

    const title = 'NOUSYS Result';
    const text = `My NOUSYS Archetype: ${archetype}`;

    track('share_click', { archetype });

    try {
        // Best UX (mobile + some desktop)
        if (navigator.share) {
            await navigator.share({ title, text, url });
            track('share_success', { archetype, method: 'webshare' });
            return;
        }

        // Fallback: open platform picker (instead of only copying)
        openShareMenu({ title, text, url, archetype });
    } catch (err) {
        console.log('Share cancelled/error:', err);
        track('share_fail', { archetype });
    }
}

// ---- ADD THESE HELPERS (minimal, self-contained) ----

function enc(s) {
    return encodeURIComponent(s);
}

function buildShareLinks({ title, text, url }) {
    const fullText = `${text} ${url}`;

    return [
        {
            label: 'X (Twitter)',
            href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`
        },
        {
            label: 'Facebook',
            // Facebook share is URL-based; text prefill is not reliable.
            href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`
        },
        {
            label: 'LinkedIn',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`
        },
        {
            label: 'WhatsApp',
            href: `https://wa.me/?text=${enc(fullText)}`
        },
        {
            label: 'Telegram',
            href: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`
        },
        {
            label: 'Reddit',
            href: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}`
        },
        {
            label: 'Email',
            href: `mailto:?subject=${enc(title)}&body=${enc(text + '\n\n' + url)}`
        },
        {
            label: 'Copy link',
            onClick: async () => {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard.');
                } else {
                    window.prompt('Copy this link:', url);
                }
            }
        }
    ];
}

function openShareMenu(payload) {
    const links = buildShareLinks(payload);

    // Remove existing menu if any
    const existing = document.getElementById('share-menu-overlay');
    if (existing) existing.remove();

    // Overlay (inline styles so you don't touch CSS)
    const overlay = document.createElement('div');
    overlay.id = 'share-menu-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const panel = document.createElement('div');
    panel.style.width = 'min(520px, 92vw)';
    panel.style.background = 'rgba(30, 41, 59, 0.95)';
    panel.style.border = '1px solid rgba(255,255,255,0.12)';
    panel.style.borderRadius = '16px';
    panel.style.padding = '16px';
    panel.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.6)';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '12px';

    const title = document.createElement('div');
    title.textContent = 'Share your result';
    title.style.fontWeight = '700';

    const close = document.createElement('button');
    close.textContent = '✕';
    close.style.background = 'transparent';
    close.style.border = '1px solid rgba(255,255,255,0.2)';
    close.style.color = '#cbd5e1';
    close.style.borderRadius = '10px';
    close.style.padding = '6px 10px';
    close.style.cursor = 'pointer';
    close.onclick = () => overlay.remove();

    header.appendChild(title);
    header.appendChild(close);

    const list = document.createElement('div');
    list.style.display = 'grid';
    list.style.gap = '10px';

    links.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = item.label;
        btn.style.marginTop = '0';

        btn.onclick = async () => {
            track('share_platform_click', { platform: item.label, archetype: payload.archetype });

            try {
                if (item.href) {
                    window.open(item.href, '_blank', 'noopener,noreferrer');
                } else if (item.onClick) {
                    await item.onClick();
                }
            } finally {
                overlay.remove();
            }
        };

        list.appendChild(btn);
    });

    panel.appendChild(header);
    panel.appendChild(list);
    overlay.appendChild(panel);

    // Click outside closes
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
}
