import { HydrateClient } from "@/lib/server/react-query";

import { DietOverview } from "./components/diet-overview";

export default function DietPage() {
	return (
		<HydrateClient>
			<div className='py-4'>
				<DietOverview />
			</div>
		</HydrateClient>
	);
}
