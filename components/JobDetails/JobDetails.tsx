import { SanityClient, SanityDocument } from "@sanity/client";
import { FC, useContext, useState } from "react";
import SanityContext from "../../contexts/SanityContext";
import { Job, MainView } from "../../types/hrv";
import { HeaderWrapper } from "../HeaderWrapper";
import phaseDataJSON from "./phaseData.json";

interface RuleHeaderProps {
  ruleSetIdentifier: string;
}

interface PhaseData {
  title: string;
  data: CardObject[];
}

interface CardObject {
  title: string;
  description: string;
  icon: string;
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
}): void => {
  client
    .patch(job._id)
    .set({ status: "Completed" })
    .commit()
    .then((updatedJob: SanityDocument) => {
      setJob(updatedJob as Job);
      setMainView("jobs");
    });
};

export const JobDetails: FC<RuleHeaderProps> = ({ ruleSetIdentifier }) => {
  const { client, job, setJob, setMainView } = useContext(SanityContext);
  const [phaseData, setPhaseData] = useState<PhaseData[]>(phaseDataJSON);
  const startJob = () => {
    setMainView("rules");
  };
  return (
    <div className="bg-background min-h-screen pb-4">
      <HeaderWrapper>
        <div className="max-w-screen-sm mx-auto px-4">
          <div className="flex mb-4">
            <div className="flex-1">
              <img className="h-full" src="/hrv-logo.svg" alt="hrv logo icon" />
            </div>
            <div className="flex-grow text-center">
              <span className="p-2 bg-purple-700 rounded">
                {ruleSetIdentifier}
              </span>
            </div>
            <div className="flex-1">
              <img
                className="h-full float-right"
                src="/list-bullets.svg"
                alt="list bullets icon"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <img
                onClick={() => setMainView("jobs")}
                className="h-full"
                src="/left-chevron.svg"
                alt="left chevron"
              />
            </div>
            <div className="text-center">Project Details</div>
            <div>
              <img
                className="h-full float-right"
                src="/vertical-more-white.svg"
                alt="hrv logo icon"
              />
            </div>
          </div>
        </div>
      </HeaderWrapper>
      <div className="max-w-screen-sm mx-auto">
        <div className="flex space-x-4 m-4 p-4 rounded bg-get-to-work-bg border border-get-to-work-border">
          <div className="flex-shrink-0">
            <img src="/space-rocket.svg" alt="rocket icon" />
          </div>
          <div>
            <p className="text-gray-900 text-lg font-semibold">Get to work</p>
            <p className="text-gray-700">
              Ready to move on to the product setup and installation steps?
            </p>
            <button
              type="button"
              onClick={startJob}
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded font-bold outline-none"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
      {phaseData.map((phase) => (
        <div className="max-w-screen-sm mx-auto">
          <p className="ml-4 text-lg font-semibold">{phase.title}</p>
          {phase.data.map((card) => (
            <div className="max-w-screen-sm flex space-x-4 m-4 mt-3 p-4 bg-white rounded shadow-rule-wrapper">
              <div className="flex-shrink-0">
                <img src={card.icon} alt="client icon" />
              </div>
              <div>
                <p className="text-gray-900 text-lg font-semibold">
                  {card.title}
                </p>
                <p className="text-gray-700">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="max-w-screen-sm mx-auto">
        <p className="ml-4 text-lg font-semibold">Report</p>
        <div className="max-w-screen-sm mx-auto px-4">
          <div className="bg-white rounded shadow-rule-wrapper p-4 mt-3">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="flex justify-center bg-red-report-icon rounded w-8 h-8">
                  <img
                    height="20"
                    width="20"
                    src="/report-icon.svg"
                    alt="client icon"
                  />
                </div>
              </div>
              <div>
                <p className="text-gray-900 text-lg font-semibold">
                  Project Completion
                </p>
                <p className="text-gray-700">View the report on the project</p>
              </div>
            </div>
            <div className="border-t-2 border-gray-200 w-full mt-2 mb-3 mx-auto" />
            <button
              type="button"
              disabled
              className="opacity-50 block mt-4 mx-auto px-6 py-3 bg-purple-600 text-white rounded font-bold outline-none"
            >
              Send report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
