import { FC } from "react";

export const RuleBodyWrapper: FC = ({ children }) => (
  <div className="max-w-screen-sm mx-auto px-4">
    <div className="bg-white shadow-rule-wrapper rounded my-6 p-6">
      {children}
    </div>
  </div>
);
