import { HStack, Spinner, Text } from "@chakra-ui/react";

export const Loading = () => {
  return (
      <HStack colorPalette="blue">
        <Text color="colorPalette.700">Loading...</Text>
        <Spinner
          size="md"
          color="blue"
        />
      </HStack>
  );
}
