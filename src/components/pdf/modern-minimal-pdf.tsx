import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { BiodataData } from "@/types/biodata";
import { astroGrid, badgeList, contactGrid, educationLines, familyLines, personalGrid } from "@/components/templates/format";
import { colors, pdfStyles } from "./shared";
import { PhotosPdfPage } from "./photos-pdf-page";

function GridRows({ rows, width = "33%" }: { rows: { label: string; value: string }[]; width?: string }) {
  return (
    <View style={pdfStyles.gridRow}>
      {rows.map((row) => (
        <View key={row.label} style={{ width, marginBottom: 4, paddingRight: 4 }}>
          <Text style={pdfStyles.gridLabel}>{row.label}</Text>
          <Text>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function ModernMinimalPdf({ data }: { data: BiodataData }) {
  const grid = personalGrid(data);
  const astro = astroGrid(data);
  const family = familyLines(data);
  const education = educationLines(data);
  const contact = contactGrid(data);
  const badges = badgeList(data);
  const { personal } = data;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.row}>
          <View>
            <View style={{ height: 3, width: 26, backgroundColor: colors.ink900, marginBottom: 8 }} />
            <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: colors.ink900 }}>
              {(personal.fullName || "Your Name").toUpperCase()}
            </Text>
            <Text style={{ fontSize: 8, letterSpacing: 2, color: colors.ink300, marginTop: 4 }}>
              MATRIMONIAL PROFILE
            </Text>
          </View>
          {data.photoUrl && (
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: data.photoShape === "square" ? 4 : 32,
                backgroundColor: colors.ivory200,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Image src={data.photoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </View>
          )}
        </View>

        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 14 }} />

        {grid.length > 0 && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ ...pdfStyles.sectionTitle, color: colors.gold700 }}>PERSONAL</Text>
            <GridRows rows={grid} />
          </View>
        )}

        {astro.length > 0 && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ ...pdfStyles.sectionTitle, color: colors.gold700 }}>RELIGIOUS &amp; ASTROLOGICAL</Text>
            <GridRows rows={astro} />
          </View>
        )}

        {(family.length > 0 || contact.length > 0) && (
          <View style={{ flexDirection: "row", marginBottom: 10, gap: 12 }}>
            {family.length > 0 && (
              <View style={{ flex: 1 }}>
                <Text style={{ ...pdfStyles.sectionTitle, color: colors.gold700 }}>FAMILY</Text>
                <View style={pdfStyles.sectionBody}>
                  {family.map((line) => (
                    <Text key={line}>{line}</Text>
                  ))}
                </View>
              </View>
            )}
            {contact.length > 0 && (
              <View style={{ flex: 1 }}>
                <Text style={{ ...pdfStyles.sectionTitle, color: colors.gold700 }}>CONTACT</Text>
                <View style={pdfStyles.sectionBody}>
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
          <View style={{ marginBottom: 10 }}>
            <Text style={{ ...pdfStyles.sectionTitle, color: colors.gold700 }}>EDUCATION &amp; CAREER</Text>
            <View style={pdfStyles.sectionBody}>
              {education.map((line) => (
                <Text key={line}>{line}</Text>
              ))}
            </View>
          </View>
        )}

        {personal.hobbies.length > 0 && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ ...pdfStyles.sectionTitle, color: colors.gold700 }}>INTERESTS</Text>
            <Text style={pdfStyles.sectionBody}>{personal.hobbies.join(" · ")}</Text>
          </View>
        )}

        {badges.length > 0 && (
          <View style={{ flexDirection: "row", gap: 6, marginBottom: 10 }}>
            {badges.map((b) => (
              <View
                key={b}
                style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 3, paddingVertical: 3, paddingHorizontal: 8 }}
              >
                <Text style={{ fontSize: 8, color: colors.ink500, fontFamily: "Helvetica-Bold" }}>{b}</Text>
              </View>
            ))}
          </View>
        )}

      </Page>
      <PhotosPdfPage data={data} accentColor={colors.gold700} />
    </Document>
  );
}
