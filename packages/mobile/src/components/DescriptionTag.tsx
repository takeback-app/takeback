import React from 'react'

import { Flex, IFlexProps, ScrollView, Text } from 'native-base'

interface DescriptionTagProps extends IFlexProps {
  description: string
}
export function DescriptionTag(props: DescriptionTagProps) {
  const { description, ...rest } = props
  return (
    <Flex
      flexDirection="row"
      align="center"
      px={1}
      py={0.5}
      width={'110%'}
      rounded="sm"
      bg="white"
      borderColor={'green.500'}
      borderWidth={1}
      {...rest}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Flex justify="center" height="100%">
          <Text color="green.500" fontSize="8px" fontWeight="bold">
            {description}
          </Text>
        </Flex>
      </ScrollView>
    </Flex>
  )
}
