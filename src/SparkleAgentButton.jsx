import { useEffect, useRef, useState } from 'react';
import styles from './SparkleAgentButton.module.css';

const sparklePath = 'M6.937 3.846L7.75 1l.813 2.846a4.5 4.5 0 0 0 2.853 2.853l2.847.813-2.846.813a4.5 4.5 0 0 0-2.854 2.853L7.75 14.5l-.813-2.846a4.5 4.5 0 0 0-2.853-2.853L1.238 7.75l2.846-.813a4.5 4.5 0 0 0 2.853-2.853Z';

function Sparkle({ className }) {
    return (
        <svg className={className} viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d={sparklePath} fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SparkleAgentButton() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showTrigger, setShowTrigger] = useState(true);
    const openingAgent = useRef(false);

    const toggleChat = () => {
        if (isChatOpen) {
            setIsChatOpen(false);
            return;
        }
        openingAgent.current = true;
        setIsChatOpen(true);
        window.setTimeout(() => { openingAgent.current = false; }, 500);
    };

    useEffect(() => {
        const agent = document.querySelector('elevenlabs-convai');
        if (!agent) return undefined;

        agent.classList.toggle('agent-open', isChatOpen);
        agent.classList.toggle('agent-closed', !isChatOpen);
        const visibilityTimer = window.setTimeout(() => setShowTrigger(!isChatOpen), isChatOpen ? 300 : 0);

        if (!isChatOpen) return () => window.clearTimeout(visibilityTimer);

        const handleAgentClick = event => {
            const button = event.target.closest?.('button');
            const label = button?.getAttribute('aria-label') || button?.getAttribute('title') || '';
            if (!openingAgent.current && /close/i.test(label)) setIsChatOpen(false);
        };

        let shadowRoot;
        let shadowRootTimer;
        let overlayObserver;
        const connectToAgent = () => {
            shadowRoot = agent.shadowRoot;
            if (!shadowRoot) {
                shadowRootTimer = window.setTimeout(connectToAgent, 50);
                return;
            }

            const syncAgentOverlays = () => {
                shadowRoot.querySelectorAll('.overlay').forEach(overlay => {
                    const isInteractiveOverlay = Boolean(overlay.querySelector('button, input, textarea'));
                    overlay.style.setProperty('pointer-events', isInteractiveOverlay ? 'auto' : 'none', 'important');
                });
            };

            syncAgentOverlays();
            overlayObserver = new MutationObserver(syncAgentOverlays);
            overlayObserver.observe(shadowRoot, { childList: true, subtree: true });
            shadowRoot.addEventListener('click', handleAgentClick);
            shadowRoot.querySelector('button')?.click();
        };
        connectToAgent();

        return () => {
            window.clearTimeout(visibilityTimer);
            window.clearTimeout(shadowRootTimer);
            overlayObserver?.disconnect();
            shadowRoot?.removeEventListener('click', handleAgentClick);
        };
    }, [isChatOpen]);

    return (
        <div className={`${styles.sp} ${isChatOpen ? styles.open : ''}`}>
            {showTrigger && <button type="button" className={`${styles.sparkleButton} ${isChatOpen ? styles.isClosing : styles.isVisible}`} aria-expanded={isChatOpen} aria-controls="elevenlabs-agent" onClick={toggleChat}>
                <span className={styles.spark}></span>
                <span className={styles.backdrop}></span>
                <svg className={styles.sparkle} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M14.187 8.096 15 5.25l.813 2.846a4.5 4.5 0 0 0 2.854 2.854L21.75 12l-2.846.813a4.5 4.5 0 0 0-2.854 2.854L15 18.75l-.813-2.846a4.5 4.5 0 0 0-2.854-2.854L8.25 12l2.846-.813a4.5 4.5 0 0 0 2.854-2.854Z" />
                    <path d="m6 14.25-.259 1.035a4.5 4.5 0 0 1-2.456 2.456L2.25 18l1.035.259a4.5 4.5 0 0 1 2.456 2.456L6 21.75l.259-1.035a4.5 4.5 0 0 1 2.456-2.456L9.75 18l-1.035-.259a4.5 4.5 0 0 1-2.456-2.456Z" />
                    <path d="m6.5 4-.197.592a1.5 1.5 0 0 1-.772.772L5 5.5l.592.197a1.5 1.5 0 0 1 .772.772L6.5 7l.197-.531a1.5 1.5 0 0 1 .772-.772L8 5.5l-.531-.197a1.5 1.5 0 0 1-.772-.772Z" />
                </svg>
                <span className={styles.text}>
                    <span className={styles.desktopText}>Ask Anything!</span>
                    <span className={styles.mobileText}>Ask Me!</span>
                </span>
            </button>}
            <div className={styles.bodydrop}></div>
            <span aria-hidden="true" className={styles.particlePen}>{Array.from({ length: 12 }, (_, index) => <Sparkle key={index} className={styles.particle} />)}</span>
        </div>
    );
}

export default SparkleAgentButton;
