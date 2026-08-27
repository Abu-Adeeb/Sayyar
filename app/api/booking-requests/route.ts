import { createBookingRequest } from "@/db/booking-requests";
import { validateBookingRequest } from "@/lib/booking";

const MAX_REQUEST_BYTES = 8 * 1024;
const responseHeaders = {
  "Cache-Control": "no-store",
};

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return Response.json(
      { error: "content_type", message: "JSON is required" },
      { status: 415, headers: responseHeaders },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return Response.json(
      { error: "request_too_large", message: "Request is too large" },
      { status: 413, headers: responseHeaders },
    );
  }

  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return Response.json(
        { error: "request_too_large", message: "Request is too large" },
        { status: 413, headers: responseHeaders },
      );
    }

    const validation = validateBookingRequest(JSON.parse(rawBody));
    if (!validation.ok) {
      return Response.json(
        {
          error: "validation_error",
          field: validation.field,
          message: validation.message,
        },
        { status: 400, headers: responseHeaders },
      );
    }

    const receipt = await createBookingRequest(validation.value);
    return Response.json(
      {
        reference: receipt.reference,
        status: receipt.status,
        estimatedTotal: receipt.estimatedTotal,
      },
      { status: receipt.created ? 201 : 200, headers: responseHeaders },
    );
  } catch (error) {
    console.error("Unable to save booking request", error);
    return Response.json(
      {
        error: "booking_unavailable",
        message: "Booking requests are temporarily unavailable",
      },
      { status: 503, headers: responseHeaders },
    );
  }
}
