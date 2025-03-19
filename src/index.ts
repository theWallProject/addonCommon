import {z} from "zod";

export const ReasonsSchema = z.array(z.enum(["h", "f", "u", "b"]));
export type ReasonsSchemaType = z.infer<typeof ReasonsSchema>;

export enum APIListOfReasons {
  HeadQuarterInIL = "h",
  FounderInIL = "f",
  Url = "u",
  BDS = "b",
}

export enum DBFileNames {
  FLAGGED = "FLAGGED",
  FLAGGED_FACEBOOK = "FLAGGED_FACEBOOK",
  FLAGGED_LI_COMPANY = "FLAGGED_LI_COMPANY",
  FLAGGED_TWITTER = "FLAGGED_TWITTER",
}

export type DBFileNamesValues = `${DBFileNames}`;
export type APIListOfReasonsValues = `${APIListOfReasons}`;

type APIEndpointRule = {
  fileName: DBFileNamesValues;
  domain: string;
  regex: string;
};

export type APIEndpointDomainsResult = {
  selector: string;
  reasons: APIListOfReasonsValues[];
  name: string;
  comment?: string;
  link?: string;
};

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
