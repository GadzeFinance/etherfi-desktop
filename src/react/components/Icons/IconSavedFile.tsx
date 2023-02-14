import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'


const IconSavedFile: React.FC<IconProps> = (props) => (
    <Icon viewBox='0 0 40 40' {...props}>
        <rect width="40" height="40" rx="20" fill="#308c7c" />
        <path
            d="M12 28H28C28.5304 28 29.0391 27.7893 29.4142 27.4142C29.7893 27.0391 30 26.5304 30 26V16C30 15.4696 29.7893 14.9609 29.4142 14.5858C29.0391 14.2107 28.5304 14 28 14H20.07C19.7406 13.9983 19.4167 13.9152 19.1271 13.7582C18.8375 13.6012 18.5912 13.3751 18.41 13.1L17.59 11.9C17.4088 11.6249 17.1625 11.3988 16.8729 11.2418C16.5833 11.0848 16.2594 11.0017 15.93 11H12C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13V26C10 27.1 10.9 28 12 28Z"
            fill="#308c7c"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            d="M17 21L19 23L23 19"
            fill="#308c7c"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />

    </Icon >
)


export default IconSavedFile
