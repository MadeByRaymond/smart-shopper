import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={26}
      height={26}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.5}
        y={0.5}
        width={25}
        height={25}
        rx={10.5}
        fill={props.checkedStatus ? props.theme?.secondaryColor : 'transparent'}
        stroke={props.checkedStatus ? props.theme?.secondaryColor : '#D4D4D5'}
      />
      <Path
        d="M7 13.5l3.5 4 9-8.5"
        stroke={props.checkedStatus ? props.theme?.primaryColor : 'transparent'}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SvgComponent
