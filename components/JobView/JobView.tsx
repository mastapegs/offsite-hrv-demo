import { FC, MouseEventHandler, useContext, useEffect, useState } from "react";
import SanityContext from "../../contexts/SanityContext";
import { Job, RuleSet } from "../../types/hrv";

interface JobProps {
  job: Job;
}

const getJobStatus = (job: Job): string => {
  if (!job.status) return "In progress";
  return job.status;
};

export const JobView: FC<JobProps> = ({ job }) => {
  const { client, setRuleset, setJob, setMainView } = useContext(SanityContext);
  const [jobRuleset, setJobRuleset] = useState({} as RuleSet);

  useEffect(() => {
    client
      .fetch(
        `*[_id == $ref][0]{
        internalIdentifier,
        startingRule->
      }`,
        { ref: job.ruleset._ref }
      )
      .then((fetchedRuleSet: RuleSet) => {
        setJobRuleset(fetchedRuleSet);
      });
  }, []);

  const handleClick: MouseEventHandler = () => {
    const clearJobReport = false;
    if (clearJobReport) {
      client
        .patch(job._id)
        .unset(["report"])
        .commit()
        .then((updatedJob) => {
          setJob(updatedJob as Job);
          setRuleset(jobRuleset);
        });
    } else {
      setJob(job);
      setRuleset(jobRuleset);
    }
    setMainView("jobDetails");
  };

  if (!jobRuleset.internalIdentifier) return <></>;
  return (
    <div className="max-w-screen-sm mx-auto px-4">
      <button
        onClick={handleClick}
        type="button"
        className="w-full my-4 text-left"
      >
        <div className="bg-white shadow-rule-wrapper rounded p-4">
          <div className="flex justify-between">
            <div
              className={`px-2 py-1 rounded ${
                getJobStatus(job) === "In progress"
                  ? "bg-progress-yellow-light text-progress-yellow-dark"
                  : "bg-green-light text-green-dark"
              }`}
            >
              {getJobStatus(job)}
            </div>
            <div>
              <img
                className="h-full float-right"
                src="/vertical-more-black.svg"
                alt="hrv logo icon"
              />
            </div>
          </div>
          <p className="mt-2 text-lg font-semibold">
            {job.jobName || jobRuleset.internalIdentifier}
          </p>
          <p className="mt-1 text-gray-700">{job.address?.address}</p>
        </div>
      </button>
    </div>
  );
};
