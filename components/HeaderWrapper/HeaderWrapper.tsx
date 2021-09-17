import { FC } from "react";

export const HeaderWrapper: FC = ({ children }) => (
  <header className="bg-purple-600 text-white font-medium text-xl py-4">
    {children}
  </header>
);
