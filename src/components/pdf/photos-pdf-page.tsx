import { Page, View, Image, Text } from "@react-pdf/renderer";
import { BiodataData } from "@/types/biodata";

function gridCols(count: number) {
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  return 3;
}

export function PhotosPdfPage({ data, accentColor }: { data: BiodataData; accentColor: string }) {
  if (data.additionalPhotos.length === 0) return null;
  const cols = gridCols(data.additionalPhotos.length);
  const cellSize = cols === 1 ? 400 : cols === 2 ? 240 : 155;

  return (
    <Page size="A4" style={{ padding: 36 }}>
      <Text style={{ fontSize: 10, letterSpacing: 2, color: accentColor, textAlign: "center", marginBottom: 16 }}>
        MORE PHOTOS
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {data.additionalPhotos.map((url, i) => (
          <View
            key={url + i}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: "#F5EEDD",
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image src={url} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </View>
        ))}
      </View>
    </Page>
  );
}
