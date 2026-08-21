import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  maroon900: "#5C0F1E",
  maroon700: "#7A1526",
  gold700: "#9C7A1F",
  gold500: "#C9A227",
  gold300: "#E4C878",
  ivory200: "#EFE4CB",
  sage700: "#3C5640",
  sage100: "#E4EDE2",
  ink900: "#2A2119",
  ink700: "#4A3F34",
  ink500: "#6B5F52",
  ink300: "#9C917F",
  border: "#E6DCC8",
  white: "#FFFFFF",
};

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    color: colors.ink700,
    fontFamily: "Helvetica",
  },
  center: { textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.2,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  sectionBody: { fontSize: 9, lineHeight: 1.7 },
  gridRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 2 },
  gridItem: { width: "50%", marginBottom: 4 },
  gridLabel: { fontSize: 8, color: colors.ink500, fontFamily: "Helvetica-Bold" },
  divider: { height: 1, marginVertical: 10 },
});
