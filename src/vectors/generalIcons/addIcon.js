import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13.5 7H8V1.5a.5.5 0 10-1 0V7H1.5a.5.5 0 00-.5.5.455.455 0 00.5.47H7v5.53a.5.5 0 001 0V8h5.5a.5.5 0 000-1z"
        fill={props.theme.primaryColor}
        stroke={props.theme.primaryColor}
      />
    </Svg>
  )
}

export default SvgComponent
