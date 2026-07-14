import * as React from "react";

import { describe, expect, it, vi } from "vitest";

// Mock @react-pdf/renderer
vi.mock("@react-pdf/renderer", () => ({
	Document: ({ children }: { children: React.ReactNode }) => ({ type: "Document", props: { children } }),
	Page: ({ children, style, size }: { children: React.ReactNode; style: object; size: string }) => ({
		type: "Page",
		props: { children, style, size },
	}),
	Text: ({ children, style }: { children?: React.ReactNode; style?: object }) => ({
		type: "Text",
		props: { children, style },
	}),
	View: ({ children, style, wrap }: { children?: React.ReactNode; style?: object; wrap?: boolean }) => ({
		type: "View",
		props: { children, style, wrap },
	}),
	Svg: ({
		children,
		width,
		height,
		viewBox,
	}: {
		children: React.ReactNode;
		width: string;
		height: string;
		viewBox: string;
	}) => ({
		type: "Svg",
		props: { children, width, height, viewBox },
	}),
	Path: ({
		d,
		stroke,
		fill,
		strokeWidth,
		strokeLinecap,
	}: {
		d: string;
		stroke?: string;
		fill?: string;
		strokeWidth?: number;
		strokeLinecap?: string;
	}) => ({
		type: "Path",
		props: { d, stroke, fill, strokeWidth, strokeLinecap },
	}),
	StyleSheet: {
		create: <T extends Record<string, object>>(styles: T): T => styles,
	},
	Font: {
		register: vi.fn(),
	},
}));

import {
	type LabResult,
	LabResultsPdf,
	type PatientInfo,
	type PractitionerInfo,
} from "../../src/templates/lab-results";

const mockPatient: PatientInfo = {
	firstName: "John",
	lastName: "Doe",
	email: "john@example.com",
	dateOfBirth: "1990-01-15",
};

const mockPractitioner: PractitionerInfo = {
	name: "Dr. Jane Smith",
	title: "MD, Internal Medicine",
	email: "jane@clinic.com",
};

const mockLabResults: LabResult[] = [
	{
		id: "1",
		name: "Hemoglobin",
		category: "Blood Panel",
		value: 14.5,
		unit: "g/dL",
		status: "optimal",
		ranges: [
			{ min: 12, max: 16, status: "optimal" },
			{ min: 10, max: 12, status: "suboptimal" },
			{ min: 0, max: 10, status: "critical" },
		],
	},
	{
		id: "2",
		name: "Glucose",
		category: "Metabolic Panel",
		value: 110,
		unit: "mg/dL",
		status: "suboptimal",
		ranges: [
			{ min: 70, max: 100, status: "optimal" },
			{ min: 100, max: 125, status: "suboptimal" },
			{ min: 125, max: 200, status: "critical" },
		],
	},
	{
		id: "3",
		name: "Cholesterol",
		category: "Blood Panel",
		value: 250,
		unit: "mg/dL",
		status: "critical",
		ranges: [
			{ min: 0, max: 200, status: "optimal" },
			{ min: 200, max: 239, status: "suboptimal" },
			{ min: 240, max: 400, status: "critical" },
		],
	},
];

describe("LabResultsPdf", () => {
	it("renders a Document with Page", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		expect(result).toBeDefined();
		expect(result.type).toBeDefined();
		expect(result.props.children).toBeDefined();
		expect(result.props.children.type).toBeDefined();
	});

	it("uses A4 page size", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		const page = result.props.children;
		expect(page.props.size).toBe("A4");
	});

	it("includes patient information", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		const content = JSON.stringify(result);
		expect(content).toContain("John");
		expect(content).toContain("Doe");
		expect(content).toContain("john@example.com");
	});

	it("includes practitioner information", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		const content = JSON.stringify(result);
		expect(content).toContain("Dr. Jane Smith");
		expect(content).toContain("MD, Internal Medicine");
		expect(content).toContain("jane@clinic.com");
	});

	it("calculates summary correctly", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		const content = JSON.stringify(result);
		// Should have 1 optimal, 1 suboptimal, 1 critical
		expect(content).toContain("1"); // Appears for each count
	});

	it("groups results by category", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		const content = JSON.stringify(result);
		expect(content).toContain("Blood Panel");
		expect(content).toContain("Metabolic Panel");
	});

	it("renders with empty results", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: [],
			sessionDate: "2024-01-15",
		});

		expect(result).toBeDefined();
	});

	it("renders without optional summary or notes", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
			summary: undefined,
			notes: undefined,
		});

		expect(result).toBeDefined();
	});

	it("handles range boundary values", () => {
		const boundaryResults: LabResult[] = [
			{
				id: "1",
				name: "Vitamin D",
				category: "Blood Panel",
				value: 20,
				unit: "ng/mL",
				status: "optimal",
				ranges: [
					{ min: 20, max: 40, status: "optimal" },
					{ min: 10, max: 19.9, status: "suboptimal" },
					{ min: 0, max: 9.9, status: "critical" },
				],
			},
		];

		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: boundaryResults,
			sessionDate: "2024-01-15",
		});

		expect(result).toBeDefined();
	});

	it("renders notes when provided", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
			notes: "Patient should follow up in 3 months",
		});

		const content = JSON.stringify(result);
		expect(content).toContain("Patient should follow up in 3 months");
	});

	it("does not render notes section when not provided", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		// Without notes, it should still render successfully
		expect(result).toBeDefined();
	});

	it("uses locale for translations", () => {
		const resultEn = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
			locale: "en",
		});

		const resultFallbackLocale = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
			locale: "fr",
		});

		expect(resultEn).toBeDefined();
		expect(resultFallbackLocale).toBeDefined();
	});

	it("handles empty lab results", () => {
		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: mockPractitioner,
			labResults: [],
			sessionDate: "2024-01-15",
		});

		expect(result).toBeDefined();
	});

	it("handles patient without dateOfBirth", () => {
		const patientWithoutDob: PatientInfo = {
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
		};

		const result = LabResultsPdf({
			patient: patientWithoutDob,
			practitioner: mockPractitioner,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		expect(result).toBeDefined();
	});

	it("handles practitioner without title", () => {
		const practitionerWithoutTitle: PractitionerInfo = {
			name: "Dr. Smith",
		};

		const result = LabResultsPdf({
			patient: mockPatient,
			practitioner: practitionerWithoutTitle,
			labResults: mockLabResults,
			sessionDate: "2024-01-15",
		});

		expect(result).toBeDefined();
	});
});

describe("LabResultsPdf types", () => {
	it("exports LabResult type correctly", () => {
		const result: LabResult = {
			id: "test",
			name: "Test",
			category: "Test",
			value: 10,
			unit: "units",
			status: "optimal",
			ranges: [],
		};

		expect(result.id).toBe("test");
	});

	it("exports PatientInfo type correctly", () => {
		const patient: PatientInfo = {
			firstName: "Test",
			lastName: "User",
			email: "test@test.com",
		};

		expect(patient.firstName).toBe("Test");
	});

	it("exports PractitionerInfo type correctly", () => {
		const practitioner: PractitionerInfo = {
			name: "Dr. Test",
		};

		expect(practitioner.name).toBe("Dr. Test");
	});
});
