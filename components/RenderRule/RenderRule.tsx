import { FC, SyntheticEvent } from "react";
import { ChoiceRule, InputRule, Rule, TerminatorRule } from "../../types/hrv";
import { ChoiceRuleView } from "../ChoiceRuleView";
import { InputRuleView } from "../InputRuleView";
import { TerminatorRuleView } from "../TerminatorRuleView";

interface RenderRuleProps {
  rule: Rule;
  setRule: (aRule: Rule) => void;
  handleNext: (event: SyntheticEvent) => void;
  choiceRuleSelected: string;
  setChoiceRuleSelected: (choice: string) => void;
  ruleSetIdentifier: string;
  nextButtonDisabled: boolean;
  setNextButtonDisabled: (disabled: boolean) => void;
}

export const RuleContainer: FC = ({ children }) => (
  <div className="bg-background pb-4 min-h-screen">{children}</div>
);

export const RenderRule: FC<RenderRuleProps> = ({
  rule,
  setRule,
  handleNext,
  choiceRuleSelected,
  setChoiceRuleSelected,
  ruleSetIdentifier,
  nextButtonDisabled,
  setNextButtonDisabled,
}) => {
  switch (rule._type) {
    case "choiceRule":
      return (
        <RuleContainer>
          <ChoiceRuleView
            rule={rule as ChoiceRule}
            setRule={setRule}
            handleNext={handleNext}
            choiceRuleSelected={choiceRuleSelected}
            setChoiceRuleSelected={setChoiceRuleSelected}
            ruleSetIdentifier={ruleSetIdentifier}
            nextButtonDisabled={nextButtonDisabled}
            setNextButtonDisabled={setNextButtonDisabled}
          />
        </RuleContainer>
      );
    case "inputRule":
      return (
        <RuleContainer>
          <InputRuleView
            rule={rule as InputRule}
            setRule={setRule}
            handleNext={handleNext}
            ruleSetIdentifier={ruleSetIdentifier}
            nextButtonDisabled={nextButtonDisabled}
            setNextButtonDisabled={setNextButtonDisabled}
          />
        </RuleContainer>
      );
    case "terminatorRule":
      return (
        <RuleContainer>
          <TerminatorRuleView
            rule={rule as TerminatorRule}
            setRule={setRule}
            ruleSetIdentifier={ruleSetIdentifier}
          />
        </RuleContainer>
      );
    default:
      return <></>;
  }
};
