import { Box, Button, Center, Flex, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import PasswordInput from '../PasswordInput'
import { useToast } from '@chakra-ui/react'

interface LoginPageProps {
  setIsAuthenticated: (v: boolean) => void
  setPassword: (password: string) => void
  password: string
}

const LoginPage: React.FC<LoginPageProps> = (props: LoginPageProps) => {
  const [isFirstUse, setIsFirstUse] = useState<boolean>(true)
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const toast = useToast()

  const showToast = (
    title: string, 
    description: string, 
    status: "warning" | "info" | "success" | "error" | "loading"
  ) => {
    toast({
      title,
      description,
      status,
      position: "top-right",
      duration: 9000,
      isClosable: true,
    })
  }

  const reqAuthenticate = () => {
    if (!isPasswordValid) {
      showToast('Authentication Failed.', 'Please input the correct password.', 'warning')
      return
    }

    window.databaseApi.receiveValidatePasswordResult(
      (
        event: Electron.IpcMainEvent,
        result: number,
        valid: boolean,
        errorMessage: string
      ) => {
        if (result === 0) {
          props.setIsAuthenticated(valid);
          if (!valid) {
            showToast('Authentication Failed.', 'Please input the correct password.', 'warning')
          } else {
            showToast('Authentication Passed.', "We've logged you in!", 'success')
          }
        } else {
          showToast('Authentication Failed.', 'Please input the correct password.', 'warning')
          console.error("Error validating password");
          console.error(errorMessage);
        }
      }
    );
    window.databaseApi.reqValidatePassword(props.password)
  }

  const reqCreatePassword = () => {
    if (!isPasswordValid || props.password != confirmPassword) {
      showToast("Form Incomplete", "Please follow the instructions in the form.", "warning")
      return
    }
    window.databaseApi.receiveSetPasswordResult(
      (
        event: Electron.IpcMainEvent,
        result: number,
        errorMessage: string
      ) => {
        console.log("received SetPasswordResult:", result, errorMessage);
        if (result === 0) {
          props.setIsAuthenticated(true);
          showToast("Password Saved!", "You can use this password for future authentication", "success")
        } else {
          showToast("Failed", "Something wrong in the backend", "error")
          console.error("Error setting password");
          console.error(errorMessage);
        }
      }
    );
    window.databaseApi.reqSetPassword(props.password)
  }

  useEffect(() => {
    window.databaseApi.receiveIsPasswordSet(
      (
        event: Electron.IpcMainEvent,
        result: number,
        passwordSet: boolean,
        errorMessage: string
      ) => {
        console.log("received passwordSet:", result, passwordSet, errorMessage);
        if (result === 0) {
          
          setIsFirstUse(!passwordSet);
        } else {
          console.error("Error quering passwordSet");
          console.error(errorMessage);
        }
      }
    );
    window.databaseApi.reqIsPasswordSet();
  }, [])

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

              { isFirstUse && <Box>
                <VStack w="60%" pt={2} spacing={2}>
                  <PasswordInput 
                    password={props.password} 
                    setPassword={props.setPassword} 
                    isPasswordValid={isPasswordValid} 
                    setIsPasswordValid={setIsPasswordValid} 
                    shouldDoValidation={true} 
                    noText 
                    withConfirm 
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                  />
                </VStack>
                

                <Text color="white" fontSize="md" opacity={"0.7"}>
                  Note: Please remember this password for future use. Since this is a decentralized app running in an offline environment, if you forget the password,
                  we can't restore the data for you.
                </Text>
              </Box> }

              { !isFirstUse && <Box>
                  <VStack w="60%" pt={2} spacing={2}>
                    <PasswordInput 
                      password={props.password} 
                      setPassword={props.setPassword} 
                      isPasswordValid={isPasswordValid} 
                      setIsPasswordValid={setIsPasswordValid} 
                      shouldDoValidation={isFirstUse} 
                      noText
                    />
                  </VStack>
                </Box>}

              </GridItem>
              <GridItem>
                { isFirstUse ?
                  <Button onClick={reqCreatePassword} width={"200px"} alignSelf={"end"}>Create Password</Button> :
                  <Button onClick={reqAuthenticate} width={"200px"} alignSelf={"end"}>Log in</Button> }
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