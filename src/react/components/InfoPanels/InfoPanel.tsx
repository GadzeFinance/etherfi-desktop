import { Card, Text, CardHeader, Heading, CardBody } from "@chakra-ui/react"
import { FC } from "react"
import { IconKey } from "../Icons"

type Props = {
  title: string
  text: string
  icon: string
}

export const InfoPanel: FC<Props> = ({ text, title, icon }) => {
  return (
    <Card
      h='full'
      w='full'
      bg='purple.darkBackground'
      border='1px solid rgba(255,255,255,0.3)'
      color='white'
      position='relative'
    >
      <IconKey position={'absolute'} bottom={'10px'} right={'10px'} boxSize='48' stroke='rgba(255,255,255,0.1)' />
      <CardHeader>
        <Heading>
          {title}
        </Heading>
      </CardHeader>
      <CardBody>
        <Text>{text}</Text>
      </CardBody>
    </Card>
  )
}