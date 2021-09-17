import { FC, MouseEventHandler, useContext, useEffect, useState } from "react";
import SanityContext from "../../contexts/SanityContext";
import { MainView, Option, ReportItem, Rule } from "../../types/hrv";
import { HeaderWrapper } from "../HeaderWrapper";
import { handleBackButton } from "./util";

interface RuleHeaderProps {
  rule: Rule;
  setRule: (rule: Rule) => void;
  ruleSetIdentifier: string;
}

const handleExit = ({
  setMainView,
}: {
  setMainView: (view: MainView) => void;
}) => {
  setMainView("jobs");
};

export const RuleHeader: FC<RuleHeaderProps> = ({
  rule,
  setRule,
  ruleSetIdentifier,
}) => {
  const { client, job, setJob, mainView, setMainView } = useContext(
    SanityContext
  );
  const [showPartsBadge, setShowPartsBadge] = useState(false);

  useEffect(() => {
    if (!job.report) {
      setShowPartsBadge(false);
      return;
    }
    const reportItemsWithParts = job.report.filter(
      (reportItem: ReportItem): boolean =>
        !!(reportItem.ruleResponse as Option).partListAdjustments
    );
    if (reportItemsWithParts.length > 0) {
      setShowPartsBadge(true);
      return;
    }
    setShowPartsBadge(false);
  }, [rule, job]);

  const goToParts: MouseEventHandler<HTMLImageElement> = () => {
    switch (mainView) {
      case "rules":
        setMainView("parts");
        break;
      case "parts":
        setMainView("rules");
        break;
      default:
        break;
    }
  };

  return (
    <HeaderWrapper>
      <div className="max-w-screen-sm mx-auto px-4">
        <div className="flex mb-4">
          <div className="flex-1">
            <img className="h-full" src="/hrv-logo.svg" alt="hrv logo icon" />
          </div>
          <div className="flex-grow text-center">
            <span className="p-2 bg-purple-700 rounded">
              {job.jobName || ruleSetIdentifier}
            </span>
          </div>
          <div className="flex-1 relative">
            <img
              onClick={goToParts}
              className="h-full float-right cursor-pointer"
              src="/list-bullets.svg"
              alt="list bullets icon"
            />
            {showPartsBadge && <PartsBadge />}
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <img
              onClick={() =>
                handleBackButton({
                  rule,
                  setRule,
                  job,
                  mainView,
                  setMainView,
                  setJob,
                  client,
                })
              }
              className="h-full cursor-pointer"
              src="/left-chevron.svg"
              alt="left chevron"
            />
          </div>
          <div className="text-center">
            {mainView === "rules" ? rule.phase : "Installation Parts"}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleExit({ setMainView })}
          >
            Exit
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

const PartsBadge: FC = () => (
  <div className="animate animate-pulse absolute -bottom-2 -right-2 w-2 h-2 bg-red-error-text rounded-full" />
);
