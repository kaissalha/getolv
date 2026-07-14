"use client";

import { useCallback, useEffect, useState } from "react";

type PdfBlobPreviewInput = {
	base64: string;
	filename?: string;
	mimeType?: string;
};

const PDF_MIME_TYPE = "application/pdf";

const base64ToBlob = ({ base64, mimeType = PDF_MIME_TYPE }: PdfBlobPreviewInput) => {
	const byteCharacters = atob(base64);
	const byteNumbers = new Array(byteCharacters.length);

	for (let index = 0; index < byteCharacters.length; index += 1) {
		byteNumbers[index] = byteCharacters.charCodeAt(index);
	}

	return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
};

export const usePdfBlobPreview = () => {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);

	const revokePdfUrl = useCallback((url: string | null) => {
		if (url) {
			URL.revokeObjectURL(url);
		}
	}, []);

	const closePreview = useCallback(() => {
		setIsPreviewOpen(false);
		setPdfUrl((currentUrl) => {
			revokePdfUrl(currentUrl);
			return null;
		});
	}, [revokePdfUrl]);

	const openPreview = useCallback(
		({ base64, mimeType }: PdfBlobPreviewInput) => {
			const url = URL.createObjectURL(base64ToBlob({ base64, mimeType }));

			setPdfUrl((currentUrl) => {
				revokePdfUrl(currentUrl);
				return url;
			});
			setIsPreviewOpen(true);
		},
		[revokePdfUrl]
	);

	const downloadPdf = useCallback(({ base64, filename, mimeType }: PdfBlobPreviewInput) => {
		const url = URL.createObjectURL(base64ToBlob({ base64, mimeType }));
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = filename ?? "document.pdf";
		anchor.click();
		URL.revokeObjectURL(url);
	}, []);

	useEffect(() => {
		return () => {
			revokePdfUrl(pdfUrl);
		};
	}, [pdfUrl, revokePdfUrl]);

	return {
		closePreview,
		downloadPdf,
		isPreviewOpen,
		openPreview,
		pdfUrl,
	};
};
