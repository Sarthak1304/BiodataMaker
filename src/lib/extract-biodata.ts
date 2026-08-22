import Anthropic from "@anthropic-ai/sdk";
import type { Tool } from "@anthropic-ai/sdk/resources/messages";

const EXTRACT_TOOL: Tool = {
  name: "record_biodata",
  description: "Records the structured fields extracted from an uploaded matrimonial biodata document or image.",
  input_schema: {
    type: "object",
    properties: {
      personal: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          dateOfBirth: { type: "string", description: "ISO format yyyy-mm-dd if determinable, else empty string" },
          timeOfBirth: { type: "string", description: "24-hour HH:MM if present, else empty string" },
          placeOfBirth: { type: "string" },
          height: { type: "string", description: "e.g. 5' 6\"" },
          weight: { type: "string" },
          complexion: { type: "string" },
          bloodGroup: { type: "string" },
          gender: { type: "string", enum: ["woman", "man", ""] },
          maritalStatus: { type: "string", enum: ["never-married", "divorced", "widowed", ""] },
          diet: { type: "string", enum: ["vegetarian", "non-vegetarian", "eggetarian", "vegan", ""] },
          motherTongue: { type: "string" },
          nativePlace: { type: "string" },
          languagesKnown: { type: "string" },
          hobbies: { type: "array", items: { type: "string" } },
        },
      },
      family: {
        type: "object",
        properties: {
          fatherName: { type: "string" },
          fatherOccupation: { type: "string" },
          motherName: { type: "string" },
          motherOccupation: { type: "string" },
          siblings: { type: "string" },
          familyType: { type: "string" },
          familyValues: { type: "string" },
        },
      },
      education: {
        type: "object",
        properties: {
          highestQualification: { type: "string" },
          institution: { type: "string" },
          occupation: { type: "string" },
          companyName: { type: "string" },
          annualIncome: { type: "string" },
        },
      },
      astro: {
        type: "object",
        properties: {
          religion: { type: "string" },
          caste: { type: "string" },
          subCaste: { type: "string" },
          gotra: { type: "string" },
          nakshatra: { type: "string" },
          rashi: { type: "string" },
          manglikStatus: { type: "string", enum: ["manglik", "non-manglik", "unsure", ""] },
        },
      },
      contact: {
        type: "object",
        properties: {
          phone: { type: "string", description: "digits only, no country code" },
          whatsapp: { type: "string", description: "digits only, no country code" },
          email: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          instagramHandle: { type: "string" },
        },
      },
    },
    required: ["personal", "family", "education", "astro", "contact"],
  },
};

export interface ExtractedBiodata {
  personal: Record<string, unknown>;
  family: Record<string, unknown>;
  education: Record<string, unknown>;
  astro: Record<string, unknown>;
  contact: Record<string, unknown>;
}

export class ExtractionNotConfiguredError extends Error {}

/**
 * Extracts structured biodata fields from a document (PDF/image) or plain
 * text. Every field is optional — the model is instructed to leave
 * anything it isn't confident about as an empty string, never invent data.
 */
export async function extractBiodataFromDocument(input: {
  kind: "pdf" | "image" | "text";
  base64?: string;
  mediaType?: string;
  text?: string;
}): Promise<ExtractedBiodata> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ExtractionNotConfiguredError("ANTHROPIC_API_KEY is not set.");
  }

  const anthropic = new Anthropic({ apiKey });

  const instruction =
    "Extract every matrimonial-biodata field you can confidently find in this document into the " +
    "record_biodata tool. Only include a value when it's actually present in the source — leave a " +
    "field as an empty string (or empty array for hobbies) rather than guessing or inventing anything. " +
    "Never fabricate a phone number, email, or name that isn't in the source.";

  const content: Anthropic.MessageParam["content"] =
    input.kind === "text"
      ? [{ type: "text", text: `${instruction}\n\nDocument text:\n\n${input.text}` }]
      : input.kind === "pdf"
      ? [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: input.base64! } },
          { type: "text", text: instruction },
        ]
      : [
          {
            type: "image",
            source: { type: "base64", media_type: (input.mediaType as "image/jpeg") ?? "image/jpeg", data: input.base64! },
          },
          { type: "text", text: instruction },
        ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2000,
    tools: [EXTRACT_TOOL],
    tool_choice: { type: "tool", name: "record_biodata" },
    messages: [{ role: "user", content }],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("The model didn't return structured data.");
  }

  return toolUse.input as ExtractedBiodata;
}
