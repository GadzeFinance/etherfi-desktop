import { AbsoluteCenter, Box, Button, Center, Flex, Grid, GridItem, Input, Text, VStack } from '@chakra-ui/react'
import { Steps } from 'chakra-ui-steps'
import React, { useState } from 'react'
import widgetBoxStyle from '../../styleClasses/widgetBoxStyle'
import PasswordInput from '../PasswordInput'


interface LoginPageProps {
  setIsAuthenticated: (v: boolean) => void
}

const LoginPage: React.FC<LoginPageProps> = (props: LoginPageProps) => {
  const [isFirstUse, setIsFirstUse] = useState<boolean>(true)
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false)
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")

  const reqAuthenticate = () => {
    if (!isPasswordValid) {
      return
    }

    // 

    props.setIsAuthenticated(true)
  
  }

  const reqCreatePassword = () => {
    if (!isPasswordValid) {
      return
    }

    // create password in backend
    
    // TODO: receive the confirmation

    window.databaseApi.reqSetPassword(password);

    // if success, setIsFirstUse(false)
  }

  return (
    <>
    <Box
      display="flex"
      flexDirection={'column'}
      height="100vh"
      >
      <Center flex="auto">
        <Flex
            width={'905px'}
            height={'550px'}
            sx={{
              border: '1px solid',
              borderColor: 'purple.light',
              padding: '24px',
              borderRadius: '16px',
            }}
            
          >
            
            <Flex 
              padding={"24px"}
              direction={"column"}
              gap="16px"
              bgColor="purple.dark"
              height="full"
              width={"full"}
              borderRadius="lg"
              
            >
              <Grid
                height="100%"
                templateRows='repeat(10fr, 1fr)'
              >
                <GridItem>
              <Text color={"white"} fontSize="2xl" fontWeight={"semibold"}>
                { isFirstUse ? "Create a password for future use": "Log in to Ether.fi desktop app" }
              </Text>
              <Text color="white" fontSize="l" opacity={"0.7"}>
                It's time to start your journey with Ether.fi!
              </Text>

              <VStack w="60%" pt={2} spacing={2}>
                <PasswordInput 
                  password={password} 
                  setPassword={setPassword} 
                  isPasswordValid={isPasswordValid} 
                  setIsPasswordValid={setIsPasswordValid} 
                  shouldDoValidation={true} 
                  noText 
                  withConfirm 
                  isConfirmed={isConfirmed}
                  setIsConfirmed={setIsConfirmed}
                />
              </VStack>
              

              <Text color="white" fontSize="md" opacity={"0.7"}>
                Note: Please remember this password for future use. Since this is a decentralized app running in an offline environment, if you forget the password,
                we can't restore the data for you.
              </Text>
              </GridItem>
              <GridItem>
                <Button onClick={reqCreatePassword} width={"200px"} alignSelf={"end"}>Create Password</Button>
              </GridItem>
              </Grid>
              
            </Flex>
            
            
          </Flex>
        </Center>
      </Box>
    </>
  )
}

export default LoginPage