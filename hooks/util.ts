import { SanityClient } from "@sanity/client";
import {
  ChoiceRule,
  InputRule,
  Job,
  Option,
  ReportItem,
  Rule,
} from "../types/hrv";

export const createReportItemFromOption = ({
  rule,
  option,
}: {
  rule: Rule;
  option: Option;
}): ReportItem => ({
  rule: {
    _ref: rule._id,
    _type: "reference",
  },
  ruleResponse: option,
});

export const createReportItemFromKeyedInput = ({
  rule,
  keyedInput,
}: {
  rule: Rule;
  keyedInput: string;
}): ReportItem => ({
  rule: {
    _ref: rule._id,
    _type: "reference",
  },
  ruleResponse: {
    keyedInput,
  },
});

export const jobReportExists = ({ job }: { job: Job }) => {
  if (job.report) return true;
  return false;
};

export const setRuleToNextRuleInReport = ({
  client,
  job,
  setRule,
}: {
  client: SanityClient;
  job: Job;
  setRule: (rule: Rule) => void;
}) => {
  if (!job.report) return;
  const lastReportItem = job.report[job.report.length - 1];
  client
    .fetch(`*[_id == $ref][0]`, {
      ref: lastReportItem.rule._ref,
    })
    .then((lastRuleInReport: Rule) => {
      switch (lastRuleInReport._type) {
        case "choiceRule":
          client
            .fetch(`*[_id == $ref][0]`, {
              ref: (lastReportItem.ruleResponse as Option).answerTarget._ref,
            })
            .then((queriedNextRule: Rule) => {
              setRule(queriedNextRule);
            });
          break;
        case "inputRule":
          client
            .fetch(`*[_id == $ref][0]`, {
              ref: (lastRuleInReport as InputRule).nextRuleTarget._ref,
            })
            .then((queriedNextRule: Rule) => {
              setRule(queriedNextRule);
            });
          break;
        default:
      }
    });
};
