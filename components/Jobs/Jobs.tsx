import { FC, useContext, useEffect, useState } from "react";
import SanityContext from "../../contexts/SanityContext";
import { Job } from "../../types/hrv";
import { HeaderWrapper } from "../HeaderWrapper";
import { JobView } from "../JobView/JobView";

export const Jobs: FC = () => {
  const { client, user } = useContext(SanityContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!user.name) return;
    client
      .fetch(`*[_type == "job" && contractor._ref == $id]`, { id: user._id })
      .then((jobsFromClient: Job[]) => {
        setJobs(jobsFromClient);
      });
  }, [user]);

  return (
    <div className="bg-background min-h-screen">
      <HeaderWrapper>
        <div className="flex justify-between">
          <div className="flex-1 ml-4">
            <img className="h-full" src="/hrv-logo.svg" alt="hrv logo icon" />
          </div>
          <div className="flex-1 text-center text-lg font-semibold">
            Projects
          </div>
          <div className="flex-1 mr-4">
            <img
              className="h-full float-right"
              src="/user-circle.svg"
              alt="hrv logo icon"
            />
          </div>
        </div>
      </HeaderWrapper>
      <ul>
        {jobs.map((job) => (
          <li key={job._id} className="list-none">
            <JobView job={job} />
          </li>
        ))}
      </ul>
    </div>
  );
};
