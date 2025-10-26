"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Detail = { start: number; end: number; error: string; suggestion: string; span?: string };

export function TooltipPortal({
	onAccept,
	onDismiss,
	onExplain,
}: {
	onAccept: (d: { start: number; end: number; suggestion: string; error?: string }) => void;
	onDismiss: (d: { start: number; end: number; error: string }) => void;
	onExplain: (d: { start?: number; end?: number; error: string; span?: string }) => void;
}) {
	const [mounted, setMounted] = useState(false);
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const bridgeRef = useRef<HTMLDivElement | null>(null);
	const activeTargetRef = useRef<HTMLElement | null>(null);
	const overTarget = useRef(false);
	const overOverlay = useRef(false);
	const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

	useEffect(() => {
		const ensureNodes = () => {
			if (!tooltipRef.current) {
				const el = document.createElement('div');
				el.id = 'llm-tooltip';
				el.style.cssText = 'display:none;position:fixed;left:0;top:0;background:#77C5C5;padding:12px;border-radius:12px;z-index:100000;min-width:240px;max-width:360px;box-shadow:0 10px 40px rgba(0,0,0,0.3);flex-direction:column;gap:10px;pointer-events:auto;';
				el.addEventListener('mouseenter', () => { overOverlay.current = true; cancelHide(); });
				el.addEventListener('mouseleave', () => { overOverlay.current = false; scheduleHide(); });
				document.body.appendChild(el);
				tooltipRef.current = el;
			}
			if (!bridgeRef.current) {
				const el = document.createElement('div');
				el.id = 'llm-tooltip-bridge';
				el.style.cssText = 'display:none;position:fixed;left:0;top:0;width:10px;height:10px;background:transparent;z-index:100000;pointer-events:auto;';
				el.addEventListener('mouseenter', () => { overOverlay.current = true; cancelHide(); });
				el.addEventListener('mouseleave', () => { overOverlay.current = false; scheduleHide(); });
				document.body.appendChild(el);
				bridgeRef.current = el;
			}
		};
		ensureNodes();

		const cancelHide = () => { if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; } };
		const scheduleHide = () => { cancelHide(); hideTimer.current = setTimeout(() => { if (!overTarget.current && !overOverlay.current) hideNow(); }, 600); };
		const hideNow = () => { if (tooltipRef.current) tooltipRef.current.style.display = 'none'; if (bridgeRef.current) bridgeRef.current.style.display = 'none'; activeTargetRef.current = null; };

		const applyTheme = (el: HTMLElement) => {
			const dark = document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
			el.style.background = dark ? '#302C2A' : '#77C5C5';
			return dark;
		};

		const buildContent = (target: HTMLElement) => {
			const error = target.getAttribute('data-error') || '';
			const suggestion = target.getAttribute('data-suggestion') || '';
			if (!error || !suggestion || !tooltipRef.current) return false;
			const tooltip = tooltipRef.current;
			tooltip.innerHTML = '';
			const dark = applyTheme(tooltip);
			const mk = (tag: string, css: string, text?: string) => { const el = document.createElement(tag); el.style.cssText = css; if (text) el.innerHTML = text; return el; };
			const errorBubble = mk('div', `background:${dark ? '#7f1d1d' : '#fee2e2'};color:${dark ? '#fecaca' : '#991b1b'};padding:10px 14px;border-radius:8px;font-size:0.9rem;font-weight:500;border-left:4px solid #dc2626;`, error);
			const suggestionBubble = mk('div', `background:${dark ? '#064e3b' : '#d1fae5'};color:${dark ? '#6ee7b7' : '#065f46'};padding:10px 14px;border-radius:8px;font-size:0.9rem;font-weight:500;border-left:4px solid #10b981;`, '✓ ' + suggestion);
			const controls = mk('div', 'display:flex;gap:8px;justify-content:flex-end;margin-top:6px;');
			const btn = (label: string, bg: string) => mk('button', `background:${bg};color:white;padding:6px 10px;border-radius:6px;font-size:0.85rem;font-weight:600;border:none;cursor:pointer;`, label) as HTMLButtonElement;
			const dismissBtn = btn('Dismiss', '#6b7280');
			const explainBtn = btn('Explain', '#3b82f6');
			const acceptBtn = btn('Accept', '#10b981');
			controls.append(dismissBtn, explainBtn, acceptBtn);
			dismissBtn.onclick = (ev) => { ev.preventDefault(); ev.stopPropagation(); const start = parseInt(target.getAttribute('data-start') || '0', 10); const end = parseInt(target.getAttribute('data-end') || '0', 10); onDismiss({ start, end, error }); hideNow(); };
			explainBtn.onclick = (ev) => { ev.preventDefault(); ev.stopPropagation(); const start = parseInt(target.getAttribute('data-start') || '0', 10); const end = parseInt(target.getAttribute('data-end') || '0', 10); const span = target.innerText || ''; onExplain({ start, end, error, span }); };
			acceptBtn.onclick = (ev) => { ev.preventDefault(); ev.stopPropagation(); const start = parseInt(target.getAttribute('data-start') || '0', 10); const end = parseInt(target.getAttribute('data-end') || '0', 10); onAccept({ start, end, suggestion, error }); hideNow(); };
			tooltip.append(errorBubble, suggestionBubble, controls);
			return true;
		};

		const positionForTarget = (target: HTMLElement) => {
			const tooltip = tooltipRef.current!; const bridge = bridgeRef.current!;
			const rect = target.getBoundingClientRect();
			tooltip.style.display = 'flex';
			let left = rect.left; let top = rect.bottom + 6;
			tooltip.style.left = left + 'px'; tooltip.style.top = top + 'px';
			const tRect = tooltip.getBoundingClientRect();
			if (left + tRect.width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - tRect.width - 8);
			if (left < 8) left = 8;
			let flipped = false;
			if (top + tRect.height > window.innerHeight - 8) { top = Math.max(8, rect.top - tRect.height - 6); flipped = true; }
			tooltip.style.left = left + 'px'; tooltip.style.top = top + 'px';
			// Bridge
			const t2 = tooltip.getBoundingClientRect();
			const bridgeLeft = Math.min(left, rect.left);
			const bridgeRight = Math.max(left + t2.width, rect.right);
			const width = Math.max(16, bridgeRight - bridgeLeft);
			let bTop = 0, bHeight = 0;
			if (!flipped) { bTop = rect.bottom; bHeight = Math.max(8, t2.top - rect.bottom); } else { bTop = t2.bottom; bHeight = Math.max(8, rect.top - t2.bottom); }
			bridge.style.left = bridgeLeft + 'px'; bridge.style.top = bTop + 'px'; bridge.style.width = width + 'px'; bridge.style.height = bHeight + 'px'; bridge.style.display = 'block';
		};

		const onMouseOver = (e: MouseEvent) => {
			const t = e.target as HTMLElement;
			if (!t) return;
			if ((tooltipRef.current && tooltipRef.current.contains(t)) || (bridgeRef.current && bridgeRef.current.contains(t))) return;
			const target = (t.closest('.highlight-tooltip') as HTMLElement) || null;
			if (target) {
				activeTargetRef.current = target;
				overTarget.current = true;
				ensureNodes();
				if (buildContent(target)) {
					applyTheme(tooltipRef.current!);
					positionForTarget(target);
					if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
				}
			}
		};
		const onMouseOut = (e: MouseEvent) => {
			const t = e.target as HTMLElement;
			if (!t) return;
			const active = activeTargetRef.current;
			if (active && (t === active || active.contains(t))) {
				overTarget.current = false;
				if (hideTimer.current) clearTimeout(hideTimer.current);
				hideTimer.current = setTimeout(() => { if (!overTarget.current && !overOverlay.current) hideNow(); }, 600);
			}
		};
		const onScroll = () => { const active = activeTargetRef.current; if (active && tooltipRef.current && tooltipRef.current.style.display !== 'none') positionForTarget(active); };
		const onResize = onScroll;

		document.addEventListener('mouseover', onMouseOver);
		document.addEventListener('mouseout', onMouseOut);
		window.addEventListener('scroll', onScroll, true);
		window.addEventListener('resize', onResize);
		return () => {
			document.removeEventListener('mouseover', onMouseOver);
			document.removeEventListener('mouseout', onMouseOut);
			window.removeEventListener('scroll', onScroll, true);
			window.removeEventListener('resize', onResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onAccept, onDismiss, onExplain]);

	if (!mounted) return null;
	return createPortal(<></>, document.body);
}
