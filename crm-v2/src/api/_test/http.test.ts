import { afterEach, describe, expect, it, vi } from "vitest";

import type {
  CreateTemplateData,
  CreateTemplateResponses,
  CustomerOfferData,
  CustomerOfferResponses,
} from "@/api/crm";
import { ApiError, http } from "@/api/http";

const mockFetch = (response: Response) => {
  const fetchMock = vi.fn<typeof fetch>(async () => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

describe("http", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("fills path params and returns the parsed body", async () => {
    const fetchMock = mockFetch(Response.json({ id: "o1" }));

    const offer = await http.get<CustomerOfferData, CustomerOfferResponses[200]>(
      "/api/crm/customer/{customerId}/offer/{offerId}",
      { path: { customerId: "c 1", offerId: "o1" } },
    );

    expect(fetchMock.mock.calls[0][0]).toBe("/api/crm/customer/c%201/offer/o1");
    expect(offer).toEqual({ id: "o1" });
  });

  it("rejects a url that does not belong to the operation at compile time", () => {
    // Never called: `pnpm typecheck` fails if the @ts-expect-error below stops matching.
    const wrongUrl = () =>
      // @ts-expect-error unknown url
      http.get<CustomerOfferData, unknown>("/api/crm/wrong", { path: {} });

    expect(wrongUrl).toBeTypeOf("function");
  });

  it("sends query and JSON body", async () => {
    const fetchMock = mockFetch(Response.json({ id: "t1" }));

    await http.post<CreateTemplateData, CreateTemplateResponses[200]>("/api/mail/template", {
      query: { offerId: "o 1" },
      body: { name: "welcome" },
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/mail/template?offerId=o+1");
    expect(init).toMatchObject({
      method: "POST",
      body: JSON.stringify({ name: "welcome" }),
      headers: { "Content-Type": "application/json" },
    });
  });

  it("throws ApiError with status and body for a failed response", async () => {
    mockFetch(new Response("nope", { status: 403 }));

    await expect(
      http.get<CustomerOfferData, unknown>("/api/crm/customer/{customerId}/offer/{offerId}", {
        path: { customerId: "c", offerId: "o" },
      }),
    ).rejects.toMatchObject(new ApiError(403, "nope"));
  });
});
