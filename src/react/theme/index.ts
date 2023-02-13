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
  },
  purple: {
    light: '#474276',
    main: '#3A3479',
    dark: '#2B2852',
  },
  black: '#000',
  white: '#FFF',
  grey: {
    light: '#EDEDF0',
    main: '#E1E1E3',
    dark: '#9696A0',
  },
  green: {
    main: '#008000',
    light: '#2EAA50'
  },
  red: '#ED7171',
}

const CustomSteps = {
  ...StepsTheme,
  baseStyle: (props: any) => {
    return {
      ...StepsTheme.baseStyle(props),
      color: 'black',
      inactiveColor: 'red',
      base: {
        inactiveColor: 'red',
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
        bg: 'red',
        _activeStep: {
          bg: 'red',
        },
        _highlighted: {
          bg: 'red',
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
    Button: {
      variants: {
        'table-button-dark': {
          bg: 'purple.light',
          _hover: { bg: 'red' },
        },
        'table-button-action-complete': {
          bg: 'green',
          textColor: 'white',
        },
        'wizard-nav-button': {
          bg: 'blue.main',
          textColor: 'white',
          _hover: { bg: 'red' },
        },
        'wizard-button-generate': {
          bg: 'green.main',
          textColor: 'white',
          _hover: { bg: 'green.light' },
        }
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
