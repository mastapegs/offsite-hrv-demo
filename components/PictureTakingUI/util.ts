import { SanityClient, SanityDocument } from "@sanity/client";
import { ImageMedia, InputRule, Job, ReportItem, Rule } from "../../types/hrv";

export const doesSavedRuleAlreadyExist = (job: Job, rule: InputRule) => {
  const existingRule: ReportItem | undefined = job.report?.find(
    (reportItem: ReportItem) => reportItem.rule._ref === rule._id
  );
  return !!existingRule;
};

export const createImageMediaFromImageAsset = ({
  imageAsset,
}: {
  imageAsset: SanityDocument;
}): ImageMedia => ({
  _type: "imageMedia",
  _key: Math.random().toString(36),
  altText: "uploaded image",
  image: {
    asset: {
      _type: "reference",
      _ref: imageAsset._id,
    },
  },
});

export const createReportItemFromImageAsset = ({
  rule,
  imageAsset,
}: {
  rule: InputRule;
  imageAsset: SanityDocument;
}): ReportItem => {
  const mediaToSet: ImageMedia = {
    _type: "imageMedia",
    _key: Math.random().toString(36),
    altText: "uploaded image",
    image: {
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
    },
  };
  const reportItem: ReportItem = {
    rule: {
      _ref: rule._id,
      _type: "reference",
    },
    ruleResponse: {
      media: [mediaToSet],
    },
  };
  return reportItem;
};

export const saveImageAssetToRule = ({
  client,
  rule,
  imageAsset,
}: {
  client: SanityClient;
  rule: Rule;
  imageAsset: SanityDocument;
}): void => {
  client
    .patch(rule._id)
    .unset(["media[0]"])
    .commit()
    .then(() => {
      client
        .patch(rule._id)
        .setIfMissing({ media: [] })
        .append("media", [createImageMediaFromImageAsset({ imageAsset })])
        .commit();
    });
};

export const saveNewImageToReport = ({
  client,
  job,
  setJob,
  rule,
  imageAsset,
}: {
  client: SanityClient;
  job: Job;
  setJob: (aJob: Job) => void;
  rule: InputRule;
  imageAsset: SanityDocument;
}): void => {
  client
    .patch(job._id)
    .setIfMissing({ report: [] })
    .append("report", [createReportItemFromImageAsset({ rule, imageAsset })])
    .commit()
    .then((updatedJob) => {
      setJob(updatedJob as Job);
    });
};

const newReportWithReplacedImage = ({
  oldReport,
  rule,
  imageAsset,
}: {
  oldReport: ReportItem[];
  rule: InputRule;
  imageAsset: SanityDocument;
}): ReportItem[] => {
  const indexOfOldReportItem = oldReport.findIndex(
    (reportItem: ReportItem) => reportItem.rule._ref === rule._id
  );
  const newReport = [
    ...oldReport.slice(0, indexOfOldReportItem),
    createReportItemFromImageAsset({ rule, imageAsset }),
    ...oldReport.slice(indexOfOldReportItem + 1),
  ];
  return newReport;
};

export const replaceSavedImageInReportWithNewImage = ({
  client,
  job,
  setJob,
  rule,
  imageAsset,
}: {
  client: SanityClient;
  job: Job;
  setJob: (aJob: Job) => void;
  rule: InputRule;
  imageAsset: SanityDocument;
}): void => {
  const newReport = newReportWithReplacedImage({
    oldReport: job.report!,
    rule,
    imageAsset,
  });
  client
    .patch(job._id)
    .unset(["report"])
    .commit()
    .then(() => {
      client
        .patch(job._id)
        .setIfMissing({ report: newReport })
        .commit()
        .then((updatedJob) => {
          setJob(updatedJob as Job);
        });
    });
};
