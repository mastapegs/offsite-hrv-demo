import { SanityClient } from "@sanity/client";
import {
  Job,
  Option,
  Part,
  PartAddition,
  PartsByType,
  ReportItem,
} from "../../types/hrv";

export const mutablePartAdditionsHasPart = ({
  parts,
  part,
}: {
  parts: PartAddition[];
  part: PartAddition;
}): boolean => {
  const partExists = parts.find(
    (aPart: PartAddition) => aPart.partToAdd._ref === part.partToAdd._ref
  );
  return !!partExists;
};

export const removeAndGetPartFromParts = ({
  parts,
  part,
}: {
  parts: PartAddition[];
  part: PartAddition;
}): PartAddition => {
  const index = parts.findIndex(
    (aPart: PartAddition) => aPart.partToAdd._ref === part.partToAdd._ref
  );
  const removedPart = parts.splice(index, 1)[0];
  return removedPart;
};

export const combineSameParts = (
  partAdditions: PartAddition[]
): PartAddition[] => {
  const mutablePartAdditions = JSON.parse(JSON.stringify(partAdditions));
  const partsToReturn = [];

  while (mutablePartAdditions.length !== 0) {
    const partAddition = mutablePartAdditions.splice(0, 1)[0];
    while (
      mutablePartAdditionsHasPart({
        parts: mutablePartAdditions,
        part: partAddition,
      })
    ) {
      partAddition.quantity += removeAndGetPartFromParts({
        parts: mutablePartAdditions,
        part: partAddition,
      }).quantity;
    }
    partsToReturn.push(partAddition);
  }

  return partsToReturn;
};

export const getPartAdditions = ({
  job,
}: {
  job: Job;
}): PartAddition[] | null => {
  if (!job.report) return null;
  const partAdditions = job.report
    .filter(
      (reportItem: ReportItem): boolean =>
        !!(reportItem.ruleResponse as Option).partListAdjustments
    )
    .map(
      (reportItem: ReportItem): PartAddition[] =>
        (reportItem.ruleResponse as Option).partListAdjustments!
    )
    .reduce(
      (
        accumulator: PartAddition[],
        currentNestedPartAdditions: PartAddition[]
      ): PartAddition[] => [...accumulator, ...currentNestedPartAdditions],
      []
    );
  return combineSameParts(partAdditions);
};

export const getPartsByTypes = async ({
  client,
  job,
}: {
  client: SanityClient;
  job: Job;
}): Promise<PartsByType[]> => {
  const partAdditions = job
    .report!.filter(
      (reportItem: ReportItem): boolean =>
        !!(reportItem.ruleResponse as Option).partListAdjustments
    )
    .map(
      (reportItem: ReportItem): PartAddition[] =>
        (reportItem.ruleResponse as Option).partListAdjustments!
    )
    .reduce(
      (
        accumulator: PartAddition[],
        currentNestedPartAdditions: PartAddition[]
      ): PartAddition[] => [...accumulator, ...currentNestedPartAdditions],
      []
    );
  const combinedPartAdditions = combineSameParts(partAdditions);
  const combinedPartAdditionsPromises = Promise.all(
    combinedPartAdditions.map((partAddition) =>
      client.fetch(`*[_id == $ref][0]`, { ref: partAddition.partToAdd._ref })
    )
  );
  const parts: Part[] = await combinedPartAdditionsPromises;
  const partTypes = parts.map((part) =>
    part.type ? part.type.toLocaleLowerCase() : "Uncategorized"
  );
  const partAdditionsWithType = combinedPartAdditions.map(
    (partAddition, index) => ({ type: partTypes[index], partAddition })
  );
  const uniqueParts = Array.from(new Set(partTypes));
  const partsByTypes: PartsByType[] = uniqueParts.map((type) => ({
    type,
    parts: [],
  }));
  partAdditionsWithType.forEach((partAdditionWithType) => {
    const index = partsByTypes.findIndex(
      (partsByType) =>
        partsByType.type.toLocaleLowerCase() ===
        partAdditionWithType.type.toLocaleLowerCase()
    );
    partsByTypes[index].parts.push(partAdditionWithType.partAddition);
  });
  return partsByTypes;
};
