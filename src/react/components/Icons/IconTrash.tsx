import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'

const IconTrash: React.FC<IconProps> = (props) => (
  <Icon viewBox="0 0 16 18" {...props}>
    <path
      fill="none"
      d="M10.2833 6.50043L9.995 14.0004M6.005 14.0004L5.71667 6.50043M14.0233 3.82543C14.3083 3.86877 14.5917 3.9146 14.875 3.96377M14.0233 3.82543L13.1333 15.3946C13.097 15.8656 12.8842 16.3056 12.5375 16.6265C12.1908 16.9474 11.7358 17.1256 11.2633 17.1254H4.73667C4.26425 17.1256 3.80919 16.9474 3.46248 16.6265C3.11578 16.3056 2.90299 15.8656 2.86667 15.3946L1.97667 3.82543M14.0233 3.82543C13.0616 3.68003 12.0948 3.56968 11.125 3.4946M1.97667 3.82543C1.69167 3.86793 1.40833 3.91377 1.125 3.96293M1.97667 3.82543C2.93844 3.68003 3.9052 3.56968 4.875 3.4946M11.125 3.4946V2.73127C11.125 1.74793 10.3667 0.927934 9.38333 0.897101C8.46135 0.867633 7.53865 0.867633 6.61667 0.897101C5.63333 0.927934 4.875 1.74877 4.875 2.73127V3.4946M11.125 3.4946C9.04477 3.33383 6.95523 3.33383 4.875 3.4946"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
)

export default IconTrash