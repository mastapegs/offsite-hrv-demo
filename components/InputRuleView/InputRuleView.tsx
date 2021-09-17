import { ChangeEvent, FC, SyntheticEvent, useContext, useEffect } from "react";
import SanityContext from "../../contexts/SanityContext";
import { InputRule, ReportItem, Rule, SavedKeyedInput } from "../../types/hrv";
import { NextButton } from "../NextButton";
import { PictureTakingUI } from "../PictureTakingUI";
import { RuleBody } from "../RuleBody";
import { RuleBodyWrapper } from "../RuleBodyWrapper";
import { RuleHeader } from "../RuleHeader";
import { RuleMediaView } from "../RuleMediaView/RuleMediaView";

interface InputRuleViewProps {
  rule: InputRule;
  setRule: (aRule: Rule) => void;
  handleNext: (event: SyntheticEvent) => void;
  ruleSetIdentifier: string;
  nextButtonDisabled: boolean;
  setNextButtonDisabled: (isDisabled: boolean) => void;
}

const getInputType = (inputType: string): string => {
  switch (inputType) {
    case "input-text":
      return "text";
    case "input-number":
      return "number";
    default:
      return "";
  }
};

export const InputRuleView: FC<InputRuleViewProps> = ({
  rule,
  setRule,
  handleNext,
  ruleSetIdentifier,
  nextButtonDisabled,
  setNextButtonDisabled,
}) => {
  const {
    inputValue,
    setInputValue,
    isInputValid,
    setIsInputValid,
    job,
  } = useContext(SanityContext);

  useEffect(() => {
    const ruleReportItem = job.report?.find(
      (reportItem: ReportItem) => reportItem.rule._ref === rule._id
    );
    if (!ruleReportItem) return;
    setInputValue((ruleReportItem.ruleResponse as SavedKeyedInput).keyedInput);
  }, [rule, job]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (nextButtonDisabled) setNextButtonDisabled(false);
    switch (rule.inputType) {
      case "input-text":
        setInputValue(event.target.value);
        break;
      case "input-number":
        setInputValue(Number(event.target.value));
        break;
      default:
        break;
    }
  };

  const formatValidationRule = (validationRule: string): string =>
    validationRule.substring(1, validationRule.length - 1);

  const handleInputValidation = () => {
    if (!rule.validationRule) return;
    const validationRegex = new RegExp(
      formatValidationRule(rule.validationRule)
    );
    const isValid = validationRegex.test(String(inputValue));
    setIsInputValid(isValid);
  };

  return (
    <>
      <RuleHeader
        rule={rule}
        setRule={setRule}
        ruleSetIdentifier={ruleSetIdentifier}
      />
      <RuleMediaView rule={rule} />
      {rule.inputType === "input-picture" && (
        <RuleBodyWrapper>
          <PictureTakingUI
            rule={rule}
            setNextButtonDisabled={setNextButtonDisabled}
          />
        </RuleBodyWrapper>
      )}
      <RuleBodyWrapper>
        <RuleBody rule={rule} />
        {rule.inputType !== "input-picture" && (
          <div className="mt-6">
            <input
              type={getInputType(rule.inputType)}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputValidation}
              className={`border w-full transition-colors focus:outline-none rounded px-4 py-3 ${
                !isInputValid
                  ? "border-red-error-border focus:border-red-error-border"
                  : "border-gray-input-text-border focus:border-purple-600"
              }`}
            />
            {!isInputValid && (
              <p className="mt-1 text-sm text-red-error-text">Bad Input</p>
            )}
          </div>
        )}
      </RuleBodyWrapper>
      <NextButton
        handleNext={handleNext}
        text="OK"
        nextButtonDisabled={nextButtonDisabled}
      />
    </>
  );
};
