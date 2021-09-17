import { FC, useContext } from "react";
import { useHRV } from "../hooks/useHRV";
import { RenderRule } from "../components/RenderRule";
import SanityContext from "../contexts/SanityContext";
import { Login } from "../components/Login";
import { Jobs } from "../components/Jobs";
import { Parts } from "../components/Parts";
import { JobDetails } from "../components/JobDetails";

const HomePage: FC = () => {
  const {
    rule,
    setRule,
    nextButtonDisabled,
    setNextButtonDisabled,
    handleNext,
    choiceRuleSelected,
    setChoiceRuleSelected,
    ruleSetIdentifier,
  } = useHRV();
  const { mainView } = useContext(SanityContext);

  switch (mainView) {
    case "login":
      return <Login />;
    case "jobs":
      return <Jobs />;
    case "jobDetails":
      return <JobDetails ruleSetIdentifier={ruleSetIdentifier} />;
    case "parts":
      return (
        <Parts
          rule={rule}
          setRule={setRule}
          ruleSetIdentifier={ruleSetIdentifier}
        />
      );
    case "rules":
      return (
        <RenderRule
          rule={rule}
          setRule={setRule}
          handleNext={handleNext}
          choiceRuleSelected={choiceRuleSelected}
          setChoiceRuleSelected={setChoiceRuleSelected}
          ruleSetIdentifier={ruleSetIdentifier}
          nextButtonDisabled={nextButtonDisabled}
          setNextButtonDisabled={setNextButtonDisabled}
        />
      );
    default:
      return <></>;
  }
};

export default HomePage;
