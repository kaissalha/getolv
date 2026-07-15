"use client";

import { useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";

import { useLogger } from "@getolv/logger/client";
import { Skeleton } from "@getolv/ui/components/skeleton";
import { toast } from "@getolv/ui/components/sonner";
import { cn } from "@getolv/ui/lib/utils";

import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerProps = {
	url: string;
	maxWidth?: number;
	className?: string;
};

export const PdfViewer = ({ url, className }: PdfViewerProps) => {
	const [numPages, setNumPages] = useState<number>();
	const [error, setError] = useState<Error | null>(null);
	const logger = useLogger();

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
		setError(null);
	};

	const onDocumentLoadError = (err: Error) => {
		setError(err);
		logger.error({
			error: err,
			message: "Error loading PDF in PdfViewer",
			metadata: {
				url,
			},
		});
		if (process.env.NODE_ENV === "development") {
			// eslint-disable-next-line no-console
			console.error("[PdfViewer] onLoadError", err, { url });
		}
		toast.error("Failed to load PDF", { description: err.message });
	};

	return (
		<div
			className={cn(
				"flex flex-col size-full max-h-[calc(100vh-(--spacing(24)))] overflow-scroll pb-24",
				className
			)}
		>
			<Document
				key={url}
				file={url}
				className='flex flex-col gap-3 pb-3'
				onLoadSuccess={onDocumentLoadSuccess}
				onLoadError={onDocumentLoadError}
				loading={<Skeleton className='w-full h-[calc(100vh-(--spacing(24)))]' />}
				error={
					<div className='flex flex-col items-center justify-center p-8 text-center'>
						<p className='text-sm text-muted-foreground'>
							Failed to load PDF. {error?.message || "The file may be corrupted or unsupported."}
						</p>
					</div>
				}
			>
				{numPages &&
					Array.from(new Array(numPages), (_, index) => (
						<div key={`${url}_${index + 1}`} className='flex justify-center'>
							<Page pageNumber={index + 1} renderAnnotationLayer={false} renderTextLayer={true} />
						</div>
					))}
			</Document>
		</div>
	);
};
