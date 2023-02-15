import { COLORS } from './constants'

const tabButtonStyle = {
    height: '36px',
    width: '180px',
    borderRadius: '0.375rem',
    bg: "rgba(0, 0, 0, 0)",
    _selected: { bg: COLORS.tabSelectionBlue, _hover: {bg: COLORS.tabSelectionBlue}},
    _hover: { bg: "rgba(0, 0, 0, 0)" },
    fontSize: '15px',
    color: 'white'
}

export default tabButtonStyle
