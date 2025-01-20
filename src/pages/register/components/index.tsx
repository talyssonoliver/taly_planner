import { styled, Text } from "@ignite-ui/react";
import React from "react";
import type { JSX } from "react";

interface MultiStepProps {
  size: number;
  currentStep?: number;
}

const MultiStepContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  textAlign: "left",
});

const StepInfo = styled("div", {
  marginBottom: "6px",
  fontSize: "$sm",
  textJustify: "left",
  textAlign: "left",
  fontFamily: "$default",
  fontStyle: "normal",
  alignContent: "left",
  fontWeight: "$regular",
  color: "$gray200",

  [`> ${Text}`]: {
    color: "$gray200",
    textAlign: "left",
  },
});

const ProgressBar = styled("div", {
  display: "flex",
  width: "100%",
  maxWidth: "500px",
  height: "5px",
  borderRadius: "10px",
  borderInline: "10px",
  overflow: "hidden",
  textAlign: "left",
});

const ProgressStep = styled("div", {
  flex: 1,
  textAlign: "left",
  justifyContent: "space-between",
  height: "100%",
  "&:not(:last-child)": {
    marginRight: "10px",
  },
  variants: {
    status: {
      past: {
        backgroundColor: "$gray100",
      },
      current: {
        backgroundColor: "$ignite500",
      },
      future: {
        backgroundColor: "$gray600",
      },
    },
  },
});

function MultiStep({ size, currentStep = 0 }: MultiStepProps): JSX.Element {
  return (
    <MultiStepContainer>
      <StepInfo>
        Step {currentStep + 1} of {size}
      </StepInfo>
      <ProgressBar>
        {Array.from({ length: size }).map((_, index) => {
          const stepStatus =
            index < currentStep
              ? "past"
              : index === currentStep
                ? "current"
                : "future";

          return (
            <ProgressStep
              key={`step-${index}-${stepStatus}`}
              status={stepStatus}
            />
          );
        })}
      </ProgressBar>
    </MultiStepContainer>
  );
}

MultiStep.displayName = "MultiStep";

export { MultiStep };
