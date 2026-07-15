"use client";

import { Skeleton } from "@getolv/ui/components/skeleton";

export const CalendarSkeleton = () => {
	return (
		<div className='flex h-dvh w-full flex-col overflow-hidden bg-background'>
			<div className='flex h-14 items-center justify-between border-b px-4'>
				<div className='flex items-center gap-3'>
					<Skeleton className='size-5 rounded' />
					<Skeleton className='h-5 w-20' />
				</div>
				<div className='flex items-center gap-2'>
					<Skeleton className='size-8 rounded-md' />
					<Skeleton className='h-8 w-24 rounded-md' />
					<Skeleton className='size-8 rounded-md' />
				</div>
			</div>

			<div className='hidden shrink-0 border-b p-2 md:block'>
				<div className='grid grid-cols-[4rem_repeat(7,1fr)] gap-2'>
					<div />
					{Array.from({ length: 7 }).map((_, i) => (
						<div key={`header-${i}`} className='flex flex-col items-center gap-1 py-2'>
							<Skeleton className='h-3 w-8' />
							<Skeleton className='size-9 rounded-full' />
						</div>
					))}
				</div>
			</div>

			<div className='flex-1 overflow-hidden'>
				<div className='grid h-full grid-cols-[4rem_1fr] md:grid-cols-[4rem_repeat(7,1fr)]'>
					<div className='flex flex-col gap-4 border-e py-4 pe-2'>
						{Array.from({ length: 12 }).map((_, i) => (
							<Skeleton key={`time-${i}`} className='ms-auto h-3 w-10' />
						))}
					</div>
					{Array.from({ length: 7 }).map((_, i) => (
						<div key={`col-${i}`} className='relative hidden border-e p-2 last:border-e-0 md:block'>
							{i < 3 && (
								<Skeleton
									className='h-14 w-full rounded-lg'
									style={{ marginTop: `${40 + i * 80}px` }}
								/>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
