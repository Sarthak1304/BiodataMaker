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

export function TraditionalFloralPdf({ data }: { data: BiodataData }) {
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
        <View style={{ borderWidth: 1.5, borderColor: colors.gold500, borderStyle: "solid", padding: 18, flex: 1 }}>
          <View style={pdfStyles.center}>
            <Text style={{ fontSize: 8, letterSpacing: 3, color: colors.gold700, marginBottom: 8 }}>
              MATRIMONIAL BIODATA
            </Text>
            {data.photoUrl && (
              <View
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: data.photoShape === "square" ? 6 : 38,
                  backgroundColor: colors.ivory200,
                  marginHorizontal: "auto",
                  marginBottom: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Image src={data.photoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </View>
            )}
            <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: colors.maroon900 }}>
              {personal.fullName || "Your Name"}
            </Text>
            <View style={{ height: 1, width: 50, backgroundColor: colors.gold500, marginTop: 6, marginHorizontal: "auto" }} />
          </View>

          {grid.length > 0 && (
            <View style={{ marginTop: 14 }}>
              <Text style={{ ...pdfStyles.sectionTitle, color: colors.maroon700 }}>PERSONAL DETAILS</Text>
              <GridRows rows={grid} />
            </View>
          )}

          {astro.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ ...pdfStyles.sectionTitle, color: colors.maroon700 }}>RELIGIOUS &amp; ASTROLOGICAL</Text>
              <GridRows rows={astro} />
            </View>
          )}

          {(family.length > 0 || contact.length > 0) && (
            <View style={{ flexDirection: "row", marginTop: 8, gap: 12 }}>
              {family.length > 0 && (
                <View style={{ flex: 1 }}>
                  <Text style={{ ...pdfStyles.sectionTitle, color: colors.maroon700 }}>FAMILY DETAILS</Text>
                  <View style={pdfStyles.sectionBody}>
                    {family.map((line) => (
                      <Text key={line}>{line}</Text>
                    ))}
                  </View>
                </View>
              )}
              {contact.length > 0 && (
                <View style={{ flex: 1 }}>
                  <Text style={{ ...pdfStyles.sectionTitle, color: colors.maroon700 }}>CONTACT DETAILS</Text>
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
            <View style={{ marginTop: 8 }}>
              <Text style={{ ...pdfStyles.sectionTitle, color: colors.maroon700 }}>EDUCATION &amp; CAREER</Text>
              <View style={pdfStyles.sectionBody}>
                {education.map((line) => (
                  <Text key={line}>{line}</Text>
                ))}
              </View>
            </View>
          )}

          {personal.hobbies.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ ...pdfStyles.sectionTitle, color: colors.maroon700 }}>HOBBIES &amp; INTERESTS</Text>
              <Text style={pdfStyles.sectionBody}>{personal.hobbies.join(" · ")}</Text>
            </View>
          )}

          {badges.length > 0 && (
            <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
              {badges.map((b) => (
                <View
                  key={b}
                  style={{ backgroundColor: colors.sage100, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 }}
                >
                  <Text style={{ fontSize: 8, color: colors.sage700, fontFamily: "Helvetica-Bold" }}>{b}</Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </Page>
      <PhotosPdfPage data={data} accentColor={colors.maroon700} />
    </Document>
  );
}
