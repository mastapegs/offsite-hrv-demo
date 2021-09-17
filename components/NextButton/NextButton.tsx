import { FC, SyntheticEvent } from "react";

interface NextButtonProps {
  handleNext: (event: SyntheticEvent) => void;
  text: string;
  nextButtonDisabled: boolean;
}

export const NextButton: FC<NextButtonProps> = ({
  handleNext,
  text,
  nextButtonDisabled,
}) => (
  <>
    <input
      onClick={handleNext}
      className="active:animate-ripple transition-colors duration-500 disabled:bg-opacity-50 block rounded text-2xl p-4 w-4/5 max-w-screen-sm mx-auto bg-purple-600 text-white"
      type="button"
      value={text}
      disabled={nextButtonDisabled}
    />
  </>
);
