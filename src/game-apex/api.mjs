import { appURLs } from "@/app/constants.mjs";
import * as GraphQLTemplates from "@/game-apex/graphql-templates.mjs";
import parseSearchParams from "@/util/parse-search-params.mjs";

export function getApexConstByType(type) {
  const params = parseSearchParams({ query: GraphQLTemplates[type] });
  return `${appURLs.CMS}/graphql?${params}`;
}
