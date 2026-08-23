import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { BiodataData } from "@/types/biodata";
import {
  astroGrid,
  badgeList,
  contactGrid,
  educationLines,
  familyLines,
  personalGrid,
} from "@/components/templates/format";
import { TEMPLATE_THEMES, TemplateTheme } from "@/components/templates/theme";
import { PhotosPdfPage } from "./photos-pdf-page";

function GridRows({ rows, color, labelColor }: { rows: { label: string; value: string }[]; color: string; labelColor: string }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 2 }}>
      {rows.map((row) => (
        <View key={row.label} style={{ width: "33%", marginBottom: 4, paddingRight: 4 }}>
          <Text style={{ fontSize: 8, color: labelColor, fontFamily: "Helvetica-Bold" }}>{row.label}</Text>
          <Text style={{ color }}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

function SectionHeading({ children, color }: { children: string; color: string }) {
  return (
    <Text style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, marginBottom: 6, fontFamily: "Helvetica-Bold", color }}>
      {children}
    </Text>
  );
}

export function ThemedPdf({ data }: { data: BiodataData }) {
  const theme = TEMPLATE_THEMES[data.templateId];
  if (!theme) return null;

  const grid = personalGrid(data);
  const astro = astroGrid(data);
  const family = familyLines(data);
  const education = educationLines(data);
  const contact = contactGrid(data);
  const badges = badgeList(data);
  const { personal } = data;

  const bodyStyle = { fontSize: 9, color: theme.bodyColor };

  const sections = (
    <>
      {grid.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <SectionHeading color={theme.accentColor}>PERSONAL DETAILS</SectionHeading>
          <GridRows rows={grid} color={theme.bodyColor} labelColor={theme.mutedColor} />
        </View>
      )}

      {astro.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <SectionHeading color={theme.accentColor}>RELIGIOUS & ASTROLOGICAL</SectionHeading>
          <GridRows rows={astro} color={theme.bodyColor} labelColor={theme.mutedColor} />
        </View>
      )}

      {(family.length > 0 || contact.length > 0) && (
        <View style={{ flexDirection: "row", marginTop: 8, gap: 12 }}>
          {family.length > 0 && (
            <View style={{ flex: 1 }}>
              <SectionHeading color={theme.accentColor}>FAMILY DETAILS</SectionHeading>
              <View style={bodyStyle}>
                {family.map((line) => (
                  <Text key={line}>{line}</Text>
                ))}
              </View>
            </View>
          )}
          {contact.length > 0 && (
            <View style={{ flex: 1 }}>
              <SectionHeading color={theme.accentColor}>CONTACT DETAILS</SectionHeading>
              <View style={bodyStyle}>
                {contact.map((row) => (
                  <Text key={row.label}>
                    {row.label}: {row.value}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {education.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <SectionHeading color={theme.accentColor}>EDUCATION &amp; CAREER</SectionHeading>
          <View style={bodyStyle}>
            {education.map((line) => (
              <Text key={line}>{line}</Text>
            ))}
          </View>
        </View>
      )}

      {personal.hobbies.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <SectionHeading color={theme.accentColor}>HOBBIES &amp; INTERESTS</SectionHeading>
          <Text style={bodyStyle}>{personal.hobbies.join(" · ")}</Text>
        </View>
      )}

      {badges.length > 0 && (
        <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
          {badges.map((b) => (
            <View
              key={b}
              style={{ backgroundColor: theme.badgeBg, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 }}
            >
              <Text style={{ fontSize: 8, color: theme.badgeText, fontFamily: "Helvetica-Bold" }}>{b}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );

  const frameProps = frameBorder(theme);

  return (
    <Document>
      <Page size="A4" style={{ padding: 36, fontFamily: "Helvetica", backgroundColor: theme.pdfBackground }}>
        <View style={{ flex: 1, padding: 18, ...frameProps }}>
          <Header data={data} theme={theme} />
          {sections}
        </View>
      </Page>
      <PhotosPdfPage data={data} accentColor={theme.accentColor} />
    </Document>
  );
}

function Header({ data, theme }: { data: BiodataData; theme: TemplateTheme }) {
  const { personal } = data;
  const isSquare = data.photoShape === "square";
  return (
    <View style={{ alignItems: "center", marginBottom: 4 }}>
      <Text style={{ fontSize: 8, letterSpacing: 3, color: theme.accentColor, marginBottom: 8 }}>
        MATRIMONIAL BIODATA
      </Text>
      {data.photoUrl && (
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: isSquare ? 6 : 38,
            backgroundColor: theme.photoBg,
            marginBottom: 8,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Image src={data.photoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </View>
      )}
      <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: theme.headingColor }}>
        {personal.fullName || "Your Name"}
      </Text>
      <View style={{ height: 1, width: 50, backgroundColor: theme.dividerColor, marginTop: 6 }} />
    </View>
  );
}

function frameBorder(theme: TemplateTheme): Record<string, unknown> {
  switch (theme.frame) {
    case "brown-double":
      return { borderWidth: 1.5, borderColor: theme.accentColor, borderStyle: "solid" };
    default:
      return {};
  }
}
