import { FC, useContext } from "react";
import { SanityClient } from "@sanity/client";
import { Job, MainView, Rule, TerminatorRule } from "../../types/hrv";
import { RuleHeader } from "../RuleHeader";
import { RuleBody } from "../RuleBody";
import { RuleBodyWrapper } from "../RuleBodyWrapper";
import SanityContext from "../../contexts/SanityContext";

interface TerminatorRuleViewProps {
  rule: TerminatorRule;
  setRule: (aRule: Rule) => void;
  ruleSetIdentifier: string;
}

const completeJob = ({
  client,
  job,
  setJob,
  setMainView,
}: {
  client: SanityClient;
  job: Job;
  setJob: (aJob: Job) => void;
  setMainView: (view: MainView) => void;
}) => {
  client
    .patch(job._id)
    .set({ status: "Completed" })
    .commit()
    .then((updatedJob) => {
      setJob(updatedJob as Job);
      setMainView("jobs");
    });
};

export const TerminatorRuleView: FC<TerminatorRuleViewProps> = ({
  rule,
  setRule,
  ruleSetIdentifier,
}) => {
  const { client, job, setJob, setMainView } = useContext(SanityContext);
  return (
    <>
      <RuleHeader
        rule={rule}
        setRule={setRule}
        ruleSetIdentifier={ruleSetIdentifier}
      />
      <RuleBodyWrapper>
        <RuleBody rule={rule} />
      </RuleBodyWrapper>
      <input
        className="active:animate-ripple transition-colors duration-500 disabled:bg-opacity-50 block rounded text-2xl p-4 w-4/5 max-w-screen-sm mx-auto bg-purple-600 text-white"
        type="button"
        value="Complete Job"
        onClick={() => completeJob({ client, job, setJob, setMainView })}
      />
    </>
  );
};
