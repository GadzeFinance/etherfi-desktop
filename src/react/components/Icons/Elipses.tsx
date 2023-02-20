import { Icon, IconProps } from '@chakra-ui/react'
import React from 'react'



interface FadeOptions {
    [key: string]: {
        x1: string;
        y1: string;
        x2: string;
        y2: string;
    }
}

const fadeOptions: FadeOptions = {
    'smallRed': { x1: "40.7992", y1: "20.8351", x2: "5.219", y2: "89.5926" },
    'largeRed': { x1: "16.7992", y1: "53.8351", x2: "130.219", y2: "85.5926" },
    'mediumBlue': { x1: "150.219", y1: "89.5926", x2: "50.7992", y2: "23.8351" },
    'smallBlue': { x1: "150.219", y1: "89.5926", x2: "50.7992", y2: "23.8351" }
}

interface ElipseProps extends IconProps {
    fadestyle: string,
}

export const ClockWiseElipse: React.FC<ElipseProps> = (props) => {
    return (
        < Icon viewBox="0 0 135 135" {...props} fill="none" >
            <path d="M99.1096 121.329C90.2484 126.445 80.2623 129.296 70.0359 129.631C59.8094 129.966 49.6582 127.773 40.4814 123.248C31.3047 118.722 23.3856 112.004 17.4257 103.687C11.4658 95.3695 7.64908 85.711 6.31354 75.5666C4.978 65.4222 6.1649 55.105 9.76911 45.5288C13.3733 35.9527 19.2836 27.4132 26.9764 20.6668C34.6692 13.9204 43.907 9.17534 53.8717 6.85191C63.8364 4.52847 74.2202 4.69839 84.1035 7.34662"
                stroke={`url(#${props.fadestyle})`}
                strokeWidth="10.3698"
                strokeLinecap="round" />
            <defs>
                <linearGradient id={`${props.fadestyle}`} {...fadeOptions[props.fadestyle]} gradientUnits="userSpaceOnUse">
                    <stop offset="0.398439" stopColor="#ED7171" />
                    <stop offset="0.775727" stopColor="#ED7171" stopOpacity="0" />
                </linearGradient>
            </defs>
        </Icon >
    )
}

export const CounterClockWiseElipse: React.FC<ElipseProps> = (props) => (
    <Icon viewBox="0 0 135 135" {...props} fill="none" >
        <path d="M99.1096 121.329C90.2484 126.445 80.2623 129.296 70.0359 129.631C59.8094 129.966 49.6582 127.773 40.4814 123.248C31.3047 118.722 23.3856 112.004 17.4257 103.687C11.4658 95.3695 7.64908 85.711 6.31354 75.5666C4.978 65.4222 6.1649 55.105 9.76911 45.5288C13.3733 35.9527 19.2836 27.4132 26.9764 20.6668C34.6692 13.9204 43.907 9.17534 53.8717 6.85191C63.8364 4.52847 74.2202 4.69839 84.1035 7.34662"
            stroke={`url(#${props.fadestyle})`}
            strokeWidth="10.3698"
            strokeLinecap="round" />
        <defs>
            <linearGradient id={`${props.fadestyle}`} {...fadeOptions[props.fadestyle]} gradientUnits="userSpaceOnUse">
                <stop offset="0.398439" stopColor="#5581E7" />
                <stop offset="0.775727" stopColor="#5581E7" stopOpacity="0.01" />
            </linearGradient>
        </defs>
    </Icon>
)

