import {parse} from "tldts";

import {z} from "zod";

/**
 * Enum-like object for APIListOfReasons, for code reference.
 */
export const APIListOfReasons = {
  /** HeadQ Location: Israel, Operating Status: Active */
  HeadQuarterInIL: "h",
  /** HeadQ Location: Not Israel, Operating Status: Active, Founders > Location: Israel */
  FounderInIL: "f",
  /** HeadQ Location: Not Israel, Operating Status: Active, Founders > Location: Not Israel, Investors > Location: Israel */
  InvestorNotFounderInIL: "i",
  /** Url */
  Url: "u",
  /** BDS */
  BDS: "b",
} as const;

export type valuesOfListOfReasons =
  (typeof APIListOfReasons)[keyof typeof APIListOfReasons];

export const APIListOfReasonsSchema = z.enum([
  APIListOfReasons.HeadQuarterInIL,
  APIListOfReasons.FounderInIL,
  APIListOfReasons.InvestorNotFounderInIL,
  APIListOfReasons.Url,
  APIListOfReasons.BDS,
]);

// export type APIListOfReasonsSchemaType = z.infer<typeof APIListOfReasonsSchema>;

export enum DBFileNames {
  ALL = "ALL",
  WEBSITES = "WEBSITES",
  FLAGGED_FACEBOOK = "FLAGGED_FACEBOOK",
  FLAGGED_LI_COMPANY = "FLAGGED_LI_COMPANY",
  FLAGGED_TWITTER = "FLAGGED_TWITTER",
}

export type DBFileNamesValues = `${DBFileNames}`;
export type APIListOfReasonsValues =
  (typeof APIListOfReasons)[keyof typeof APIListOfReasons];

type APIEndpointRule = {
  fileName: DBFileNamesValues;
  domain: string;
  regex: string;
};

export const APIEndpointDomainsResultSchema = z.object({
  selector: z.string(),
  id: z.string(),
  reasons: z.array(APIListOfReasonsSchema),
  name: z.string(),
});

export type APIEndpointDomainsResult = z.infer<
  typeof APIEndpointDomainsResultSchema
>;

export const FinalDBFileSchema = z.object({
  id: z.string(),
  ws: z.string(),
  li: z.string().optional(),
  fb: z.string().optional(),
  tw: z.string().optional(),
  r: z.array(APIListOfReasonsSchema),
  /** name */
  n: z.string(),
  /** comment */
  c: z.string().optional(),
});

export type APIEndpointDomains = APIEndpointDomainsResult[];

export type APIEndpointConfig = {
  rules: APIEndpointRule[];
};

export const API_ENDPOINT_RULE_LINKEDIN = {
  fileName: DBFileNames.FLAGGED_LI_COMPANY,
  domain: "linkedin.com",
  regex: "(?:linkedin.com)/(?:company|showcase)/([^/?]+)",
} as const satisfies APIEndpointRule;

export const API_ENDPOINT_RULE_FACEBOOK = {
  fileName: DBFileNames.FLAGGED_FACEBOOK,
  domain: "facebook.com",
  regex: "(?:facebook.com)/([^/?]+)",
} as const satisfies APIEndpointRule;

export const API_ENDPOINT_RULE_TWITTER = {
  fileName: DBFileNames.FLAGGED_TWITTER,
  domain: "twitter.com",
  regex: "(?:twitter.com|x.com|t.co)/([^/?]+)",
} as const satisfies APIEndpointRule;

export const CONFIG: APIEndpointConfig = {
  rules: [
    API_ENDPOINT_RULE_LINKEDIN,
    API_ENDPOINT_RULE_FACEBOOK,
    API_ENDPOINT_RULE_TWITTER,
  ],
};

/**
 * Extracts the main domain from a given URL.
 **/
export function getMainDomain(url: string) {
  try {
    // Add protocol if missing
    const urlWithProtocol =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    const {hostname} = new URL(urlWithProtocol);
    const parsed = parse(hostname);

    if (parsed.hostname) {
      return parsed.hostname.replace("www.", "");
    }
    console.warn("getMainDomain empty:", url);

    return "";
  } catch (e) {
    console.error("getMainDomain error:", url, e);
    return "";
  }
}
