import React from "react";

import { NoteCardSkeleton } from "./note-card";

export const NotesGridSkeleton = () => {
	return (
		<div className='px-4 md:px-5'>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{Array.from({ length: 8 }).map((_, i) => (
					<NoteCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
};
