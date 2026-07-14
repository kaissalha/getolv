import { Suspense, type ReactNode } from "react";

import { PatientHeader } from "./components/patient-header";
import { PatientNav } from "./components/patient-nav";

type TabsLayoutProps = {
	children: ReactNode;
};

export default function TabsLayout({ children }: TabsLayoutProps) {
	return (
		<div className='relative flex min-h-0 flex-1 flex-col'>
			<div className='z-50 flex shrink-0 flex-col bg-background'>
				<Suspense>
					<PatientHeader />
					<PatientNav />
				</Suspense>
			</div>
			<div className='relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain'>
				<Suspense>{children}</Suspense>
			</div>
		</div>
	);
}
