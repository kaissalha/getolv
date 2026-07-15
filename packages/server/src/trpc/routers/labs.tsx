import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { db, type LabTest, labTestRangeOverrides, labTests, patientLabResults, type ReferenceRanges } from "@getolv/db";
import { LabResultsPdf, renderToBuffer } from "@getolv/pdf";

import { analyzeLabResultsCore } from "../../ai/tools/analyze-lab-results";
import {
	analyzeAndInsertLabResults,
	determineLabStatus,
	getLabCountry,
	getLabReportWithResults,
	getLabResultsBySession,
	getLabTestsCatalog,
	getLatestLabReportSummary,
	getPatientLabReports,
	getPatientLabResults,
	getPatientSessionLabResults,
	getRangesForTest,
	updateLabReportSummary,
} from "../../services/lab";
import { getPatient } from "../../services/patients";
import type { getolvRouterFactoryOptions } from "../shared";

export const createLabsRouter = ({ createTRPCRouter, organizationProcedure }: getolvRouterFactoryOptions) =>
	createTRPCRouter({
		getPatientSessionLabResults: organizationProcedure
			.input(
				z.object({
					patientSessionId: z.string(),
					patientId: z.string(),
				})
			)
			.query(async ({ input }) => getPatientSessionLabResults(input)),

		getPatientLabResults: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
				})
			)
			.query(async ({ input }) => getPatientLabResults(input)),

		getPatientLabReports: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
				})
			)
			.query(async ({ input }) => getPatientLabReports(input)),

		getLabReportWithResults: organizationProcedure
			.input(
				z.object({
					labReportId: z.string(),
				})
			)
			.query(async ({ input }) => getLabReportWithResults(input)),

		getLabReportSummary: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					sessionId: z.string().nullable().optional(),
				})
			)
			.query(async ({ input }) => getLatestLabReportSummary(input)),

		updateLabReportSummary: organizationProcedure
			.input(
				z.object({
					labReportId: z.string(),
					summary: z.string(),
				})
			)
			.mutation(async ({ input }) => updateLabReportSummary(input)),

		getLabResultsBySession: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					sessionId: z.string(),
				})
			)
			.query(async ({ input }) => getLabResultsBySession(input)),

		analyzeLabResultsFromText: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					text: z.string().min(1),
				})
			)
			.mutation(async ({ input, ctx }) => {
				const country = await getLabCountry();
				const analyzedResults = await analyzeLabResultsCore({ data: input.text, country });

				if (analyzedResults.length === 0) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "No lab results could be extracted from the text",
					});
				}

				const { report, results } = await analyzeAndInsertLabResults({
					patientId: input.patientId,
					organizationId: ctx.activeOrganizationId,
					patientSessionId: null,
					analyzedResults,
				});

				return { report, results };
			}),

		generateLabResultsPdf: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					labReportId: z.string(),
				})
			)
			.mutation(async ({ input, ctx }) => {
				const patient = await getPatient({ id: input.patientId, organizationId: ctx.activeOrganizationId });

				if (!patient) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Patient not found" });
				}

				const reportWithResults = await getLabReportWithResults({ labReportId: input.labReportId });

				if (!reportWithResults || reportWithResults.results.length === 0) {
					throw new TRPCError({ code: "NOT_FOUND", message: "No lab results found" });
				}

				const { report, results: labResults } = reportWithResults;
				const labTestIds = [...new Set(labResults.map((result) => result.labTestId))];
				const labTestsData = await db.select().from(labTests).where(inArray(labTests.id, labTestIds));
				const labTestMap = new Map<string, LabTest>(labTestsData.map((labTest) => [labTest.id, labTest]));

				const pdfLabResults = labResults.map((result) => {
					const labTest = labTestMap.get(result.labTestId);

					return {
						id: result.id,
						name: labTest?.name ?? result.name,
						code: labTest?.code,
						category: result.category,
						value: result.value,
						unit: result.unit,
						status: result.status,
						ranges: result.ranges,
					};
				});

				const reportDate = report.reportDate ?? report.createdAt;
				const sessionDate = reportDate
					? new Date(reportDate).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})
					: new Date().toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						});

				const pdfBuffer = await renderToBuffer(
					<LabResultsPdf
						patient={{
							firstName: patient.firstName,
							lastName: patient.lastName,
							email: patient.email,
						}}
						practitioner={{
							name: ctx.user.name,
							email: ctx.user.email,
						}}
						labResults={pdfLabResults}
						sessionDate={sessionDate}
						summary={report.summary ?? undefined}
					/>
				);

				return {
					base64: Buffer.from(pdfBuffer).toString("base64"),
					filename: `lab-results-${patient.firstName}-${patient.lastName}.pdf`,
				};
			}),

		getLabTestsCatalog: organizationProcedure.query(async () => {
			const country = await getLabCountry();
			return getLabTestsCatalog({ country });
		}),

		getPatientLabRangeOverrides: organizationProcedure
			.input(z.object({ patientId: z.string() }))
			.query(async ({ input }) => {
				return db
					.select({
						id: labTestRangeOverrides.id,
						labTestId: labTestRangeOverrides.labTestId,
						patientId: labTestRangeOverrides.patientId,
						ranges: labTestRangeOverrides.ranges,
						unit: labTestRangeOverrides.unit,
						labTest: labTests,
					})
					.from(labTestRangeOverrides)
					.innerJoin(labTests, eq(labTestRangeOverrides.labTestId, labTests.id))
					.where(eq(labTestRangeOverrides.patientId, input.patientId));
			}),

		getLabTestRangesForPatient: organizationProcedure
			.input(z.object({ patientId: z.string(), labTestId: z.string() }))
			.query(async ({ input }) => {
				const country = await getLabCountry();
				return getRangesForTest({
					labTestId: input.labTestId,
					patientId: input.patientId,
					country,
				});
			}),

		upsertPatientLabRangeOverride: organizationProcedure
			.input(
				z.object({
					patientId: z.string(),
					labTestId: z.string(),
					ranges: z.array(
						z.object({
							min: z.number(),
							max: z.number(),
							status: z.enum(["optimal", "suboptimal", "critical"]),
						})
					),
					unit: z.string().optional(),
				})
			)
			.mutation(async ({ input }) => {
				const [override] = await db
					.insert(labTestRangeOverrides)
					.values({
						patientId: input.patientId,
						labTestId: input.labTestId,
						ranges: input.ranges as ReferenceRanges,
						unit: input.unit,
					})
					.onConflictDoUpdate({
						target: [labTestRangeOverrides.labTestId, labTestRangeOverrides.patientId],
						set: {
							ranges: input.ranges as ReferenceRanges,
							unit: input.unit,
						},
					})
					.returning();

				return override;
			}),

		deletePatientLabRangeOverride: organizationProcedure
			.input(z.object({ patientId: z.string(), labTestId: z.string() }))
			.mutation(async ({ input }) => {
				await db
					.delete(labTestRangeOverrides)
					.where(
						and(
							eq(labTestRangeOverrides.patientId, input.patientId),
							eq(labTestRangeOverrides.labTestId, input.labTestId)
						)
					);

				return { success: true };
			}),

		getLabTestHistory: organizationProcedure
			.input(z.object({ patientId: z.string(), labTestId: z.string() }))
			.query(async ({ input }) => {
				const country = await getLabCountry();
				const rangeInfo = await getRangesForTest({
					labTestId: input.labTestId,
					patientId: input.patientId,
					country,
				});

				const history = await db
					.select({
						id: patientLabResults.id,
						value: patientLabResults.value,
						unit: patientLabResults.unit,
						ranges: patientLabResults.ranges,
						createdAt: patientLabResults.createdAt,
					})
					.from(patientLabResults)
					.where(
						and(
							eq(patientLabResults.patientId, input.patientId),
							eq(patientLabResults.labTestId, input.labTestId)
						)
					)
					.orderBy(desc(patientLabResults.createdAt))
					.limit(10);

				return history.map((item) => {
					const ranges = rangeInfo?.ranges ?? item.ranges;
					const status = determineLabStatus({ value: item.value, ranges });

					return {
						id: item.id,
						value: item.value,
						unit: rangeInfo?.unit ?? item.unit,
						status,
						createdAt: item.createdAt,
					};
				});
			}),
	});
