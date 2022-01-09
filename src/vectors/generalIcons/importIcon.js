import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={26}
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1 14.333v8A2.667 2.667 0 0 0 3.667 25h16a2.667 2.667 0 0 0 2.666-2.667v-8M11.667 17l4.666-4.667M11.667 1v16V1Zm0 16L7 12.333 11.667 17Z"
        stroke= {props.colors ? props.colors.textPrimary : "#021032"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SvgComponent
