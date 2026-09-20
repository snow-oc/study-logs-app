import { Button, type ButtonProps } from "@chakra-ui/react";

type Props = ButtonProps;

export const DangerButton = (props: Props) => {
  const { children, ...rest } = props;
  return (
    <Button
      {...rest}
      backgroundColor="#ef4444"
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
