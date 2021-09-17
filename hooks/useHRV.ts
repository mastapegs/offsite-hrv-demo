import { useState, useContext, useEffect, SyntheticEvent } from "react";
import SanityContext from "../contexts/SanityContext";
import { ChoiceRule, InputRule, Job, ReportItem, Rule } from "../types/hrv";
import {
  createReportItemFromKeyedInput,
  createReportItemFromOption,
  jobReportExists,
  setRuleToNextRuleInReport,
} from "./util";

export const useHRV = () => {
  const [rule, setRule] = useState<Rule>({} as Rule);
  const [ruleSetIdentifier, setRuleSetIdentifier] = useState("");
  const [choiceRuleSelected, setChoiceRuleSelected] = useState("");
  const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
  const {
    client,
    setImageURL,
    ruleset,
    job,
    setJob,
    inputValue,
    setInputValue,
    setRuleMediaURL,
  } = useContext(SanityContext);

  const HRVInitialEffect = () => {
    if (!ruleset.internalIdentifier) return;
    setRuleSetIdentifier(ruleset.internalIdentifier);
    if (jobReportExists({ job })) {
      setRuleToNextRuleInReport({ client, job, setRule });
    } else if (ruleset.startingRule._type === "choiceRule") {
      setRule(ruleset.startingRule);
    }
  };
  useEffect(HRVInitialEffect, [ruleset]);

  const handleNext = (event: SyntheticEvent) => {
    event.preventDefault();

    switch (rule._type) {
      case "choiceRule":
        if (choiceRuleSelected === "") return;
        handleNextFromChoiceRule();
        break;
      case "inputRule":
        handleNextFromInputRule();
        break;
      default:
        break;
    }
  };

  const handleNextFromChoiceRule = () => {
    const optionSelected = (rule as ChoiceRule).options.find(
      (option) => option.answerLabel === choiceRuleSelected
    )!;
    if (!optionSelected?.answerTarget?._ref) {
      setChoiceRuleSelected("");
      setNextButtonDisabled(true);
      return;
    }
    const reportItemExists =
      job.report &&
      job.report!.find(
        (reportItem: ReportItem) => reportItem.rule._ref === rule._id
      );
    if (!reportItemExists) {
      const nextRuleQuery = `*[_id == $ref][0]`;
      const nextRuleParams = { ref: optionSelected?.answerTarget._ref };
      client.fetch(nextRuleQuery, nextRuleParams).then((queriedRule: Rule) => {
        if (queriedRule) {
          client
            .patch(job._id)
            .setIfMissing({ report: [] })
            .append("report", [
              createReportItemFromOption({ rule, option: optionSelected }),
            ])
            .commit()
            .then((updatedJob) => {
              setJob(updatedJob as Job);
            });
          setRuleMediaURL(null);
          setRule(queriedRule);
        }
        if (queriedRule._type === "choiceRule") setNextButtonDisabled(true);
        setChoiceRuleSelected("");
        setInputValue("");
      });
    } else {
      const indexOfOldReportItem = job.report!.findIndex(
        (reportItem: ReportItem) => reportItem.rule._ref === rule._id
      );
      const newReportItem: ReportItem = createReportItemFromOption({
        rule,
        option: optionSelected,
      });
      const newReport = [
        ...job.report!.slice(0, indexOfOldReportItem),
        newReportItem,
      ];
      client
        .fetch(`*[_id == $ref][0]`, { ref: optionSelected?.answerTarget._ref })
        .then((queriedRule: Rule) => {
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
              setRuleMediaURL(null);
              setRule(queriedRule);
              setChoiceRuleSelected("");
              setInputValue("");
              setNextButtonDisabled(true);
            });
        });
    }
  };

  const handleNextFromInputRule = () => {
    if (!(rule as InputRule).nextRuleTarget?._ref) return;
    const nextRuleQuery = `*[_id == $ref][0]`;
    const nextRuleParams = { ref: (rule as InputRule).nextRuleTarget._ref };
    client.fetch(nextRuleQuery, nextRuleParams).then((queriedRule: Rule) => {
      if (!queriedRule) return;
      if (
        (rule as InputRule).inputType === "input-text" ||
        (rule as InputRule).inputType === "input-number"
      ) {
        if (
          !job.report!.find(
            (reportItem: ReportItem) => reportItem.rule._ref === rule._id
          )
        ) {
          client
            .patch(job._id)
            .setIfMissing({ report: [] })
            .append("report", [
              createReportItemFromKeyedInput({
                rule,
                keyedInput: inputValue as string,
              }),
            ])
            .commit()
            .then((updatedJob) => {
              setJob(updatedJob as Job);
            });
        } else {
          const indexOfOldReportItem = job.report!.findIndex(
            (reportItem: ReportItem) => reportItem.rule._ref === rule._id
          );
          const newReportItem: ReportItem = createReportItemFromKeyedInput({
            rule,
            keyedInput: inputValue as string,
          });
          const newReport = [
            ...job.report!.slice(0, indexOfOldReportItem),
            newReportItem,
            ...job.report!.slice(indexOfOldReportItem + 1),
          ];
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
        }
      }
      setInputValue("");
      setNextButtonDisabled(true);
      setImageURL("");
      setRule(queriedRule);
    });
  };

  return {
    rule,
    setRule,
    ruleSetIdentifier,
    nextButtonDisabled,
    setNextButtonDisabled,
    handleNext,
    choiceRuleSelected,
    setChoiceRuleSelected,
  };
};
