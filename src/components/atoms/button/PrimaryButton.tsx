import { Button, type ButtonProps } from "@chakra-ui/react";

type Props = ButtonProps

export const PrimaryButton = (props: Props) => {
  const { children, ...rest } = props;
  return (
    <Button
      {...rest}
      backgroundColor="#2563eb"
      border="none"
      borderRadius="md"
      color="white"
      cursor="pointer"
      _hover={{opacity: 0.8}}
    >
      {children}
    </Button>
  );
}
