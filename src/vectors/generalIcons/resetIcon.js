import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={35}
      height={35}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M21.4 11.543a1.051 1.051 0 0 0 1.052 1.051H33V2.056a1.056 1.056 0 1 0-2.112 0V8.94a15.822 15.822 0 1 0 1.418 15.292 1.08 1.08 0 0 0-1.977-.868 13.672 13.672 0 1 1-1.012-12.881h-6.855a1.052 1.052 0 0 0-1.061 1.06Z"
        fill={props.fillColor ? props.fillColor : "#fff"}
      />
    </Svg>
  )
}

export default SvgComponent