import { Box, Button, Center, Flex, Grid, GridItem, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import PasswordInput from '../PasswordInput'
import { useFormContext } from "react-hook-form";

interface LoginPageProps {
  setIsAuthenticated: (v: boolean) => void
  setPassword: (password: string) => void
  password: string
}

const LoginPage: React.FC<LoginPageProps> = (props: LoginPageProps) => {
  const [isFirstUse, setIsFirstUse] = useState<boolean>(true)
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false)
  const toast = useToast()
  const { watch } = useFormContext();

  const loginPassword = watch("loginPassword")
  const confirmPassword = watch("confirmPassword")

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
    window.databaseApi.reqValidatePassword(loginPassword)
  }

  const reqCreatePassword = () => {
    if (!isPasswordValid || loginPassword != confirmPassword) {
      showToast("Form Incomplete", "Please follow the instructions in the form.", "warning")
      return
    }
    window.databaseApi.receiveSetPasswordResult(
      (
        event: Electron.IpcMainEvent,
        result: number,
        errorMessage: string
      ) => {
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
    window.databaseApi.reqSetPassword(loginPassword)
  }

  useEffect(() => {
    window.databaseApi.receiveIsPasswordSet(
      (
        event: Electron.IpcMainEvent,
        result: number,
        passwordSet: boolean,
        errorMessage: string
      ) => {
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

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isFirstUse) {
      reqCreatePassword()
    } else {
      reqAuthenticate()
    }
  }

  return (
    <form onSubmit={onFormSubmit}>
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
              { isFirstUse && <Box>
                <VStack w="60%" pt={2} spacing={2}>
                  <PasswordInput 
                    isPasswordValid={isPasswordValid} 
                    setIsPasswordValid={setIsPasswordValid} 
                    shouldDoValidation={true} 
                    noText 
                    withConfirm 
                    registerText="loginPassword"
                  />
                </VStack>
          
                <Text color="white" fontSize="md" opacity={"0.7"}>
                  Please not that the password you are about to create will be used solely to encrypt the application's database.
                  It is important to understand that this password is not the same as the validator password
                  We cannot recover your password if you forget it, so it's curcial to commit it to memory.
                </Text>
              </Box> }

              { !isFirstUse && <Box>
                  <VStack w="60%" pt={2} spacing={2}>
                    <PasswordInput 
                      isPasswordValid={isPasswordValid} 
                      setIsPasswordValid={setIsPasswordValid} 
                      shouldDoValidation={isFirstUse} 
                      registerText="loginPassword"
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
    </form>
  )
}

export default LoginPage