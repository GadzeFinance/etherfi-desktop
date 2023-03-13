import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'


interface IconAlertTriangleProps extends IconProps {
    triangleColor: string,
}

const IconAlertTriangle: React.FC<IconAlertTriangleProps> = (props) => (
    <Icon viewBox="0 0 16 16" {...props} fill="none">
        <path d="M13.8315 11.599L9.03537 3.20552C8.93079 3.02099 8.77914 2.8675 8.59587 2.76071C8.41261 2.65392 8.2043 2.59766 7.9922 2.59766C7.7801 2.59766 7.57179 2.65392 7.38853 2.76071C7.20527 2.8675 7.05361 3.02099 6.94903 3.20552L2.15286 11.599C2.04715 11.782 1.99172 11.9898 1.99219 12.2012C1.99266 12.4126 2.04901 12.6201 2.15552 12.8027C2.26204 12.9853 2.41494 13.1365 2.59872 13.241C2.7825 13.3454 2.99063 13.3995 3.20202 13.3976H12.7944C13.0047 13.3973 13.2114 13.3418 13.3935 13.2365C13.5756 13.1311 13.7268 12.9797 13.8319 12.7975C13.9369 12.6152 13.9922 12.4086 13.9922 12.1982C13.9921 11.9878 13.9367 11.7812 13.8315 11.599Z"
            stroke={props.triangleColor} strokeWidth="1.19905" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6V8.66667"
            stroke={props.triangleColor} strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path d="M8 11.332H8.00667"
            stroke={props.triangleColor}
            strokeWidth="1.33333" strokeLinecap="round"
            strokeLinejoin="round" />
    </Icon>
)


export default IconAlertTriangle

