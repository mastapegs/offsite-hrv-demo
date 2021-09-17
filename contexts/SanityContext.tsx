import { SanityClient } from "@sanity/client";
import { createContext } from "react";
import { Job, MainView, RuleSet, User } from "../types/hrv";

interface SanityContextObject {
  client: SanityClient;
  imageURL: string;
  setImageURL: (urlString: string) => void;
  inputValue: string | number;
  setInputValue: (input: string | number) => void;
  isInputValid: boolean;
  setIsInputValid: (isValid: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  user: User;
  setUser: (user: User) => void;
  ruleset: RuleSet;
  setRuleset: (ruleset: RuleSet) => void;
  job: Job;
  setJob: (job: Job) => void;
  mainView: MainView;
  setMainView: (view: MainView) => void;
  ruleMediaURL: string | null;
  setRuleMediaURL: (url: string | null) => void;
}

const SanityContext = createContext<SanityContextObject>(
  {} as SanityContextObject
);

export default SanityContext;
