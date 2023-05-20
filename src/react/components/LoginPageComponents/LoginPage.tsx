import { Box, Button, Center, Flex, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import PasswordInput from '../PasswordInput'


interface LoginPageProps {
  setIsAuthenticated: (v: boolean) => void
  setPassword: (password: string) => void
  password: string
}

const LoginPage: React.FC<LoginPageProps> = (props: LoginPageProps) => {
  const [isFirstUse, setIsFirstUse] = useState<boolean>(true)
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false)
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)

  useEffect(() => {
    window.databaseApi.receiveIsPasswordSet(
          (
              event: Electron.IpcMainEvent,
              result: number,
              passwordStatus: boolean,
              errorMessage: string
          ) => {
              if (result === 0) {
                  setIsFirstUse(!passwordStatus)
              } else {
                  console.error("Error fetching password status");
                  console.error(errorMessage);
              }
          }
      );
      window.databaseApi.reqIsPasswordSet();
  }, []);


  const login = () => {

    window.databaseApi.receiveValidatePasswordResult(
        (
            event: Electron.IpcMainEvent,
            result: number,
            validPassword: boolean,
            errorMessage: string
        ) => {
            if (result === 0) {
              if (validPassword) {
                  props.setIsAuthenticated(true);
                  console.log(props.password)
                  // Add some toast for authentication
                }
                  // Add some toast for failed authentication
            } else {
                console.error("Error validating password");
                console.error(errorMessage);
            }
        }
    );
    window.databaseApi.reqValidatePassword(props.password);  
  }

  const reqCreatePassword = () => {
    window.databaseApi.receiveSetPasswordResult(
      (
          event: Electron.IpcMainEvent,
          result: number,
          body: boolean,
          errorMessage: string
      ) => {
          if (result === 0) {
            props.setIsAuthenticated(true)
          } else {
              console.error("Error fetching password status");
              console.error(errorMessage);
          }
      }
    );
    window.databaseApi.reqSetPassword(props.password);
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
                    { isFirstUse ? "Create your desktop password": "Log in to the Ether.fi desktop app" }
                  </Text>
                  <Text color="white" fontSize="l" opacity={"0.7"}>
                    This password will be used for encrypting your stored data
                  </Text>

                  <VStack w="60%" pt={2} spacing={2}>
                    <PasswordInput 
                      password={props.password} 
                      setPassword={props.setPassword} 
                      isPasswordValid={isPasswordValid} 
                      setIsPasswordValid={setIsPasswordValid} 
                      shouldDoValidation={true} 
                      noText 
                      withConfirm={isFirstUse}
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
                    <Button
                      onClick={isFirstUse ? reqCreatePassword: login}
                      disabled={!isPasswordValid}
                      width={"200px"}
                      alignSelf={"end"}
                    >
                      {isFirstUse ? "Create Password" : "Log In"}
                    </Button>
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