import { Box, styled, Text, TextArea, Button } from "@ignite-ui/react";

export const ProfileBox = styled(Box, {
  marginTop: "$6",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "$4",

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "$2",
  },
});

export const FormAnnotation = styled(Text, {
  color: "$gray200",
  fontSize: "$2",
});

export const Preview = styled(Box, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center", // Centraliza a imagem
  gap: "$2",
  marginBottom: "$4",
  marginTop: "$2",
  [`> ${Text}`]: {
    maskType: "$2",
    color: "$gray200",
  },
});

export const FormError = styled(Text, {
  color: "#f75a68",
  marginBottom: "$4",
});

export const StyledTextArea = styled(TextArea, {
  width: "100%", // Faz o textarea ocupar o espaço total disponível
  height: "48px", // Ajuste a altura para combinar com o botão
  resize: "none", // Evita redimensionamento
  padding: "$3",
  borderRadius: "$md",
  border: "1px solid $gray400",
  backgroundColor: "$gray900",
  color: "$gray100",

  "&:focus": {
    borderColor: "$ignite500",
    outline: "none",
  },
});

export const StyledButton = styled(Button, {
  width: "100%", // Certifique-se de que o botão também ocupa o espaço total
  height: "48px", // Correspondendo à altura do textarea
});
