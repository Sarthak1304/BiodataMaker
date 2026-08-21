import { Prisma, PrismaClient } from "@prisma/client";
import { EMPTY_BIODATA } from "../src/types/biodata";

const prisma = new PrismaClient();

const SAMPLE_PROFILES = [
  {
    email: "ananya.sharma.sample@biodatamatcher.dev",
    name: "Ananya Sharma",
    templateId: "traditional-floral",
    personal: {
      ...EMPTY_BIODATA.personal,
      fullName: "Ananya Sharma",
      dateOfBirth: "1997-03-14",
      height: `5' 4"`,
      gender: "woman",
      maritalStatus: "never-married",
      diet: "vegetarian",
      motherTongue: "Hindi",
      nativePlace: "Jaipur, Rajasthan",
      hobbies: ["Traveling", "Reading", "Yoga & Fitness"],
    },
    family: {
      ...EMPTY_BIODATA.family,
      fatherName: "Rajesh Sharma",
      fatherOccupation: "Bank Manager (Retd.)",
      motherName: "Sunita Sharma",
      motherOccupation: "Homemaker",
      siblings: "One younger brother",
    },
    education: {
      ...EMPTY_BIODATA.education,
      highestQualification: "M.Tech, Computer Science",
      institution: "IIT Bombay",
      occupation: "Software Engineer",
      companyName: "a product company, Bengaluru",
    },
    astro: { ...EMPTY_BIODATA.astro, religion: "Hindu", caste: "Brahmin", manglikStatus: "non-manglik" },
    contact: { ...EMPTY_BIODATA.contact, phone: "98765 43210", email: "ananya.sharma.sample@biodatamatcher.dev", city: "Bengaluru", state: "Karnataka" },
  },
  {
    email: "rahul.mehta.sample@biodatamatcher.dev",
    name: "Rahul Mehta",
    templateId: "modern-minimal",
    personal: {
      ...EMPTY_BIODATA.personal,
      fullName: "Rahul Mehta",
      dateOfBirth: "1994-07-22",
      height: `5' 10"`,
      gender: "man",
      maritalStatus: "never-married",
      diet: "non-vegetarian",
      motherTongue: "Gujarati",
      nativePlace: "Ahmedabad, Gujarat",
      hobbies: ["Cricket", "Trekking"],
    },
    family: {
      ...EMPTY_BIODATA.family,
      fatherName: "Suresh Mehta",
      fatherOccupation: "Business Owner",
      motherName: "Deepa Mehta",
      motherOccupation: "Teacher",
      siblings: "One elder sister",
    },
    education: {
      ...EMPTY_BIODATA.education,
      highestQualification: "MBA, Finance",
      institution: "IIM Ahmedabad",
      occupation: "Product Manager",
      companyName: "a fintech startup, Mumbai",
    },
    astro: { ...EMPTY_BIODATA.astro, religion: "Hindu", caste: "Vaishnav", manglikStatus: "manglik" },
    contact: { ...EMPTY_BIODATA.contact, phone: "91234 56780", email: "rahul.mehta.sample@biodatamatcher.dev", city: "Mumbai", state: "Maharashtra" },
  },
  {
    email: "kavya.reddy.sample@biodatamatcher.dev",
    name: "Kavya Reddy",
    templateId: "traditional-floral",
    personal: {
      ...EMPTY_BIODATA.personal,
      fullName: "Kavya Reddy",
      dateOfBirth: "1999-11-02",
      height: `5' 3"`,
      gender: "woman",
      maritalStatus: "never-married",
      diet: "vegetarian",
      motherTongue: "Telugu",
      nativePlace: "Hyderabad, Telangana",
      hobbies: ["Classical Dance", "Painting"],
    },
    family: {
      ...EMPTY_BIODATA.family,
      fatherName: "Srinivas Reddy",
      fatherOccupation: "Doctor",
      motherName: "Lakshmi Reddy",
      motherOccupation: "Homemaker",
      siblings: "None",
    },
    education: {
      ...EMPTY_BIODATA.education,
      highestQualification: "B.Arch",
      institution: "CEPT University",
      occupation: "Architect",
      companyName: "a design studio, Hyderabad",
    },
    astro: { ...EMPTY_BIODATA.astro, religion: "Hindu", caste: "Reddy", manglikStatus: "non-manglik" },
    contact: { ...EMPTY_BIODATA.contact, phone: "99876 54321", email: "kavya.reddy.sample@biodatamatcher.dev", city: "Hyderabad", state: "Telangana" },
  },
] as const;

async function main() {
  for (const profile of SAMPLE_PROFILES) {
    const user = await prisma.user.upsert({
      where: { email: profile.email },
      update: {},
      create: { email: profile.email, name: profile.name, authProvider: "seed" },
    });

    await prisma.biodata.create({
      data: {
        userId: user.id,
        templateId: profile.templateId,
        personal: profile.personal,
        family: profile.family,
        education: profile.education,
        career: {},
        astro: profile.astro,
        contact: profile.contact,
        partnerPreference: EMPTY_BIODATA.partnerPreference as unknown as Prisma.InputJsonValue,
        isPublic: true,
      },
    });
  }

  console.log(`Seeded ${SAMPLE_PROFILES.length} sample public biodata profiles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
