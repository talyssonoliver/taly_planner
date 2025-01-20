import { Box, styled, Text } from "@ignite-ui/react";

export const ConnectBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  justifyContent: "extend",
  alignSelf: "center",
  flexWrap: "wrap",
  flexDirection: "column",
  maxWidth: "500px",
  width: "100%",
});

export const ConnectItem = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$5",
  justifyContent: "space-between",
  border: "1px solid $gray600",
  padding: "$4 $6",
  borderRadius: "$md",
  marginBottom: "$4",
});

export const AuthError = styled(Text, {
  color: "#f75a68",
  marginBottom: "$4",
});
