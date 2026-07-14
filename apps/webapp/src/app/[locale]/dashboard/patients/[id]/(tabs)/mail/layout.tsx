import type { ReactNode } from "react";

type PatientMailLayoutProps = {
	children: ReactNode;
};

export default function PatientMailLayout({ children }: PatientMailLayoutProps) {
	return <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>{children}</div>;
}
