import { ChangeEvent, FC, SyntheticEvent, useContext, useEffect } from "react";
import SanityContext from "../../contexts/SanityContext";
import { Option, ChoiceRule, ReportItem, Rule } from "../../types/hrv";
import { NextButton } from "../NextButton";

import { RuleBody } from "../RuleBody";
import { RuleBodyWrapper } from "../RuleBodyWrapper";
import { RuleHeader } from "../RuleHeader";
import { RuleMediaView } from "../RuleMediaView/RuleMediaView";

interface ChoiceRuleViewProps {
  rule: ChoiceRule;
  setRule: (aRule: Rule) => void;
  handleNext: (event: SyntheticEvent) => void;
  choiceRuleSelected: string;
  setChoiceRuleSelected: (choice: string) => void;
  ruleSetIdentifier: string;
  nextButtonDisabled: boolean;
  setNextButtonDisabled: (disabled: boolean) => void;
}

export const ChoiceRuleView: FC<ChoiceRuleViewProps> = ({
  rule,
  setRule,
  handleNext,
  choiceRuleSelected,
  setChoiceRuleSelected,
  ruleSetIdentifier,
  nextButtonDisabled,
  setNextButtonDisabled,
}) => {
  const { job } = useContext(SanityContext);
  useEffect(() => {
    const ruleReportItem = job.report?.find(
      (reportItem: ReportItem) => reportItem.rule._ref === rule._id
    );
    if (!ruleReportItem) return;
    setChoiceRuleSelected((ruleReportItem.ruleResponse as Option).answerLabel);
    setNextButtonDisabled(false);
  }, [rule, job]);
  return (
    <>
      <RuleHeader
        rule={rule}
        setRule={setRule}
        ruleSetIdentifier={ruleSetIdentifier}
      />
      <RuleMediaView rule={rule} />
      <RuleBodyWrapper>
        <RuleBody rule={rule} />
        <div className="flex flex-col space-y-4 items-center mt-6 font-semibold text-2xl">
          {rule.options.map((option: Option) => (
            <div key={option.answerLabel}>
              <input
                type="radio"
                name="option"
                id={option.answerLabel}
                value={option.answerLabel}
                checked={choiceRuleSelected === option.answerLabel}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setChoiceRuleSelected(e.target.value);
                  setNextButtonDisabled(false);
                }}
              />
              <label className="ml-3" htmlFor={option.answerLabel}>
                {option.answerLabel}
              </label>
            </div>
          ))}
        </div>
      </RuleBodyWrapper>
      <NextButton
        handleNext={handleNext}
        text="Next"
        nextButtonDisabled={nextButtonDisabled}
      />
    </>
  );
};
