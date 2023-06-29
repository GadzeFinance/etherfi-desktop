import { Card, Text, CardHeader, Heading, CardBody, Image } from "@chakra-ui/react"
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
          <Image boxShadow='xl' src={imageUrl} alt={title} borderRadius="sm" position="absolute" right='20px' bottom='20px' maxH={180} />
        )}
      </CardBody>
    </Card>
  )
}