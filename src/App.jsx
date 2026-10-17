import { useEffect, useState } from 'react';
import legacyTemplate from './legacy-template.html?raw';
import legacyScript from '../script.js?raw';
import SparkleAgentButton from './SparkleAgentButton.jsx';

const bodyMarkup = legacyTemplate.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
const revealSelector = '.section-header, .about-text, .profile-image, .certificate-image';
function useInView(selector) {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        elements.forEach(element => element.classList.add('reveal-up'));

        if (reducedMotion) {
            elements.forEach(element => element.classList.add('reveal-visible'));
            return undefined;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        elements.forEach(element => observer.observe(element));
        return () => observer.disconnect();
    }, [selector]);
}

function App() {
    const [markup] = useState(bodyMarkup);

    useInView(revealSelector);

    useEffect(() => {
        window.dispatchEvent(new Event('portfolio:ready'));
    }, []);

    useEffect(() => {
        let behaviorScript;
        let readinessTimer;

        const initializeBehavior = () => {
            if (!window.lucide) {
                readinessTimer = window.setTimeout(initializeBehavior, 50);
                return;
            }

            const iconFallbacks = {
                github: 'code-2',
                linkedin: 'briefcase-business',
                instagram: 'camera'
            };
            document.querySelectorAll('i[data-lucide]').forEach(icon => {
                const fallback = iconFallbacks[icon.getAttribute('data-lucide')];
                if (fallback) icon.setAttribute('data-lucide', fallback);
            });

            behaviorScript = document.createElement('script');
            behaviorScript.textContent = legacyScript
                .replace(
                    "document.addEventListener('DOMContentLoaded', () => {",
                    '(() => {'
                )
                .replace(/\n\}\);\s*$/, '\n})();');
            document.body.appendChild(behaviorScript);
        };

        initializeBehavior();

        return () => {
            window.clearTimeout(readinessTimer);
            behaviorScript?.remove();
        };
    }, []);

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: markup }} />
            <SparkleAgentButton />
        </>
    );
}

export default App;
