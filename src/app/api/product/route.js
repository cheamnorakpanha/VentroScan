import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const barcode = searchParams.get("barcode");

  if (!barcode) {
    return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=${process.env.BARCODE_LOOKUP_API_KEY}`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Barcode API Error:", response.status, errorData);
      return NextResponse.json(
        { error: "External API error", status: response.status, details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 },
    );
  }
}
