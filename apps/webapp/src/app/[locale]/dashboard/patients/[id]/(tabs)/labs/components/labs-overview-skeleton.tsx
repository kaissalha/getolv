"use client";

import { Frame, FrameFooter, FrameHeader, FramePanel } from "@starter/ui/components/frame";
import { Skeleton } from "@starter/ui/components/skeleton";

export const LabsOverviewSkeleton = () => (
	<div className='flex flex-col gap-6 px-4 pb-52 pt-4'>
		<Frame>
			<FrameHeader className='flex-row items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Skeleton className='h-4 w-4 rounded-full' />
					<Skeleton className='h-5 w-24' />
				</div>
				<Skeleton className='h-8 w-36 rounded-full' />
			</FrameHeader>
			<FramePanel>
				<div className='flex flex-col gap-2.5'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-[95%]' />
					<Skeleton className='h-4 w-[88%]' />
					<Skeleton className='h-4 w-[70%]' />
				</div>
			</FramePanel>
			<FrameFooter>
				<div className='flex items-center gap-3'>
					<Skeleton className='h-5 w-16 rounded-full' />
					<Skeleton className='h-5 w-20 rounded-full' />
					<Skeleton className='h-5 w-14 rounded-full' />
				</div>
			</FrameFooter>
		</Frame>

		<div className='grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-4'>
			{Array.from({ length: 4 }).map((_, i) => (
				<Frame key={i}>
					<FrameHeader className='flex-row items-start justify-between gap-4'>
						<Skeleton className='h-5 w-28' />
						<div className='flex gap-1.5'>
							<Skeleton className='h-5 w-14 rounded-full' />
							<Skeleton className='h-5 w-16 rounded-full' />
						</div>
					</FrameHeader>
					<FramePanel className='flex flex-col divide-y p-0!'>
						{Array.from({ length: 3 }).map((_, j) => (
							<div key={j} className='flex items-center justify-between px-4 py-3'>
								<div className='flex flex-col gap-1.5'>
									<Skeleton className='h-4 w-32' />
									<Skeleton className='h-3 w-20' />
								</div>
								<Skeleton className='h-6 w-16' />
							</div>
						))}
					</FramePanel>
				</Frame>
			))}
		</div>
	</div>
);
