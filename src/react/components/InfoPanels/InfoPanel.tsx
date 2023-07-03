import { Box, Card, Text, CardHeader, Heading, CardBody, Image } from "@chakra-ui/react"
import { FC } from "react"

type Props = {
  title: string
  text: string
  imageUrl?: string
}

export const InfoPanel: FC<Props> = ({ text, title, imageUrl }) => {
  return (
    <Card
      w='full'
      h='full'
      bg='purple.darkBackground'
      border='1px solid rgba(255,255,255,0.3)'
      color='white'
      position='relative'
    >
      <CardHeader pb={0}>
        <Heading>
          {title}
        </Heading>
      </CardHeader>
      <CardBody h='inherit'>
        <Text fontSize='sm'>{text}</Text>
        {imageUrl && (
          <Box h="180px" maxW="400px" position="absolute" right='20px' bottom='20px'>
            <Image boxShadow='xl' src={imageUrl} alt={title} borderRadius="sm" maxW='full' maxH='full' />
          </Box>
        )}
      </CardBody>
    </Card>
  )
}