import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={23}
      height={23}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9.541 2.347a7.196 7.196 0 11-7.19 7.197 7.23 7.23 0 017.19-7.197zm0-1.347a8.544 8.544 0 100 17.087A8.544 8.544 0 009.541 1zM21.811 20.907l-4.843-4.877-.933.927 4.843 4.876a.658.658 0 00.933-.926z"
        fill= {props.colors ? props.colors.textPrimary : "#02103294"}
        stroke={props.colors ? props.colors.textPrimary : "#02103294"}
      />
    </Svg>
  )
}

export default SvgComponent