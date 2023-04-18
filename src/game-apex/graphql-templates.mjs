import { model as apexLegendsModel } from "@/data-models/apex-legends.mjs";
import { model as apexWeaponsModel } from "@/data-models/apex-weapon.mjs";
import gql from "@/util/graphql-query.mjs";

export const ApexWeapons = gql`
  query ApexWeapons { apexWeapons { ${apexWeaponsModel} } }
`;

export const ApexLegends = gql`
  query ApexLegends { apexChampions { ${apexLegendsModel} } }
`;
