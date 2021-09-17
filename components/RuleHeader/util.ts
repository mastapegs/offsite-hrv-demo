import { SanityClient } from "@sanity/client";
import { Job, MainView, ReportItem, Rule } from "../../types/hrv";

const currentRuleExistsInReport = ({
  rule,
  job,
}: {
  rule: Rule;
  job: Job;
}): boolean =>
  !!job.report!.find(
    (reportItem: ReportItem) => reportItem.rule._ref === rule._id
  );

const goToPreviousReportRule = ({
  client,
  job,
  setJob,
  rule,
  setRule,
  setMainView,
}: {
  client: SanityClient;
  job: Job;
  setJob: (aJob: Job) => void;
  rule: Rule;
  setRule: (aRule: Rule) => void;
  setMainView: (aView: MainView) => void;
}) => {
  if (job.report![0].rule._ref === rule._id) {
    setMainView("jobs");
    setRule({} as Rule);
    setJob({} as Job);
    return;
  }
  const currentIndex = job.report!.findIndex(
    (reportItem: ReportItem) => reportItem.rule._ref === rule._id
  );
  const ref = job.report![currentIndex - 1].rule._ref;
  client.fetch(`*[_id == $ref][0]`, { ref }).then((queriedRule: Rule) => {
    setRule(queriedRule);
  });
};

const goToLastReportRule = ({
  setRule,
  job,
  client,
}: {
  setRule: (aRule: Rule) => void;
  job: Job;
  client: SanityClient;
}) => {
  const lastRuleIndex = job.report!.length - 1;
  const ref = job.report![lastRuleIndex].rule._ref;
  client.fetch(`*[_id == $ref][0]`, { ref }).then((queriedRule: Rule) => {
    setRule(queriedRule);
  });
};

export const handleBackButton = ({
  rule,
  client,
  setRule,
  job,
  mainView,
  setMainView,
  setJob,
}: {
  rule: Rule;
  setRule: (aRule: Rule) => void;
  job: Job;
  mainView: MainView;
  setMainView: (view: MainView) => void;
  setJob: (aJob: Job) => void;
  client: SanityClient;
}) => {
  if (mainView === "parts") {
    setMainView("rules");
    return;
  }
  if (!job.report) {
    setMainView("jobs");
    setJob({} as Job);
    return;
  }
  if (currentRuleExistsInReport({ rule, job })) {
    goToPreviousReportRule({
      client,
      job,
      setJob,
      rule,
      setRule,
      setMainView,
    });
    return;
  }
  goToLastReportRule({ setRule, job, client });
};
