"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@getolv/ui/lib/utils";

type ShadowDomHtmlProps = {
	html: string;
	className?: string;
};

const BASE_STYLES = `
<style>
:host {
	display: block;
	line-height: 1.5;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	font-size: 14px;
	word-break: break-word;
	overflow-wrap: break-word;
	color: inherit;
	max-width: 100%;
	overflow-x: auto;
}
body, div, p, span, td, th {
	margin: 0;
}
img,
video,
iframe {
	max-width: 100%;
	height: auto;
}
a {
	color: var(--color-primary, #2563eb);
}
pre {
	white-space: pre-wrap;
	overflow-x: auto;
}
blockquote {
	border-inline-start: 3px solid #d1d5db;
	padding-inline-start: 12px;
	margin-inline-start: 0;
	color: #6b7280;
}
details.quoted-toggle summary {
	cursor: pointer;
	user-select: none;
}
details.quoted-toggle summary::-webkit-details-marker {
	display: none;
}
table {
	border-collapse: collapse;
	max-width: 100%;
}
::selection {
	background: #b3d4fc;
	text-shadow: none;
}
</style>
`;

export const ShadowDomHtml = ({ html, className }: ShadowDomHtmlProps) => {
	const hostRef = useRef<HTMLDivElement>(null);
	const shadowRootRef = useRef<ShadowRoot | null>(null);

	useEffect(() => {
		if (!hostRef.current || shadowRootRef.current) return;
		shadowRootRef.current = hostRef.current.attachShadow({ mode: "open" });
	}, []);

	useEffect(() => {
		if (!shadowRootRef.current) return;
		shadowRootRef.current.innerHTML = `${BASE_STYLES}${html}`;
	}, [html]);

	const handleImageError = useCallback((e: Event) => {
		const target = e.target as HTMLImageElement;
		if (target.tagName === "IMG") {
			target.style.display = "none";
		}
	}, []);

	useEffect(() => {
		if (!shadowRootRef.current) return;
		const root = shadowRootRef.current;

		root.addEventListener("error", handleImageError, true);

		const handleClick = (e: Event) => {
			const target = e.target as HTMLElement;
			const anchor = target.closest("a");
			if (!anchor) return;

			e.preventDefault();
			const href = anchor.getAttribute("href");
			if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
				window.open(href, "_blank", "noopener,noreferrer");
			} else if (href && href.startsWith("mailto:")) {
				window.location.href = href;
			}
		};

		root.addEventListener("click", handleClick);

		return () => {
			root.removeEventListener("error", handleImageError, true);
			root.removeEventListener("click", handleClick);
		};
	}, [html, handleImageError]);

	return <div ref={hostRef} data-base-ui-swipe-ignore='' className={cn("w-full", className)} />;
};
