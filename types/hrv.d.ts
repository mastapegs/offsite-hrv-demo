import { SanityDocument } from "@sanity/client";

export interface RuleSet {
  internalIdentifier: string;
  startingRule: ChoiceRule | InputRule;
}

export interface AdditionalRuleInformation {
  additionalInfoLabel: string;
  additionalInfoMedia: MediaType[];
}

export interface Rule {
  _id: string;
  _type: "choiceRule" | "inputRule" | "terminatorRule";
  title: string;
  phase: string;
  internalIdentifier: string;
  description: Block[];
  media?: MediaType[];
  additionalInformation: AdditionalRuleInformation;
}

export interface ChoiceRule extends Rule {
  _type: "choiceRule";
  options: Option[];
}

export interface InputRule extends Rule {
  _type: "inputRule";
  validationRule?: string;
  options: Option[];
  inputType: "input-picture" | "input-number" | "input-text";
  nextRuleTarget: Reference;
}

export interface TerminatorRule extends Rule {
  _type: "terminatorRule";
}

export interface Part {
  internalIdentifier: string;
  description: string;
  type: string;
}

export interface PartAddition {
  _key: string;
  partToAdd: Reference;
  quantity: number;
}

export interface Option {
  answerLabel: string;
  internalIdentifier: string;
  answerTarget: Reference;
  partListAdjustments?: PartAddition[];
}

export interface Reference {
  _ref: string;
  _type: "reference";
}

export interface Block {
  children: BlockChildren[];
}

export interface BlockChildren {
  text: string;
}

type MediaType =
  | ExternalImageMedia
  | ImageMedia
  | VideoMedia
  | LinkMedia
  | TextMedia;

export interface TextMedia {
  _type: "textMedia";
  text: Block[];
}

export interface ExternalImageMedia {
  _type: "externalImageMedia";
  imageUrl: string;
  altText: string;
}

export interface ImageMedia {
  _type: "imageMedia";
  _key: string;
  altText: string;
  image: {
    asset: Reference;
  };
}

export interface VideoMedia {
  _type: "videoMedia";
  videoUrl: string;
  altText: string;
}

export interface LinkMedia {
  _type: "linkMedia";
  link: string;
  linkText: string;
}

export interface User {
  _type: "user";
  _id: string;
  name: string;
  username: string;
  password: string;
}

export interface JobNameObject {
  prefix: string;
  first: string;
  middle: string;
  last: string;
  suffix: string;
  nickname: string;
}

export interface JobAddressObject {
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  zip4: string;
}

export interface JobContactObject {
  phoneType: string;
  phoneNumber: string;
  bestDaytoCall: string;
  bestTimeToCall: string;
  alternatePhoneType: string;
  alternatePhoneNumber: string;
}

export interface SavedKeyedInput {
  keyedInput: string;
}

export interface SavedMediaInput {
  media: ImageMedia[];
}

export type RuleResponse = Option | SavedKeyedInput | SavedMediaInput;

export interface ReportItem {
  rule: Reference;
  ruleResponse: RuleResponse;
}

export interface Job extends SanityDocument {
  jobName?: string;
  contractor: User;
  ruleset: Reference;
  status?: "In progress" | "Interrupted" | "Completed";
  relationship?: string;
  phase?: string;
  name?: JobNameObject;
  address?: JobAddressObject;
  contact?: JobContactObject;
  report?: ReportItem[];
}

export type MainView = "login" | "jobs" | "jobDetails" | "rules" | "parts";

export interface PartsByType {
  type: string;
  parts: PartAddition[];
}
