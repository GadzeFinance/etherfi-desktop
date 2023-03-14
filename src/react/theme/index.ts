/* eslint-disable @typescript-eslint/no-explicit-any */
import { extendTheme } from '@chakra-ui/react'
import { StepsTheme } from 'chakra-ui-steps'

const Colors = {
  backGround: '#2A2852',
  hover: '#696885',
  blue: {
    light: '#9DC2FF',
    main: '#5581E7',
    dark: '#2264D1',
    secondary: '#88ACFF',
  },
  purple: {
    light: '#474276',
    main: '#3A3479',
    dark: '#2B2852',
    darker: '#602BA7',
    primary: '#9F62F2',
    darkBackground: '#211F45',
  },
  black: '#000',
  white: '#FFF',
  navy: '#2B2852',
  grey: {
    transparent: 'rgba(255, 255, 255, 0.2)',
    light: 'rgba(255, 255, 255, 0.45)',
    main: '#E1E1E3',
    dark: '#9696A0',
    primary: '#19163B',
  },
  green: {
    main: '#008000',
    light: '#2EAA50',
    successLight: '#00F17D',
  },
  red: {
    primary: '#ED7171',
    warning: '#F94545',
  },
  yellow: {
    alert: '#FFC700',
  },
}

const CustomSteps = {
  ...StepsTheme,
  baseStyle: (props: any) => {
    return {
      ...StepsTheme.baseStyle(props),
      color: 'black',
      inactiveColor: 'red.primary',
      base: {
        inactiveColor: 'red.primary',
      },
      icon: {
        ...StepsTheme.baseStyle(props).icon,
        // your custom styles here
        strokeWidth: '5px',
      },
      label: {
        ...StepsTheme.baseStyle(props).label,
        color: 'white',
        fontSize: '16px',
      },
      step: {
        ...StepsTheme.baseStyle(props).step,
        color: 'white',
        fontSize: '16px',
      },
      stepIconContainer: {
        ...StepsTheme.baseStyle(props).stepIconContainer,
        bg: 'red.primary',
        _activeStep: {
          bg: 'red.primary',
        },
        _highlighted: {
          bg: 'red.primary',
        },
      },
    }
  },
}

const theme = extendTheme({
  colors: Colors,
  fonts: {
    heading: `'Work Sans', sans-serif`,
    body: `'Work Sans', sans-serif`,
  },
  styles: {
    global: () => ({
      tbody: {
        tr: {
          'td:first-of-type': {
            borderTopLeftRadius: 'xl',
            borderBottomLeftRadius: 'xl',
          },
          'td:last-of-type': {
            borderRightRadius: 'xl',
          },
        },
      },
    }),
  },
  components: {
    Icon: {
      variants: {
        'clickable-icon': {
          borderRadius: '20%',
          _hover: {
            color: 'white',
            boxShadow: '0 0 20px grey',
            bg: 'grey.transparent',
          },
          _active: { bg: 'grey.transparent' },
          color: 'blue.secondary',
        },
      },
    },
    Text: {
      variants: {
        'alert-text': {
          color: 'yellow.alert',
          fontSize: '12px',
        },
        'warning-text': {
          color: 'red.warning',
          fontSize: '12px',
        },
      },
    },
    Button: {
      variants: {
        'wizard-nav-button': {
          bg: 'blue.main',
          textColor: 'white',
          _hover: { bg: 'red.primary' },
        },
        'white-button': {
          fontSize: '14px',
          minW: '150px',
          bg: 'white',
          textColor: 'grey.primary',
          _hover: {
            bg: 'purple.primary',
            textColor: 'grey.primary',
            _disabled: { bg: 'grey.transparent' },
          },
          _active: {
            bg: 'purple.darker',
            textColor: 'white',
            _disabled: { textColor: 'grey.primary' },
          },
          _disabled: { bg: 'grey.transparent' },
        },
        'back-button': {
          fontSize: '14px',
          minW: '150px',
          bg: 'grey.transparent',
          textColor: 'white',
          _hover: { bg: 'grey.light' },
          _active: {
            bg: 'grey.transparent',
            textColor: 'purple.dark',
          },
        },
        'browse-folder-button': {
          textColor: 'white',
          border: '2px solid white',
          _hover: { bg: 'grey.light' },
          _active: {
            bg: 'white',
            textColor: 'purple.dark',
          },
        },
        'blur-button': {
          bg: 'transparent',
          color: 'grey',
          _hover: { bg: 'grey.dark', color: 'grey.light' },
          _active: { color: 'white', bg: 'grey.light' },
        },
      },
    },
    Spinner: {
      variants: {
        'exit-spinner': {
          height: '40px',
          width: '40px',
          color: 'red.400',
          speed: '0.6s',
        },
      },
    },
    Table: {
      color: 'white',
    },
    Steps: CustomSteps,
  },
})

export default theme
