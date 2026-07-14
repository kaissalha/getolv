"use client";

import { Frame, FrameFooter, FrameHeader, FramePanel } from "@starter/ui/components/frame";
import { Skeleton } from "@starter/ui/components/skeleton";

export const WorkoutOverviewSkeleton = () => (
	<div className='flex flex-col gap-6 px-4 pb-52 pt-4'>
		<Frame>
			<FrameHeader className='flex-row items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Skeleton className='h-4 w-4 rounded-full' />
					<Skeleton className='h-5 w-40' />
				</div>
				<Skeleton className='h-8 w-36 rounded-full' />
			</FrameHeader>
			<FramePanel>
				<div className='flex flex-col gap-2.5'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-[90%]' />
					<Skeleton className='h-4 w-[70%]' />
				</div>
			</FramePanel>
			<FrameFooter>
				<div className='flex items-center gap-3'>
					<Skeleton className='h-5 w-32 rounded-full' />
					<Skeleton className='h-5 w-16 rounded-full' />
					<Skeleton className='h-5 w-20 rounded-full' />
					<Skeleton className='h-5 w-20 rounded-full' />
				</div>
			</FrameFooter>
		</Frame>

		<Frame>
			<FrameHeader>
				<Skeleton className='h-5 w-48' />
			</FrameHeader>
			<FramePanel className='flex flex-col p-0!'>
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className='flex items-center gap-4 border-t px-4 py-3 first:border-t-0'>
						<Skeleton className='size-12 shrink-0 rounded-lg' />
						<div className='flex flex-1 flex-col gap-1.5'>
							<Skeleton className='h-4 w-40' />
							<Skeleton className='h-3 w-24' />
						</div>
						<Skeleton className='h-4 w-16' />
					</div>
				))}
			</FramePanel>
		</Frame>
	</div>
);
