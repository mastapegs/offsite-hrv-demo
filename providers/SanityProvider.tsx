import sanityClient from "@sanity/client";
import { FC, useState } from "react";
import SanityContext from "../contexts/SanityContext";
import { Job, MainView, RuleSet, User } from "../types/hrv";

const client = sanityClient({
  projectId: `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2021-05-01",
  token: `${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

const SanityProvider: FC = ({ children }) => {
  const [imageURL, setImageURL] = useState("");
  const [inputValue, setInputValue] = useState<string | number>("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({} as User);
  const [ruleset, setRuleset] = useState({} as RuleSet);
  const [job, setJob] = useState({} as Job);
  const [mainView, setMainView] = useState<MainView>("login");
  const [ruleMediaURL, setRuleMediaURL] = useState<string | null>(null);
  return (
    <>
      <SanityContext.Provider
        value={{
          client,
          imageURL,
          setImageURL,
          inputValue,
          setInputValue,
          isInputValid,
          setIsInputValid,
          isAuthenticated,
          setIsAuthenticated,
          user,
          setUser,
          ruleset,
          setRuleset,
          job,
          setJob,
          mainView,
          setMainView,
          ruleMediaURL,
          setRuleMediaURL,
        }}
      >
        {children}
      </SanityContext.Provider>
    </>
  );
};

export default SanityProvider;
